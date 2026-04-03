# backend/tests/test_sync_router.py
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_sync_notion_unauthorized():
    response = client.post("/sync/notion")
    assert response.status_code == 422 # FastAPI raises 422 for missing headers by default
    
    response2 = client.post("/sync/notion", headers={"x-admin-secret": "wrong"})
    assert response2.status_code == 401