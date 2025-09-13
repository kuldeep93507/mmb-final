from fastapi import APIRouter, HTTPException
from typing import List
from models import *
from datetime import datetime
# MongoDB import removed - using mock database
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database will be injected from server.py
db = None

public_router = APIRouter(prefix="/api", tags=["public"])

# Public Routes for Frontend
@public_router.get("/services", response_model=List[Service])
async def get_public_services():
    services = await db.services.find({"active": True}).to_list()
    return [Service(**service) for service in services]

@public_router.get("/projects", response_model=List[Project])
async def get_public_projects():
    projects = await db.projects.find().to_list()
    return [Project(**project) for project in projects]

@public_router.get("/testimonials", response_model=List[Testimonial])
async def get_public_testimonials():
    testimonials = await db.testimonials.find({"approved": True}).to_list()
    return [Testimonial(**testimonial) for testimonial in testimonials]

@public_router.get("/blogs", response_model=List[BlogPost])
async def get_public_blogs():
    blogs = await db.blogs.find({"published": True}).to_list()
    return [BlogPost(**blog) for blog in blogs]

@public_router.get("/blogs/{blog_id}", response_model=BlogPost)
async def get_blog_by_id(blog_id: str):
    blog = await db.blogs.find_one({"id": blog_id, "published": True})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return BlogPost(**blog)

@public_router.get("/contacts", response_model=List[ContactInquiry])
async def get_contacts():
    contacts = await db.contacts.find().to_list()
    return [ContactInquiry(**contact) for contact in contacts]

@public_router.post("/contact", response_model=ContactInquiry)
async def submit_contact(contact_data: ContactCreate):
    contact = ContactInquiry(**contact_data.dict())
    await db.contacts.insert_one(contact.dict())
    return contact

# Public Profile/Contact Info API
@public_router.get("/profile")
async def get_public_profile():
    try:
        # Get the most recent admin's profile (latest created/updated)
        admins = await db.admins.find({}).to_list()
        if not admins:
            admin = None
        else:
            # Sort by created_at descending to get the latest
            admins.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            admin = admins[0]
        
        if not admin:
            return {
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
        
        # Try to find profile by admin_id
        profile = await db.profiles.find_one({"admin_id": admin["id"]})
        
        if not profile:
            return {
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
    except Exception as e:
        return {
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
    
    return {
        "name": profile.get("name", "Kuldeep Parjapati"),
        "email": profile.get("email", "hello@mmb.dev"),
        "phone": profile.get("phone", "+91 98765 43210"),
        "whatsapp": profile.get("whatsapp", "+91 98765 43210"),
        "address": profile.get("address", "India"),
        "bio": profile.get("bio", "Professional Web Developer & Designer"),
        "linkedin": profile.get("linkedin", "https://linkedin.com/in/mmb"),
        "github": profile.get("github", "https://github.com/mmb"),
        "twitter": profile.get("twitter", "https://twitter.com/mmb"),
        "instagram": profile.get("instagram", "https://instagram.com/mmb"),
        "website": profile.get("website", "https://mmb.dev")
    }

# Public Media API
@public_router.get("/media")
async def get_media_settings():
    """Get public media settings"""
    try:
        media_collection = db.media_settings
        media_data = await media_collection.find_one({"id": "main"})
        
        if not media_data:
            # Return default empty media settings
            return {
                "logo": "",
                "hero_image": "", 
                "about_image": "",
                "favicon": ""
            }
        
        # Remove MongoDB _id field
        media_data.pop('_id', None)
        media_data.pop('id', None)
        
        return media_data
        
    except Exception as e:
        return {
            "logo": "",
            "hero_image": "",
            "about_image": "", 
            "favicon": ""
        }

# Enhanced Public Endpoints for New Features

@public_router.get("/media-settings")
async def get_public_media_settings():
    """Get public media settings with gallery"""
    try:
        media_data = await db.media_settings.find_one({"id": "main"})
        if not media_data:
            return {
                "id": "main",
                "logo": None,
                "favicon": None,
                "hero_image": None,
                "about_image": None,
                "gallery": []
            }
        return media_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch media settings: {str(e)}"
        )

@public_router.get("/hero-section")
async def get_public_hero_section():
    """Get public hero section data"""
    try:
        hero_data = await db.hero_section.find_one({"id": "main"})
        if not hero_data:
            # Return default hero section
            from models import HeroSection
            default_hero = HeroSection()
            return default_hero.dict()
        return hero_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch hero section: {str(e)}"
        )

@public_router.get("/site-settings")
async def get_public_site_settings():
    """Get public site settings"""
    try:
        settings = await db.site_settings.find_one({"id": "main"})
        if not settings:
            # Return default settings
            return {
                "id": "main",
                "offers_enabled": True,
                "site_title": "MMB Portfolio",
                "site_description": "Professional Portfolio Website",
                "header_tagline": None,
                "primary_color": "#3b82f6",
                "secondary_color": "#1e40af",
                "accent_color": "#ef4444",
                "nav_links": [],
                "social_links": [],
                "footer_text": "© 2024 MMB Portfolio. All rights reserved.",
                "contact_email": None,
                "contact_phone": None,
                "whatsapp_number": None
            }
        
        # Properly filter sensitive fields for public consumption
        sensitive_fields = ['google_analytics_id', 'updated_at', '_id']
        public_settings = {k: v for k, v in settings.items() if k not in sensitive_fields}
        return public_settings
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch site settings: {str(e)}"
        )

@public_router.get("/offers/active")
async def get_active_offers():
    """Get currently active offers"""
    try:
        # Get current time
        now = datetime.utcnow()
        
        # Get all active offers (MockDB compatible)
        all_offers = await db.offers.find({"active": True}).to_list()
        
        # Filter by time range in Python (MockDB compatible)
        active_offers = []
        for offer in all_offers:
            # Parse datetime strings if they exist
            starts_at = None
            ends_at = None
            
            if offer.get('starts_at'):
                if isinstance(offer['starts_at'], str):
                    try:
                        starts_at = datetime.fromisoformat(offer['starts_at'].replace('Z', '+00:00'))
                    except:
                        starts_at = None
                else:
                    starts_at = offer['starts_at']
            
            if offer.get('ends_at'):
                if isinstance(offer['ends_at'], str):
                    try:
                        ends_at = datetime.fromisoformat(offer['ends_at'].replace('Z', '+00:00'))
                    except:
                        ends_at = None
                else:
                    ends_at = offer['ends_at']
            
            # Check if offer is within time range
            is_active = True
            if starts_at and now < starts_at:
                is_active = False
            if ends_at and now > ends_at:
                is_active = False
                
            if is_active:
                active_offers.append(offer)
        
        # Sort by priority (higher priority first)
        active_offers.sort(key=lambda x: x.get('priority', 1), reverse=True)
        
        return active_offers
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch active offers: {str(e)}"
        )

@public_router.get("/offers")
async def get_public_offers():
    """Get all public offers (for display purposes)"""
    try:
        offers = await db.offers.find({"active": True}).to_list()
        # Sort by priority (higher priority first)
        offers.sort(key=lambda x: x.get('priority', 1), reverse=True)
        return offers
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch offers: {str(e)}"
        )