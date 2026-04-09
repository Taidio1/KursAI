import os
import asyncio
import uuid
import mimetypes
from fastapi import APIRouter, HTTPException, Header, UploadFile, File
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


class BlogPostCreate(BaseModel):
    title: str
    lead: Optional[str] = ""
    author: Optional[str] = ""
    tags: Optional[List[str]] = []
    content_markdown: Optional[str] = ""
    status: Optional[str] = "draft"


@router.post("/posts", status_code=201)
async def create_post(
    body: BlogPostCreate,
    x_admin_secret: Optional[str] = Header(None),
):
    _require_admin(x_admin_secret)
    supabase = get_supabase_service()

    # Generuj slug z tytułu
    import re
    import unicodedata
    raw = unicodedata.normalize("NFD", body.title)
    raw = raw.encode("ascii", "ignore").decode("ascii")
    slug_base = re.sub(r"[^a-z0-9]+", "-", raw.lower()).strip("-") or "wpis"
    # Upewnij się że slug jest unikalny
    slug = slug_base
    suffix = 1
    while True:
        existing = supabase.table("blog_posts").select("id").eq("slug", slug).execute()
        if not existing.data:
            break
        slug = f"{slug_base}-{suffix}"
        suffix += 1

    data = {
        "title": body.title,
        "lead": body.lead,
        "author": body.author,
        "tags": body.tags,
        "content_markdown": body.content_markdown,
        "status": body.status,
        "slug": slug,
    }
    try:
        response = supabase.table("blog_posts").insert(data).execute()
        return response.data[0] if response.data else {}
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


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    x_admin_secret: Optional[str] = Header(None),
):
    _require_admin(x_admin_secret)

    # Walidacja typu MIME
    ALLOWED_MIME = {"image/png", "image/gif", "image/jpeg", "image/webp"}
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0] or ""
    if mime not in ALLOWED_MIME:
        raise HTTPException(status_code=415, detail=f"Niedozwolony typ pliku: {mime}. Obsługiwane: PNG, GIF, JPEG, WebP.")

    # Walidacja rozmiaru (max 5 MB)
    MAX_SIZE = 5 * 1024 * 1024
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Plik jest za duży. Maksymalny rozmiar to 5 MB.")

    # Generuj unikalną nazwę pliku zachowując oryginalne rozszerzenie
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    filename = f"{uuid.uuid4().hex}.{ext}"
    storage_path = f"blog/{filename}"

    # Upload do Supabase Storage (bucket: blog-images)
    supabase = get_supabase_service()
    try:
        supabase.storage.from_("blog-images").upload(
            path=storage_path,
            file=contents,
            file_options={"content-type": mime},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd Supabase Storage: {str(e)}")

    # Zbuduj publiczny URL
    supabase_url = os.environ.get("SUPABASE_URL", "")
    public_url = f"{supabase_url}/storage/v1/object/public/blog-images/{storage_path}"

    return {"url": public_url}


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