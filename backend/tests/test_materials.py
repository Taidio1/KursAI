import pytest
from fastapi.testclient import TestClient

def test_get_materials_empty(client: TestClient):
    response = client.get("/materials")
    # Expected to fail with 404 until we register the router
    assert response.status_code == 200
    assert response.json() == []
