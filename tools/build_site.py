"""Copy site/ to _site/ for publishing, preparing Lacey and Audrey's own uploads on the way.

Every image in photos/theirs is turned upright, stripped of its metadata (including any
location), saved as a JPEG no larger than 2000px, and given an 900px thumbnail in
photos/theirs/s/. Paths in data/their-photos.json are rewritten to the .jpg names.

    python tools/build_site.py [site] [_site]
"""
import json
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

FULL, THUMB = 2000, 900
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}


def save(img, size, dest, icc):
    copy = img.copy()
    copy.thumbnail((size, size), Image.LANCZOS)
    copy.save(dest, "JPEG", quality=82, optimize=True, progressive=True, icc_profile=icc)


def main(src="site", out="_site"):
    src, out = Path(src), Path(out)
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(src, out, ignore=shutil.ignore_patterns(".gitkeep", ".DS_Store"))

    theirs = out / "photos" / "theirs"
    (theirs / "s").mkdir(parents=True, exist_ok=True)
    for path in sorted(theirs.iterdir()):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        with Image.open(path) as raw:
            icc = raw.info.get("icc_profile")
            img = ImageOps.exif_transpose(raw).convert("RGB")
        full = path.with_suffix(".jpg")
        if full != path:
            path.unlink()
        save(img, FULL, full, icc)
        save(img, THUMB, theirs / "s" / full.name, icc)
        print(f"prepared {full.name}")

    data = out / "data" / "their-photos.json"
    photos = json.loads(data.read_text() or "[]")
    for p in photos:
        if p.get("image"):
            p["image"] = str(Path(p["image"]).with_suffix(".jpg"))
    data.write_text(json.dumps(photos, indent=2))


if __name__ == "__main__":
    main(*sys.argv[1:])
