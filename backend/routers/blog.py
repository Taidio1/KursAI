from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from dependencies import get_supabase_anon

router = APIRouter(prefix="/blog", tags=["blog"])

class BlogPostSummary(BaseModel):
    id: str
    slug: str
    title: str
    lead: str
    tags: List[str]
    published_at: Optional[datetime]
    reading_time: Optional[int]
    author: str

class BlogPostFull(BlogPostSummary):
    content_markdown: str

@router.get("", response_model=List[BlogPostSummary])
async def get_blog_posts():
    supabase = get_supabase_anon()
    try:
        response = (
            supabase.table("blog_posts")
            .select("id, slug, title, lead, tags, published_at, reading_time, author")
            .eq("status", "published")
            .order("published_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{slug}", response_model=BlogPostFull)
async def get_blog_post(slug: str):
    supabase = get_supabase_anon()
    try:
        response = (
            supabase.table("blog_posts")
            .select("id, slug, title, lead, content_markdown, tags, published_at, reading_time, author")
            .eq("status", "published")
            .eq("slug", slug)
            .single()
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="Post not found")
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")