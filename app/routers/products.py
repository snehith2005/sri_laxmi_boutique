from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.utils.cloudinary_upload import upload_image

router = APIRouter(prefix="/products", tags=["products"])


def _serialize_product(product: models.Product, db: Session, current_user: Optional[models.User]) -> schemas.ProductOut:
    ratings = [r.rating for r in product.reviews]
    avg = sum(ratings) / len(ratings) if ratings else 0.0
    is_fav = False
    if current_user:
        is_fav = db.query(models.Favorite).filter(
            models.Favorite.user_id == current_user.id,
            models.Favorite.product_id == product.id,
        ).first() is not None

    out = schemas.ProductOut.model_validate(product)
    out.average_rating = round(avg, 1)
    out.review_count = len(ratings)
    out.is_favorited = is_fav
    return out


@router.get("", response_model=List[schemas.ProductOut])
def list_products(
    search: Optional[str] = None,
    color: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth_utils.get_current_user_optional),
):
    query = db.query(models.Product)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.name.ilike(like),
                models.Product.description.ilike(like),
                models.Product.color.ilike(like),
                models.Product.category.ilike(like),
            )
        )
    if color:
        query = query.filter(models.Product.color.ilike(f"%{color}%"))
    if category:
        query = query.filter(models.Product.category.ilike(f"%{category}%"))

    products = query.order_by(models.Product.created_at.desc()).all()
    return [_serialize_product(p, db, current_user) for p in products]


@router.get("/{product_id}", response_model=schemas.ProductDetailOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    base = _serialize_product(product, db, None)
    reviews_out = []
    for r in product.reviews:
        reviews_out.append(schemas.ReviewOut(
            id=r.id, rating=r.rating, comment=r.comment, created_at=r.created_at,
            user_id=r.user_id, user_name=r.user.name if r.user else None,
        ))
    return schemas.ProductDetailOut(**base.model_dump(), reviews=reviews_out)


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(0.0),
    color: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth_utils.require_admin),
):
    image_url = None
    if image is not None:
        image_url = upload_image(image.file)

    product = models.Product(
        name=name, description=description, price=price,
        color=color, category=category, image_url=image_url,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _serialize_product(product, db, admin)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    color: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth_utils.require_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if color is not None:
        product.color = color
    if category is not None:
        product.category = category
    if image is not None:
        product.image_url = upload_image(image.file)

    db.commit()
    db.refresh(product)
    return _serialize_product(product, db, admin)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth_utils.require_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
