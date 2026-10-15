from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models import RoleEnum


# ---------- User / Auth ----------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    role: RoleEnum


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Review ----------

class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    rating: int
    comment: Optional[str]
    created_at: datetime
    user_id: int
    user_name: Optional[str] = None


# ---------- Product ----------

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = 0.0
    color: Optional[str] = None
    category: Optional[str] = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str]
    price: float
    color: Optional[str]
    category: Optional[str]
    image_url: Optional[str]
    created_at: datetime
    average_rating: float = 0.0
    review_count: int = 0
    is_favorited: bool = False


class ProductDetailOut(ProductOut):
    reviews: List[ReviewOut] = []


# ---------- Favorite ----------

class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product: ProductOut
