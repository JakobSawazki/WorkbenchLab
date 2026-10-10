import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("pack_offline", Path(__file__).resolve().parents[1] / "tools/pack-offline.py")
offline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(offline)


class OfflineArchiveTests(unittest.TestCase):
    def test_reproducible_manifest_only(self):
        with tempfile.TemporaryDirectory(prefix="workbenchlab-zip-test-") as directory:
            root = Path(directory)
            (root / "index.html").write_text("test", encoding="utf-8")
            (root / "desktop.ini").write_text("excluded", encoding="utf-8")
            target = root / "output.zip"
            offline.pack(root, target, ["index.html"])
            first = target.read_bytes()
            offline.pack(root, target, ["index.html"])
            self.assertEqual(target.read_bytes(), first)
            with zipfile.ZipFile(target) as archive:
                self.assertEqual(archive.namelist(), ["index.html"])
                self.assertEqual(archive.read("index.html"), b"test")

    def test_rejects_unsafe_or_duplicate_names_before_writing(self):
        with tempfile.TemporaryDirectory(prefix="workbenchlab-zip-test-") as directory:
            root = Path(directory)
            target = root / "output.zip"
            for name in ["../secret", "/secret", "C:/secret", "a\\secret", "a/../secret", "./secret", "a//secret", "desktop.ini", ".git/config"]:
                with self.subTest(name=name), self.assertRaises(ValueError):
                    offline.pack(root, target, [name])
                self.assertFalse(target.exists())
            with self.assertRaises(ValueError):
                offline.pack(root, target, ["index.html", "index.html"])
            self.assertFalse(target.exists())


if __name__ == "__main__":
    unittest.main()
