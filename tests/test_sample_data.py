import sqlite3
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "assets/sql/l1-4-fahrschule-beispieldaten.sql"
L2_SCRIPT = Path(__file__).resolve().parents[1] / "assets/sql/l2-2-fahrschule-beispieldaten.sql"


class SampleDataTest(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute(
            "CREATE TABLE fahrschueler ("
            "schuelernr INTEGER PRIMARY KEY, nachname TEXT, vorname TEXT, "
            "telefon TEXT, email TEXT, strasse TEXT, hausnr TEXT, "
            "plz TEXT, ort TEXT, geburtsdatum TEXT, fahrstundenzahl INTEGER)"
        )
        script = SCRIPT.read_text(encoding="utf-8").replace("USE fahrschule;", "")
        self.db.executescript(script)

    def tearDown(self):
        self.db.close()

    def test_original_selection_tasks_have_distinct_results(self):
        conditions = [
            ("ort = 'Schorndorf'", 3),
            ("nachname = 'Dressel'", 2),
            ("fahrstundenzahl > 20", 2),
            ("geburtsdatum < '2001-01-01'", 2),
            ("nachname LIKE 'D%'", 3),
            ("ort = 'Schorndorf' AND strasse = 'Drosselweg'", 2),
            ("geburtsdatum BETWEEN '2000-01-01' AND '2001-12-31'", 2),
            ("geburtsdatum < '2000-01-01' OR geburtsdatum > '2001-12-31'", 3),
            ("NOT ort = 'Schorndorf'", 2),
        ]
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM fahrschueler").fetchone()[0], 5)
        for condition, count in conditions:
            with self.subTest(condition=condition):
                actual = self.db.execute(
                    f"SELECT COUNT(*) FROM fahrschueler WHERE {condition}"
                ).fetchone()[0]
                self.assertEqual(actual, count)


class TwoTableSampleDataTest(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys = ON")
        self.db.executescript(
            "CREATE TABLE orte (ortnr INTEGER PRIMARY KEY, plz TEXT, ort TEXT);"
            "CREATE TABLE fahrschueler ("
            "schuelernr INTEGER PRIMARY KEY, nachname TEXT, vorname TEXT, "
            "telefon TEXT, email TEXT, strasse TEXT, hausnr TEXT, "
            "geburtsdatum TEXT, fahrstundenzahl INTEGER, ortnr INTEGER NOT NULL, "
            "FOREIGN KEY (ortnr) REFERENCES orte(ortnr));"
        )
        script = L2_SCRIPT.read_text(encoding="utf-8").replace("USE fahrschule_l2;", "")
        self.db.executescript(script)

    def tearDown(self):
        self.db.close()

    def test_every_student_references_an_existing_place(self):
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM orte").fetchone()[0], 3)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM fahrschueler").fetchone()[0], 5)
        result = self.db.execute(
            "SELECT o.ort, COUNT(*) FROM orte AS o "
            "JOIN fahrschueler AS f ON f.ortnr = o.ortnr "
            "GROUP BY o.ortnr ORDER BY o.ortnr"
        ).fetchall()
        self.assertEqual(result, [("Musterstadt", 2), ("Testdorf", 2), ("Beispielheim", 1)])
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE fahrschueler SET ortnr = 999 WHERE schuelernr = 1")


if __name__ == "__main__":
    unittest.main()
