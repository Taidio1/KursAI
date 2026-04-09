import os
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import slides, materials, dashboard, courses, blog, blog_admin

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(blog_admin._auto_publish_loop())
    yield
    task.cancel()

app = FastAPI(title="KursAI API", version="1.0.0", lifespan=lifespan)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:80")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(slides.router)
app.include_router(materials.router)
app.include_router(dashboard.router)
app.include_router(courses.router)
app.include_router(blog.router)
app.include_router(blog_admin.router)

@app.get("/health")
def health():
    return {"status": "ok"}