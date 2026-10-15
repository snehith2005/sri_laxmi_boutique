from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils

router = APIRouter(prefix="/products/{product_id}/reviews", tags=["reviews"])


@router.get("", response_model=List[schemas.ReviewOut])
def list_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    return [
        schemas.ReviewOut(
            id=r.id, rating=r.rating, comment=r.comment, created_at=r.created_at,
            user_id=r.user_id, user_name=r.user.name if r.user else None,
        )
        for r in reviews
    ]


@router.post("", response_model=schemas.ReviewOut, status_code=201)
def add_or_update_review(
    product_id: int,
    payload: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    review = db.query(models.Review).filter(
        models.Review.product_id == product_id,
        models.Review.user_id == current_user.id,
    ).first()

    if review:
        review.rating = payload.rating
        review.comment = payload.comment
    else:
        review = models.Review(
            product_id=product_id, user_id=current_user.id,
            rating=payload.rating, comment=payload.comment,
        )
        db.add(review)

    db.commit()
    db.refresh(review)
    return schemas.ReviewOut(
        id=review.id, rating=review.rating, comment=review.comment,
        created_at=review.created_at, user_id=review.user_id, user_name=current_user.name,
    )


@router.delete("/{review_id}", status_code=204)
def delete_review(
    product_id: int,
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    review = db.query(models.Review).filter(
        models.Review.id == review_id, models.Review.product_id == product_id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not allowed to delete this review")
    db.delete(review)
    db.commit()
    return None
