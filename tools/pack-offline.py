"""Package only the builder's public manifest using the standard ZIP library."""

import json
import os
from pathlib import Path, PurePosixPath
import sys
import tempfile
import zipfile


def pack(directory, target, names):
    root = Path(directory).resolve(strict=True)
    target = Path(target)
    if len(names) != len(set(names)):
        raise ValueError("Duplicate archive entry")
    files = []
    for name in names:
        parts = PurePosixPath(name).parts
        if (not parts or any(part in (".", "..") or part.startswith(".") for part in parts)
                or PurePosixPath(name).is_absolute() or "\\" in name or ":" in name
                or name != "/".join(parts) or "desktop.ini" in parts):
            raise ValueError("Unsafe archive path")
        source = root.joinpath(*parts)
        if source.is_symlink() or not source.resolve(strict=True).is_relative_to(root) or not source.is_file():
            raise ValueError("Unsafe archive source")
        files.append((name, source))
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(prefix="workbenchlab-", suffix=".zip", dir=target.parent, delete=False) as handle:
            temporary = handle.name
        with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for name, source in sorted(files):
                info = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, source.read_bytes())
        os.replace(temporary, target)
    finally:
        if temporary and os.path.exists(temporary):
            os.unlink(temporary)


if __name__ == "__main__":
    pack(sys.argv[1], sys.argv[2], json.load(sys.stdin))
