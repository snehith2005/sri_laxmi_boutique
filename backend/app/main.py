from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app import models
from app.config import settings
from app.auth import hash_password
from app.routers import auth, products, favorites, reviews

Base.metadata.create_all(bind=engine)


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == settings.admin_email).first()
        if not existing:
            admin = models.User(
                name="Admin",
                email=settings.admin_email,
                hashed_password=hash_password(settings.admin_password),
                role=models.RoleEnum.admin,
            )
            db.add(admin)
            db.commit()
            print(f"Seeded admin account: {settings.admin_email}")
    finally:
        db.close()


seed_admin()

app = FastAPI(title="Boutique API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip().rstrip("/") for o in settings.allowed_origins.split(",") if o.strip()],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(favorites.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Boutique API"}
