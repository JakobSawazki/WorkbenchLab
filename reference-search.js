(() => {
  "use strict";
  const terms = {
    "Entitätstyp": "entitaet objekt klasse ding modell erm eerm eer",
    "Beziehungstyp": "beziehung zusammenhang verbinden modell erm eerm eer",
    "Kardinalität": "anzahl beziehung eins viele 1 n m n optional pflicht modell erm eerm eer",
    "Beziehungsentität": "zwischentabelle verbindungstabelle m n beziehung auflösen modell erm eerm eer",
    "Relation": "tabelle datensatz attribut spalte zeile",
    "Primärschlüssel": "hauptschlüssel eindeutig identifizieren primary key pk",
    "Fremdschlüssel": "verweis referenz verknüpfen foreign key fk integrität",
    "Projektion": "spalten auswählen anzeigen ausgeben select",
    "Selektion": "filtern filter einschränken bedingung zeilen auswählen where",
    "DISTINCT": "doppelt doppelte duplikate eindeutig einmalig entfernen",
    "LIKE, IN, BETWEEN": "filtern filter textmuster muster beginnt enthält bereich zwischen suchen",
    "Join": "tabellen verbinden verknüpfen verknüpfung zusammenführen",
    "Parent und Child": "eltern kind parent child referenz fremdschlüssel primärschlüssel",
    "Auto Increment": "automatisch nummerieren fortlaufend nummer id",
    "3NF": "normalisieren normalisierung dritte normalform redundanz doppelte daten abhängigkeit",
    "HAVING": "gruppen filtern gruppenfilter aggregatbedingung kennzahlen einschränken",
    "Big Data": "massendaten digitale spuren datenschutz profile volumen geschwindigkeit vielfalt 3v"
  };

  function entries(content) {
    return [
      { id: "start-guide", title: "Workbench starten und verbinden", category: "Startanleitung", short: "Vom Informatik-Stick zur ersten Abfrage: MySQL starten, CMD offen lassen und Workbench öffnen.", searchTerms: "video animation anleitung startreihenfolge starten verbinden verbindung einrichten mysql mariadb server dienst konsole cmd" },
      { id: "connection-guide", title: "Lokale Verbindung einrichten", category: "Verbindung", short: "MySQL Connections local Standard TCP/IP Hostname 127.0.0.1 Port 3306 Benutzer root Test Connection ready for connections SELECT VERSION Passwort Kompatibilitätswarnung", searchTerms: "verbinden verbindung einrichten connection adresse server zugang fehler mariadb" },
      ...content.tools.map((item, index) => ({ ...item, id: `tool-${index}`, category: "Werkzeuge", details: [item.note || ""], searchTerms: item.visual === "stick" ? "usb start schultasche starten download" : item.visual === "mysql-service" ? "server starten mariadb cmd konsole dienst" : "modellieren diagramm erm eerm eer sql editor" })),
      ...content.tutorials.map(item => ({ ...item, id: `tutorial-${item.id}`, category: "Videos", details: [item.topic, item.lesson, ...item.lessonCodes, item.channel], searchTerms: `video tutorial film ${/ER|eERM/.test(item.title) ? "modellieren modell erm eerm eer zeichnen beziehung" : "sql datenbank tabelle"}` })),
      ...content.sources.map((item, index) => ({ ...item, id: `source-${index}`, category: "Quellen", searchTerms: "quelle material unterricht bildungsplan" })),
      ...content.reference.map((item, index) => ({ ...item, id: `term-${index}`, category: "Begriffe und Muster", details: [item.code], searchTerms: terms[item.title] || "" }))
    ];
  }
  window.WORKBENCH_REFERENCE_SEARCH = { entries, search: (content, query) => window.WORKBENCH_COMMAND_SEARCH.search(entries(content), query) };
})();
