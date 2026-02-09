import json
import sys
from pathlib import Path
import urllib.request

NOTION_VERSION = "2022-06-28"

db_id = sys.argv[1]
key = (Path.home() / ".config" / "notion" / "api_key").read_text(encoding="utf-8").strip()

payload = {
    "properties": {
        "Company": {"rich_text": {}},
        "Email": {"email": {}},
        "Message": {"rich_text": {}},
        "Source": {"select": {"options": [{"name": "Landing"}]}},
        "Status": {
            "select": {
                "options": [
                    {"name": "New"},
                    {"name": "Contacted"},
                    {"name": "Qualified"},
                    {"name": "Closed"},
                ]
            }
        },
        "Created At": {"date": {}},
    }
}

req = urllib.request.Request(
    f"https://api.notion.com/v1/databases/{db_id}",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {key}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    },
    method="PATCH",
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(e.read().decode("utf-8", errors="replace"))
    raise
