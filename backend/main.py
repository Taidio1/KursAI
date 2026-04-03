from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import slides, sync

app = FastAPI(title="KursAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(slides.router)
app.include_router(sync.router)

@app.get("/health")
def health():
    return {"status": "ok"}