from fastapi import UploadFile
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

CLOUD_NAME = os.getenv("CLOUD_NAME")
CLOUD_API_KEY = os.getenv("CLOUD_API_KEY")
CLOUD_API_SECRET = os.getenv("CLOUD_API_SECRET")

cloudinary.config(
    cloud_name = CLOUD_NAME,
    api_key = CLOUD_API_KEY,
    api_secret = CLOUD_API_SECRET,
    secure=True
)

def upload_image(file: UploadFile, category: str):
    return cloudinary.uploader.upload(file.file, folder=category)["secure_url"]

def delete_image(image_url: str):
    after_upload = image_url.split("upload/")[1]
    without_version = after_upload.split("/", 1)[1]
    public_id = without_version.rsplit(".", 1)[0]
    cloudinary.uploader.destroy(public_id)