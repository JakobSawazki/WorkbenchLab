(function (root) {
  "use strict";

  const key = value => String(value).toLowerCase();
  const quote = value => `"${String(value).replaceAll('"', '""')}"`;
  const encoded = value => Array.from(key(value), char => char.codePointAt(0).toString(16)).join("_");
  const statementTypes = new Set(["select", "insert", "replace", "update", "delete", "create", "drop", "alter", "truncate"]);

  // Logical MySQL schemas share one SQLite connection, with collision-free names.
  // All names are rewritten through the parser AST, never inside SQL text values.
  function create(db, parser, feedback) {
    const schemas = new Map();
    const tables = new Map();
    let current = null;
    db.run("PRAGMA foreign_keys = ON;");
    db.create_function("DATABASE", () => current);

    function schemaName(name = current) {
      if (!name) throw new Error("Keine Datenbank ausgewählt. Wähle zuerst mit USE eine Datenbank.");
      const schema = schemas.get(key(name));
      if (!schema) throw new Error(`Die Datenbank ${name} gibt es noch nicht. Lege sie mit CREATE DATABASE an.`);
      return schema;
    }

    function physical(name, schema) {
      const database = schemaName(schema);
      const id = `__wbl_${encoded(database)}__${encoded(name)}`;
      tables.set(id, { database, name });
      return id;
    }

    function catalog() {
      const present = new Set(db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.map(row => row[0]) || []);
      return [...schemas.values()].map(database => ({
        name: database,
        tables: [...tables].filter(([id, table]) => present.has(id) && key(table.database) === key(database)).map(([id, table]) => ({
          name: table.name,
          columns: db.exec(`PRAGMA table_info(${quote(id)})`)[0]?.values.map(row => ({ name: row[1], type: row[2], primaryKey: Boolean(row[5]) })) || []
        })).sort((a, b) => a.name.localeCompare(b.name))
      }));
    }

    function externalReferences(targets) {
      const names = db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.map(row => row[0]) || [];
      return names.some(name => !targets.has(name) && (db.exec(`PRAGMA foreign_key_list(${quote(name)})`)[0]?.values || []).some(row => targets.has(row[2])));
    }

    function transform(ast, outer = new Map(), inheritedCtes = new Set()) {
      const defaultSchema = ast.type === "create" && ast.keyword === "table" ? ast.table?.[0]?.db || current : current;
      const bindings = new Map(outer);
      const ctes = new Set(inheritedCtes);
      for (const item of ast.with || []) ctes.add(key(item.name.value));
      const local = new Map();
      const bind = (name, value) => {
        const id = key(name);
        if (local.has(id) && local.get(id) !== value) local.set(id, null);
        else local.set(id, value);
      };
      function scan(node) {
        if (!node || typeof node !== "object") return;
        if (node !== ast && statementTypes.has(node.type) && !node.action) return;
        if (Array.isArray(node)) { node.forEach(scan); return; }
        if (typeof node.table === "string" && node.type !== "column_ref" && Object.hasOwn(node, "db")) {
          const name = node.table;
          const database = node.db || defaultSchema;
          if (!node.db && ctes.has(key(name))) { bind(name, name); return; }
          const id = physical(name, database);
          bind(`${database}.${name}`, node.as || id);
          bind(node.as || name, node.as || id);
          node.db = null;
          node.table = id;
        } else if (node.expr?.ast && node.as) {
          bind(node.as, node.as);
        }
        for (const value of Object.values(node)) scan(value);
      }
      scan(ast);
      for (const [name, value] of local) bindings.set(name, value);
      function rewrite(node) {
        if (!node || typeof node !== "object") return;
        if (node !== ast && statementTypes.has(node.type) && !node.action) { transform(node, bindings, ctes); return; }
        if (Array.isArray(node)) { node.forEach(rewrite); return; }
        if (node.type === "column_ref" && node.table) {
          const reference = node.db ? `${node.db}.${node.table}` : node.table;
          const id = bindings.get(key(reference));
          if (id === null) throw new Error(`Der Tabellenname ${reference} ist mehrdeutig. Verwende einen Alias oder den Datenbanknamen.`);
          if (id) { node.table = id; delete node.db; }
        }
        if (["single_quote_string", "double_quote_string"].includes(node.type)) {
          const unescaped = node.value.replace(/\\(.)/gs, (_, char) => ({ "0": "\u0000", b: "\b", n: "\n", r: "\r", t: "\t", Z: "\u001a", "%": "\\%", "_": "\\_" }[char] ?? char));
          const decoded = node.type === "single_quote_string" ? unescaped.replaceAll("''", "'") : unescaped.replaceAll('""', '"');
          if (decoded.includes("\u0000")) throw new Error("Text mit Nullzeichen wird im Browser-Labor nicht unterstützt.");
          node.type = "single_quote_string";
          node.value = decoded.replaceAll("'", "''");
        }
        if (node.resource === "table" && node.action === "rename" && typeof node.table === "string") node.table = physical(node.table, current);
        for (const value of Object.values(node)) rewrite(value);
      }
      rewrite(ast);
      if (ast.type === "create" && ast.keyword === "table") {
        if ((ast.table_options || []).some(option => !["engine", "charset", "character set", "collate"].includes(option.keyword.replace(/^default\s+/i, "").toLowerCase()))) {
          throw new Error("Diese Tabellenoption wird im Browser-Labor nicht unterstützt.");
        }
        ast.table_options = null;
        for (const column of ast.create_definitions || []) {
          if (column.auto_increment) {
            if (!/^(?:INT|INTEGER|BIGINT|SMALLINT|TINYINT|MEDIUMINT)$/i.test(column.definition?.dataType || "")) {
              throw new Error("AUTO_INCREMENT benötigt eine ganzzahlige Schlüsselspalte.");
            }
            const tablePrimary = ast.create_definitions.find(def => def.constraint_type?.toLowerCase() === "primary key" && def.definition?.length === 1 && def.definition[0].column === column.column.column);
            if (!column.primary_key && !tablePrimary) throw new Error("AUTO_INCREMENT wird im Browser-Labor nur für einen einzelnen Primärschlüssel unterstützt.");
            column.definition = { dataType: "INTEGER", suffix: [] };
            column.primary_key = "primary key autoincrement";
            delete column.auto_increment;
            if (tablePrimary) ast.create_definitions = ast.create_definitions.filter(def => def !== tablePrimary);
          }
        }
      }
      return ast;
    }

    function executeStatement(ast) {
      if (ast.type === "create" && ["database", "schema"].includes(ast.keyword)) {
        const name = ast.database?.schema?.[0]?.value;
        if (!name) throw new Error("Der Datenbankname fehlt.");
        if (schemas.has(key(name)) && !ast.if_not_exists) throw new Error(`Die Datenbank ${name} gibt es bereits.`);
        if (!schemas.has(key(name))) schemas.set(key(name), name);
        return [];
      }
      if (ast.type === "use") { current = schemaName(ast.db); return []; }
      if (ast.type === "drop" && ["database", "schema"].includes(ast.keyword)) {
        if (!schemas.has(key(ast.name)) && ast.prefix === "if exists") return [];
        const name = schemaName(ast.name);
        const schemaTables = catalog().find(item => item.name === name).tables;
        if (externalReferences(new Set(schemaTables.map(table => physical(table.name, name))))) throw new Error("Die Datenbank wird über Fremdschlüssel aus einer anderen Datenbank verwendet.");
        // Dropping a complete schema also removes its internal FK relationships.
        db.run("PRAGMA foreign_keys = OFF;");
        try {
          for (const table of schemaTables) db.run(`DROP TABLE ${quote(physical(table.name, name))}`);
          schemas.delete(key(name));
          if (current && key(current) === key(name)) current = null;
        } finally { db.run("PRAGMA foreign_keys = ON;"); }
        return [];
      }
      if (ast.type === "show" && ast.keyword === "databases") return [{ columns: ["Database"], values: [...schemas.values()].sort().map(name => [name]) }];
      if (ast.type === "show" && ast.keyword === "tables") {
        const name = schemaName();
        return [{ columns: [`Tables_in_${name}`], values: catalog().find(item => item.name === name).tables.map(table => [table.name]) }];
      }
      if (ast.type === "desc") {
        const name = physical(ast.table);
        const result = db.exec(feedback.rewriteMysql(`DESCRIBE ${name};`));
        if (!result.length) throw new Error(`no such table: ${name}`);
        return result;
      }
      if (!statementTypes.has(ast.type) || (ast.type === "create" && ast.keyword !== "table") || (ast.type === "drop" && ast.keyword !== "table")) {
        throw new Error("Diese Anweisung wird im Browser-Labor noch nicht unterstützt. Nutze dafür MySQL Workbench.");
      }
      const transformed = transform(ast);
      if (ast.type === "truncate") {
        const name = transformed.name[0].table;
        if (externalReferences(new Set([name]))) throw new Error("TRUNCATE ist nicht möglich: Eine andere Tabelle verweist per Fremdschlüssel auf diese Tabelle.");
        db.run(`DELETE FROM ${quote(name)};`);
        if (db.exec("SELECT name FROM sqlite_master WHERE name='sqlite_sequence'").length) {
          const statement = db.prepare("DELETE FROM sqlite_sequence WHERE name = ?");
          try { statement.run([name]); } finally { statement.free(); }
        }
        return [];
      }
      const sql = feedback.rewriteMysql(parser.sqlify(transformed));
      if (ast.type === "select") {
        const statement = db.prepare(sql);
        try {
          const result = { columns: statement.getColumnNames(), values: [] };
          while (statement.step()) result.values.push(statement.get());
          return [result];
        } finally { statement.free(); }
      }
      return db.exec(sql);
    }

    function exec(sql) {
      let parsed;
      try { parsed = parser.astify(String(sql)); }
      catch (cause) {
        const location = cause.location?.start;
        const error = new Error(`Der SQL-Text konnte nicht gelesen werden${location ? ` (Zeile ${location.line}, Spalte ${location.column})` : ""}. Prüfe die Schreibweise. Nicht alle MySQL-Anweisungen werden im Browser unterstützt.`, { cause });
        error.completedStatements = 0;
        error.results = [];
        throw error;
      }
      const statements = Array.isArray(parsed) ? parsed : [parsed];
      const results = [];
      let completed = 0;
      for (const statement of statements) {
        if (!statement) continue;
        try { results.push(...executeStatement(statement)); completed++; }
        catch (cause) {
          let message = cause.message;
          for (const [id, table] of tables) message = message.replaceAll(id, `${table.database}.${table.name}`);
          const error = new Error(message, { cause });
          error.completedStatements = completed;
          error.results = results;
          throw error;
        }
      }
      return results;
    }

    return { exec, catalog, get currentDatabase() { return current; }, getRowsModified() { return db.getRowsModified(); }, close() { db.close(); } };
  }

  root.WORKBENCH_SQL_WORKSPACE = { create };
})(typeof window === "object" ? window : globalThis);
