from typing import Optional
from fastapi import APIRouter, Query

from dependencies import get_supabase_service

router = APIRouter(prefix="/slides", tags=["slides"])

@router.get("/{lesson_id}")
def get_slides(lesson_id: str, mode: Optional[str] = Query(None)):
    supabase = get_supabase_service()
    query = supabase.table("slides").select("*").eq("lesson_id", lesson_id)
    if mode:
        query = query.eq("mode", mode)
    response = query.order("order").execute()
    return {"slides": response.data}
