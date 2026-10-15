import cloudinary
import cloudinary.uploader

from app.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


def upload_image(file) -> str:
    """Uploads a file-like object to Cloudinary and returns the secure URL."""
    result = cloudinary.uploader.upload(file, folder="boutique_products")
    return result["secure_url"]
