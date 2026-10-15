from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas, models, auth as auth_utils

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=auth_utils.hash_password(payload.password),
        role=models.RoleEnum.user,  # public registration is always a regular user
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth_utils.create_access_token({"sub": str(user.id), "role": user.role.value})
    return schemas.Token(access_token=token, user=user)


@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth_utils.create_access_token({"sub": str(user.id), "role": user.role.value})
    return schemas.Token(access_token=token, user=user)


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user
