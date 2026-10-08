(() => {
  "use strict";
  const concepts = {
    "cmd-select": "auswählen ausgeben anzeigen abfragen lesen spalten projektion",
    "cmd-distinct": "doppelt doppelte duplikate eindeutig einmalig entfernen",
    "cmd-where": "filtern filter einschränken selektion bedingung zeilen datensätze suchen",
    "cmd-order": "sortieren sortierung reihenfolge aufsteigend absteigend alphabetisch ordnen",
    "cmd-filter-patterns": "filtern filter textmuster muster beginnt enthält bereich zwischen liste suchen",
    "cmd-group": "gruppieren gruppierung zusammenfassen bündeln gruppen",
    "cmd-having": "gruppen filtern gruppenfilter aggregatbedingung kennzahlen einschränken",
    "cmd-join": "tabellen verbinden verknüpfen verknüpfung zusammenführen beziehung join",
    "cmd-database": "datenbank erstellen anlegen erzeugen schema auswählen wechseln",
    "cmd-primary-key": "primärschlüssel primaerschluessel hauptschlüssel eindeutig identifizieren automatisch nummerieren",
    "cmd-foreign-key": "fremdschlüssel fremdschluessel referenz verweis integrität beziehung verknüpfen",
    "cmd-create": "tabelle erstellen anlegen erzeugen struktur attribute datentypen",
    "cmd-insert": "einfügen hinzufügen neu erfassen speichern datensatz daten",
    "cmd-update": "ändern bearbeiten aktualisieren korrigieren ersetzen daten",
    "cmd-delete": "löschen entfernen datensatz daten",
    "cmd-functions": "zählen anzahl summe summieren durchschnitt mittelwert minimum maximum kleinster größter aggregatfunktion kennzahlen",
    "cmd-date": "datum jahr monat tage differenz zeitabstand altersberechnung"
  };
  const normalize = value => String(value ?? "").toLocaleLowerCase("de-DE")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ").trim();
  const stopWords = new Set(["ich", "wie", "kann", "man", "mit", "den", "die", "das", "der", "ein", "eine", "einen", "und", "oder", "nach", "von", "zu", "sql", "befehl"]);

  function near(a, b) {
    if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > 1) return false;
    let left = 0, right = 0, edits = 0;
    while (left < a.length && right < b.length) {
      if (a[left] === b[right]) { left++; right++; continue; }
      if (++edits > 1) return false;
      if (a.length >= b.length) left++;
      if (b.length >= a.length) right++;
    }
    return edits + (a.length - left) + (b.length - right) <= 1;
  }

  function search(commands, query) {
    const normalized = normalize(query).slice(0, 200);
    const terms = normalized.split(" ").filter(term => term && !stopWords.has(term));
    if (!terms.length) return commands.slice();
    return commands.map((command, index) => {
      const fields = [
        [normalize(command.title), 12],
        [normalize([concepts[command.id] || "", command.searchTerms || ""].join(" ")), 8],
        [normalize(command.short || command.description), 5],
        [normalize([command.category, ...(command.details || [])].join(" ")), 2]
      ];
      let score = normalize(command.title) === normalized ? 30 : 0;
      for (const term of terms) {
        let match = 0;
        for (const [field, weight] of fields) {
          for (const word of field.split(" ")) {
            const value = word === term ? weight : word.startsWith(term) || term.startsWith(word) && word.length >= 4 && term.length - word.length <= 3
              ? weight * 0.7 : near(word, term) ? weight * 0.4 : 0;
            match = Math.max(match, value);
          }
        }
        if (!match) return { command, index, score: 0 };
        score += match;
      }
      return { command, index, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).map(item => item.command);
  }
  window.WORKBENCH_COMMAND_SEARCH = { search };
})();
