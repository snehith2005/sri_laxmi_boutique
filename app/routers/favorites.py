from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.routers.products import _serialize_product

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=List[schemas.ProductOut])
def list_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    favs = db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()
    return [_serialize_product(f.product, db, current_user) for f in favs]


@router.post("/{product_id}", status_code=201)
def add_favorite(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.product_id == product_id,
    ).first()
    if existing:
        return {"message": "Already in favorites"}

    fav = models.Favorite(user_id=current_user.id, product_id=product_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}


@router.delete("/{product_id}", status_code=204)
def remove_favorite(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.product_id == product_id,
    ).first()
    if fav:
        db.delete(fav)
        db.commit()
    return None
