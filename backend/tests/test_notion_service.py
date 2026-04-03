# backend/tests/test_notion_service.py
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.notion_service import parse_notion_blocks_to_slides

def test_parse_blocks():
    blocks = [
        {"type": "heading_1", "heading_1": {"rich_text": [{"plain_text": "Slide 1"}]}},
        {"type": "paragraph", "paragraph": {"rich_text": [{"plain_text": "Content 1"}]}},
        {"type": "heading_2", "heading_2": {"rich_text": [{"plain_text": "Slide 2"}]}},
        {"type": "code", "code": {"language": "python", "rich_text": [{"plain_text": "print('hello')"}]}}
    ]
    
    slides = parse_notion_blocks_to_slides(blocks)
    assert len(slides) == 2
    assert slides[0]["content_json"][0]["type"] == "text"
    assert "Content 1" in slides[0]["content_json"][0]["content"]
    assert slides[1]["content_json"][0]["type"] == "code"
    assert slides[1]["content_json"][0]["content"] == "print('hello')"
