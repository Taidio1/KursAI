from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

from dependencies import get_supabase_service

router = APIRouter(prefix="/materials", tags=["materials"])

class Material(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    url: str
    category: str
    price: Optional[str] = None
    icon_url: Optional[str] = None
    tags: List[str] = []
    is_published: bool

@router.get("/", response_model=List[Material])
async def get_materials():
    supabase = get_supabase_service()
    try:
        response = supabase.table("materials").select("*").eq("is_published", True).execute()
        return response.data
    except Exception as e:
        print(f"Backend Error in /materials: {str(e)}")
        # Zwracamy błąd HTTP, aby frontend wiedział, że coś poszło nie tak
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
