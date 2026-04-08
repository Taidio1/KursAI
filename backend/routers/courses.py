from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from dependencies import get_supabase_service

router = APIRouter(prefix="/courses", tags=["courses"])

class LessonBase(BaseModel):
    id: str
    title: str
    order: int
    duration: Optional[str] = "10 min"

class CourseWithLessons(BaseModel):
    id: str
    title: str
    order: int
    lessons: List[LessonBase]

class PathWithDetails(BaseModel):
    id: str
    slug: str
    title: str
    courses: List[CourseWithLessons]

@router.get("/path/{slug}", response_model=PathWithDetails)
async def get_path_with_details(slug: str):
    supabase = get_supabase_service()
    
    # 1. Fetch path
    path_res = supabase.table("paths").select("*").eq("slug", slug).single().execute()
    if not path_res.data:
        raise HTTPException(status_code=404, detail="Path not found")
    
    path = path_res.data
    
    # 2. Fetch courses for path
    courses_res = supabase.table("courses").select("*").eq("path_id", path["id"]).order("order").execute()
    courses_data = courses_res.data
    
    # 3. Fetch all lessons for these courses
    course_ids = [c["id"] for c in courses_data]
    if not course_ids:
        return PathWithDetails(id=path["id"], slug=path["slug"], title=path["title"], courses=[])
    lessons_res = supabase.table("lessons").select("*").in_("course_id", course_ids).order("order").execute()
    lessons_data = lessons_res.data
    
    # Nesting lessons into courses
    courses_with_lessons = []
    for c in courses_data:
        c_lessons = [
            LessonBase(
                id=l["id"], 
                title=l["title"], 
                order=l["order"],
                duration=l.get("duration", "10 min")
            ) 
            for l in lessons_data if l["course_id"] == c["id"]
        ]
        courses_with_lessons.append(CourseWithLessons(
            id=c["id"],
            title=c["title"],
            order=c["order"],
            lessons=c_lessons
        ))
        
    return PathWithDetails(
        id=path["id"],
        slug=path["slug"],
        title=path["title"],
        courses=courses_with_lessons
    )
