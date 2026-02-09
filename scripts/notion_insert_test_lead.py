import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
import urllib.request

NOTION_VERSION = "2022-06-28"
NOTION_PAGES_URL = "https://api.notion.com/v1/pages"

db_id = sys.argv[1]

key = (Path.home() / ".config" / "notion" / "api_key").read_text(encoding="utf-8").strip()

now = datetime.now(timezone.utc).isoformat()

payload = {
    "parent": {"database_id": db_id},
    "properties": {
        "Name": {"title": [{"text": {"content": "현큐 테스트"}}]},
        "Company": {"rich_text": [{"text": {"content": "Lynco Test Co"}}]},
        "Email": {"email": "hyunq-test@example.com"},
        "Message": {"rich_text": [{"text": {"content": "노션 저장 테스트입니다."}}]},
        "Source": {"select": {"name": "Landing"}},
        "Status": {"select": {"name": "New"}},
        "Created At": {"date": {"start": now}},
    },
}

req = urllib.request.Request(
    NOTION_PAGES_URL,
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
    raise
