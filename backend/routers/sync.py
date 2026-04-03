# backend/routers/sync.py
import os
from fastapi import APIRouter, HTTPException, Depends, Header
from services.notion_service import fetch_course_pages, fetch_page_blocks, parse_notion_blocks_to_slides
from supabase import create_client, Client

router = APIRouter(prefix="/sync", tags=["sync"])

def get_supabase() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )

def verify_admin(x_admin_secret: str = Header(...)):
    expected_secret = os.environ.get("ADMIN_SECRET", "dev_secret")
    if x_admin_secret != expected_secret:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@router.post("/notion")
def sync_notion(admin: bool = Depends(verify_admin)):
    db_id = os.environ.get("NOTION_DATABASE_ID")
    if not db_id:
        raise HTTPException(status_code=500, detail="NOTION_DATABASE_ID not configured")
        
    try:
        pages = fetch_course_pages(db_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch from Notion: {str(e)}")
        
    supabase = get_supabase()
    
    synced_lessons = 0
    synced_slides = 0
    
    course_resp = supabase.table("courses").select("id").limit(1).execute()
    if not course_resp.data:
        raise HTTPException(status_code=500, detail="No courses found in database.")
    default_course_id = course_resp.data[0]["id"]
    
    for page in pages:
        page_id = page["id"]
        title_prop = page.get("properties", {}).get("Name", {}).get("title", [])
        title = "".join([t.get("plain_text", "") for t in title_prop]) if title_prop else "Untitled"
        
        mode = "technical"
        
        lesson_lookup = supabase.table("lessons").select("id").eq("notion_id", page_id).execute()
        
        if lesson_lookup.data:
            lesson_id = lesson_lookup.data[0]["id"]
            supabase.table("lessons").update({"title": title}).eq("id", lesson_id).execute()
        else:
            lesson_insert = supabase.table("lessons").insert({
                "course_id": default_course_id,
                "title": title,
                "notion_id": page_id
            }).execute()
            lesson_id = lesson_insert.data[0]["id"]
            
        synced_lessons += 1
        
        supabase.table("slides").delete().eq("lesson_id", lesson_id).execute()
        
        blocks = fetch_page_blocks(page_id)
        slides_data = parse_notion_blocks_to_slides(blocks)
        
        for i, slide in enumerate(slides_data):
            supabase.table("slides").insert({
                "lesson_id": lesson_id,
                "mode": mode,
                "order": i,
                "content_json": slide["content_json"]
            }).execute()
            synced_slides += 1
            
    return {"status": "success", "lessons_synced": synced_lessons, "slides_created": synced_slides}