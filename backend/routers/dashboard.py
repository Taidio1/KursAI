import asyncio

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta

from dependencies import get_supabase_anon, get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class PathStats(BaseModel):
    id: str
    slug: str
    title: str
    subtitle: Optional[str] = None
    progress: int
    lessonsDone: int
    lessonsTotal: int
    streak: int = 0
    icon: str


class LastLesson(BaseModel):
    title: str
    pathName: str
    pathSlug: str
    icon: str


class DashboardResponse(BaseModel):
    paths: List[PathStats]
    lastLesson: Optional[LastLesson] = None
    streak: int
    user_id: str


@router.get("/user-stats", response_model=DashboardResponse)
async def get_user_stats(current_user=Depends(get_current_user)):
    """Agreguje dane dashboardu dla zalogowanego użytkownika."""
    user_id = current_user.id
    supabase = get_supabase_anon()

    try:
        paths_res, courses_res, lessons_res, progress_res = await asyncio.gather(
            asyncio.to_thread(lambda: supabase.table("paths").select("*").execute()),
            asyncio.to_thread(lambda: supabase.table("courses").select("id, path_id, title").execute()),
            asyncio.to_thread(lambda: supabase.table("lessons").select("id, course_id, title").execute()),
            asyncio.to_thread(
                lambda: supabase.table("user_progress")
                .select("lesson_id, completed_at")
                .eq("user_id", user_id)
                .execute()
            ),
        )

        if not paths_res.data:
            return DashboardResponse(paths=[], streak=0, user_id=user_id)

        raw_paths = paths_res.data
        raw_courses = courses_res.data
        raw_lessons = lessons_res.data
        progress_data = progress_res.data

        course_to_path_id = {c["id"]: c["path_id"] for c in raw_courses}
        course_to_title = {c["id"]: c["title"] for c in raw_courses}
        path_id_to_slug = {p["id"]: p["slug"] for p in raw_paths}

        completed_ids = {p["lesson_id"] for p in progress_data if p.get("completed_at")}
        lesson_completed_at = {
            p["lesson_id"]: p["completed_at"]
            for p in progress_data if p.get("completed_at")
        }

        def compute_streak(lesson_ids: list) -> int:
            dates = {
                datetime.fromisoformat(lesson_completed_at[lid].replace("Z", "+00:00")).date()
                for lid in lesson_ids if lid in lesson_completed_at
            }
            s = 0
            check = datetime.now().date()
            if check not in dates:
                check -= timedelta(days=1)
            while check in dates:
                s += 1
                check -= timedelta(days=1)
                if s > 1000:
                    break
            return s

        _ICON_MAP = {"wspolna": "🏁", "no_code": "🛠"}

        aggregated_paths = []
        for path in raw_paths:
            path_id = path["id"]
            path_lessons = [l for l in raw_lessons if course_to_path_id.get(l["course_id"]) == path_id]
            path_lesson_ids = [l["id"] for l in path_lessons]

            total = len(path_lessons)
            done = len([l for l in path_lessons if l["id"] in completed_ids])
            progress = int((done / total) * 100) if total > 0 else 0

            aggregated_paths.append(PathStats(
                id=path_id,
                slug=path["slug"],
                title=path["title"],
                subtitle=path.get("subtitle"),
                progress=progress,
                lessonsDone=done,
                lessonsTotal=total,
                streak=compute_streak(path_lesson_ids),
                icon=_ICON_MAP.get(path["slug"], "💻"),
            ))

        # Last completed lesson
        last_lesson = None
        sorted_progress = sorted(
            [p for p in progress_data if p.get("completed_at")],
            key=lambda x: x["completed_at"],
            reverse=True,
        )
        if sorted_progress:
            last_p = sorted_progress[0]
            lesson = next((l for l in raw_lessons if l["id"] == last_p["lesson_id"]), None)
            if lesson:
                c_id = lesson["course_id"]
                p_id = course_to_path_id.get(c_id)
                p_slug = path_id_to_slug.get(p_id, "wspolna")
                path_icon = next((p.icon for p in aggregated_paths if p.id == p_id), "💻")
                last_lesson = LastLesson(
                    title=lesson["title"],
                    pathName=course_to_title.get(c_id, "Wprowadzenie"),
                    pathSlug=p_slug,
                    icon=path_icon,
                )

        # Global streak (across all paths)
        all_completion_dates = {
            datetime.fromisoformat(p["completed_at"].replace("Z", "+00:00")).date()
            for p in progress_data if p.get("completed_at")
        }
        streak = compute_streak(list(lesson_completed_at.keys()))

        return DashboardResponse(
            paths=aggregated_paths,
            lastLesson=last_lesson,
            streak=streak,
            user_id=user_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Dashboard aggregation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
