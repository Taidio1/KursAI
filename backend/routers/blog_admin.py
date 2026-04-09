import os
import asyncio
from fastapi import APIRouter, HTTPException, Header
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone

from dependencies import get_supabase_service

router = APIRouter(prefix="/blog-admin", tags=["blog-admin"])


def _require_admin(x_admin_secret: Optional[str] = Header(None)):
    if x_admin_secret != os.environ.get("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Forbidden")


class BlogPostAdmin(BaseModel):
    id: str
    slug: str
    title: str
    lead: str
    tags: List[str]
    status: str
    scheduled_at: Optional[datetime]
    published_at: Optional[datetime]
    reading_time: Optional[int]
    author: str
    created_at: Optional[datetime]
    content_markdown: Optional[str] = None


class BlogPostPatch(BaseModel):
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    title: Optional[str] = None
    lead: Optional[str] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    content_markdown: Optional[str] = None


@router.get("/posts", response_model=List[BlogPostAdmin])
async def get_all_posts(x_admin_secret: Optional[str] = Header(None)):
    _require_admin(x_admin_secret)
    supabase = get_supabase_service()
    try:
        response = (
            supabase.table("blog_posts")
            .select("id, slug, title, lead, tags, status, scheduled_at, published_at, reading_time, author, created_at, content_markdown")
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/posts/{post_id}")
async def update_post(
    post_id: str,
    patch: BlogPostPatch,
    x_admin_secret: Optional[str] = Header(None),
):
    _require_admin(x_admin_secret)
    supabase = get_supabase_service()
    data = {k: v for k, v in patch.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    # Jeśli zmieniamy status na published i brak published_at — ustaw teraz
    if data.get("status") == "published" and "published_at" not in data:
        data["published_at"] = datetime.now(timezone.utc).isoformat()
    try:
        response = (
            supabase.table("blog_posts")
            .update(data)
            .eq("id", post_id)
            .execute()
        )
        return {"updated": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, x_admin_secret: Optional[str] = Header(None)):
    _require_admin(x_admin_secret)
    supabase = get_supabase_service()
    try:
        supabase.table("blog_posts").delete().eq("id", post_id).execute()
        return {"deleted": post_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def _auto_publish_loop():
    """Co minutę publikuje wpisy których scheduled_at <= now()."""
    while True:
        await asyncio.sleep(60)
        try:
            supabase = get_supabase_service()
            now = datetime.now(timezone.utc).isoformat()
            supabase.table("blog_posts").update({
                "status": "published",
                "published_at": now,
            }).eq("status", "scheduled").lte("scheduled_at", now).execute()
        except Exception as e:
            print(f"[auto-publish] error: {e}")