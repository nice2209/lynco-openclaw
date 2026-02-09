import json
import os
import sys
from pathlib import Path
import urllib.request

NOTION_VERSION = "2025-09-03"

page_id = sys.argv[1]

auth_path = Path.home() / ".config" / "notion" / "api_key"
key = auth_path.read_text(encoding="utf-8").strip()

payload = {
    "parent": {"type": "page_id", "page_id": page_id},
    "title": [{"type": "text", "text": {"content": "Lynco Leads"}}],
    "properties": {
        "Name": {"title": {}},
        "Company": {"rich_text": {}},
        "Email": {"email": {}},
        "Message": {"rich_text": {}},
        "Source": {
            "select": {
                "options": [
                    {"name": "Landing"},
                ]
            }
        },
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
    },
}

req = urllib.request.Request(
    "https://api.notion.com/v1/databases",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {key}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        print(body)
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="replace")
    print(body)
    sys.exit(1)
