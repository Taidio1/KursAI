import pytest
from unittest.mock import patch, MagicMock

def test_get_slides_returns_list(client):
    mock_response = MagicMock()
    mock_response.data = [
        {"id": "1", "lesson_id": "lesson-1", "mode": "technical", "order": 0,
         "content_json": {"type": "text", "data": {"content": "Hello"}}, "bot_comment": None}
    ]

    with patch("routers.slides.get_supabase") as mock_get_supabase:
        mock_supabase = MagicMock()
        # Chain: .table().select().eq().order().execute()
        (mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .order.return_value
            .execute.return_value) = mock_response
        mock_get_supabase.return_value = mock_supabase

        response = client.get("/slides/lesson-1")

    assert response.status_code == 200
    assert len(response.json()["slides"]) == 1
    assert response.json()["slides"][0]["mode"] == "technical"

def test_get_slides_filters_by_mode(client):
    mock_response = MagicMock()
    mock_response.data = []

    with patch("routers.slides.get_supabase") as mock_get_supabase:
        mock_supabase = MagicMock()
        # Chain with mode filter: .table().select().eq().eq().order().execute()
        (mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .eq.return_value
            .order.return_value
            .execute.return_value) = mock_response
        mock_get_supabase.return_value = mock_supabase

        response = client.get("/slides/lesson-1?mode=practical")

    assert response.status_code == 200
    assert response.json()["slides"] == []
