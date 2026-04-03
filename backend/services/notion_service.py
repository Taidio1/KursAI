# backend/services/notion_service.py
import os
from notion_client import Client

def get_notion_client() -> Client:
    return Client(auth=os.environ.get("NOTION_API_KEY"))

def fetch_course_pages(database_id: str):
    notion = get_notion_client()
    response = notion.databases.query(
        **{
            "database_id": database_id,
            "filter": {
                "or": [
                    {
                        "property": "Ścieżka",
                        "select": {
                            "equals": "Wspólna"
                        }
                    },
                    {
                        "property": "Kategoria",
                        "multi_select": {
                            "contains": "Technical"
                        }
                    }
                ]
            }
        }
    )
    return response.get("results", [])

def fetch_page_blocks(page_id: str):
    notion = get_notion_client()
    blocks = []
    cursor = None
    while True:
        response = notion.blocks.children.list(block_id=page_id, start_cursor=cursor)
        blocks.extend(response.get("results", []))
        cursor = response.get("next_cursor")
        if not cursor:
            break
    return blocks

def parse_notion_blocks_to_slides(blocks: list) -> list:
    slides = []
    current_slide_content = []
    
    for block in blocks:
        b_type = block.get("type")
        
        if b_type in ["heading_1", "heading_2"]:
            if current_slide_content:
                slides.append({"content_json": current_slide_content})
                current_slide_content = []
            
            text = "".join([t.get("plain_text", "") for t in block[b_type].get("rich_text", [])])
            current_slide_content.append({
                "type": "text",
                "content": f"<h2>{text}</h2>" if b_type == "heading_2" else f"<h1>{text}</h1>"
            })
            
        elif b_type == "paragraph":
            text = "".join([t.get("plain_text", "") for t in block[b_type].get("rich_text", [])])
            if text:
                current_slide_content.append({"type": "text", "content": f"<p>{text}</p>"})
                
        elif b_type == "code":
            text = "".join([t.get("plain_text", "") for t in block[b_type].get("rich_text", [])])
            lang = block[b_type].get("language", "text")
            current_slide_content.append({"type": "code", "language": lang, "content": text})
            
        elif b_type == "image":
            img_url = ""
            if block["image"].get("type") == "external":
                img_url = block["image"]["external"]["url"]
            elif block["image"].get("type") == "file":
                img_url = block["image"]["file"]["url"]
                
            if img_url:
                current_slide_content.append({"type": "image", "url": img_url, "alt": "Notion Image"})

    if current_slide_content:
        slides.append({"content_json": current_slide_content})
        
    return slides
