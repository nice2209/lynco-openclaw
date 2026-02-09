import json
import sys
from pathlib import Path
import urllib.request

NOTION_VERSION = "2025-09-03"

db_id = sys.argv[1]
key = (Path.home() / ".config" / "notion" / "api_key").read_text(encoding="utf-8").strip()

req = urllib.request.Request(
    f"https://api.notion.com/v1/databases/{db_id}",
    headers={
        "Authorization": f"Bearer {key}",
        "Notion-Version": NOTION_VERSION,
    },
    method="GET",
)

with urllib.request.urlopen(req, timeout=30) as resp:
    print(resp.read().decode("utf-8"))
