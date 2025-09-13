from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from auth import get_current_admin
# MongoDB import removed - using mock database
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database will be injected from server.py
db = None

profile_router = APIRouter(prefix="/api/admin", tags=["profile"])

class ProfileData(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    website: Optional[str] = None

class ProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    website: Optional[str] = None

@profile_router.get("/profile")
async def get_profile(current_admin: dict = Depends(get_current_admin)):
    # Get profile from profiles collection or create default
    profile = await db.profiles.find_one({"admin_id": current_admin["id"]})
    
    if not profile:
        # Create default profile
        default_profile = {
            "admin_id": current_admin["id"],
            "name": "Kuldeep Parjapati",
            "email": "hello@mmb.dev",
            "phone": "+91 98765 43210",
            "whatsapp": "+91 98765 43210",
            "address": "India",
            "bio": "Professional Web Developer & Designer creating modern, responsive websites and digital solutions that convert visitors into customers.",
            "linkedin": "https://linkedin.com/in/mmb",
            "github": "https://github.com/mmb",
            "twitter": "https://twitter.com/mmb",
            "instagram": "https://instagram.com/mmb",
            "website": "https://mmb.dev"
        }
        result = await db.profiles.insert_one(default_profile)
        profile = await db.profiles.find_one({"_id": result.inserted_id})
    
    # Return in format expected by frontend
    return {
        "admin": {
            "id": str(profile["_id"]),
            "name": profile["name"],
            "email": profile["email"],
            "phone": profile.get("phone"),
            "whatsapp": profile.get("whatsapp"),
            "address": profile.get("address"),
            "bio": profile.get("bio"),
            "linkedin": profile.get("linkedin"),
            "github": profile.get("github"),
            "twitter": profile.get("twitter"),
            "instagram": profile.get("instagram"),
            "website": profile.get("website"),
            "avatar": profile.get("avatar", "")
        }
    }

@profile_router.put("/profile")
async def update_profile(profile_data: ProfileData, current_admin: dict = Depends(get_current_admin)):
    update_data = profile_data.dict()
    
    # Update profile in database
    result = await db.profiles.update_one(
        {"admin_id": current_admin["id"]},
        {"$set": update_data},
        upsert=True
    )
    
    # Get updated profile
    profile = await db.profiles.find_one({"admin_id": current_admin["id"]})
    
    # Return in format expected by frontend
    return {
        "admin": {
            "id": str(profile["_id"]),
            "name": profile["name"],
            "email": profile["email"],
            "phone": profile.get("phone"),
            "whatsapp": profile.get("whatsapp"),
            "address": profile.get("address"),
            "bio": profile.get("bio"),
            "linkedin": profile.get("linkedin"),
            "github": profile.get("github"),
            "twitter": profile.get("twitter"),
            "instagram": profile.get("instagram"),
            "website": profile.get("website"),
            "avatar": profile.get("avatar", "")
        }
    }