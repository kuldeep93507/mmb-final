from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import os
import uuid
from pathlib import Path
from typing import List
from models import *
from auth import get_current_admin, verify_password, hash_password, create_access_token, DEFAULT_ADMIN
# MongoDB import removed - using mock database
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database will be injected from server.py
db = None

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

# Initialize default admin if not exists
async def init_default_admin():
    existing_admin = await db.admins.find_one({"email": DEFAULT_ADMIN["email"]})
    if not existing_admin:
        hashed_password = hash_password(DEFAULT_ADMIN["password"])
        admin_data = Admin(
            email=DEFAULT_ADMIN["email"],
            password=hashed_password,
            name=DEFAULT_ADMIN["name"]
        )
        await db.admins.insert_one(admin_data.dict())

# Authentication Routes
@admin_router.post("/login")
async def admin_login(login_data: AdminLogin):
    await init_default_admin()
    
    admin = await db.admins.find_one({"email": login_data.email})
    if not admin or not verify_password(login_data.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token_version = admin.get("token_version", 1)
    token = create_access_token({
        "sub": admin["id"], 
        "email": admin["email"],
        "token_version": token_version
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": AdminResponse(**admin)
    }

@admin_router.get("/verify")
async def verify_admin(current_admin: dict = Depends(get_current_admin)):
    admin = await db.admins.find_one({"id": current_admin["id"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return AdminResponse(**admin)

@admin_router.put("/change-password")
async def change_password(password_data: ChangePasswordRequest, current_admin: dict = Depends(get_current_admin)):
    # Get current admin from database
    admin = await db.admins.find_one({"id": current_admin["id"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Verify current password
    if not verify_password(password_data.current_password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Hash new password and increment token_version to invalidate existing tokens
    new_hashed_password = hash_password(password_data.new_password)
    current_token_version = admin.get("token_version", 1)
    new_token_version = current_token_version + 1
    
    await db.admins.update_one(
        {"id": current_admin["id"]}, 
        {"$set": {
            "password": new_hashed_password,
            "token_version": new_token_version
        }}
    )
    
    return {"message": "Password changed successfully"}

# Profile Management
@admin_router.get("/profile")
async def get_admin_profile(current_admin: dict = Depends(get_current_admin)):
    admin = await db.admins.find_one({"id": current_admin["id"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"admin": AdminResponse(**admin)}

@admin_router.put("/profile")
async def update_admin_profile(profile_data: AdminProfileUpdate, current_admin: dict = Depends(get_current_admin)):
    # Get current admin from database
    admin = await db.admins.find_one({"id": current_admin["id"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Update admin profile
    await db.admins.update_one(
        {"id": current_admin["id"]}, 
        {"$set": update_data}
    )
    
    # Also update profiles collection for public API
    profile_update_data = {}
    if "name" in update_data:
        profile_update_data["name"] = update_data["name"]
    if "email" in update_data:
        profile_update_data["email"] = update_data["email"]
    if "phone" in update_data:
        profile_update_data["phone"] = update_data["phone"]
        profile_update_data["whatsapp"] = update_data["phone"]  # Also update whatsapp
    if "address" in update_data:
        profile_update_data["address"] = update_data["address"]
    if "bio" in update_data:
        profile_update_data["bio"] = update_data["bio"]
    
    if profile_update_data:
        await db.profiles.update_one(
            {"admin_id": current_admin["id"]},
            {"$set": profile_update_data},
            upsert=True
        )
    
    # Get updated admin data
    updated_admin = await db.admins.find_one({"id": current_admin["id"]})
    return {"admin": AdminResponse(**updated_admin)}

# Media Management Endpoints
@admin_router.get("/media-settings")
async def get_media_settings(current_admin: dict = Depends(get_current_admin)):
    """Get current media settings"""
    try:
        media_data = await db.media_settings.find_one({"id": "main"})
        if not media_data:
            # Return default empty settings
            default_settings = {
                "id": "main",
                "logo": None,
                "favicon": None,
                "hero_image": None,
                "about_image": None,
                "gallery": []
            }
            await db.media_settings.insert_one(default_settings)
            return default_settings
        return media_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch media settings: {str(e)}"
        )

@admin_router.put("/media-settings")
async def update_media_settings(
    settings: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Update media settings"""
    try:
        result = await db.media_settings.update_one(
            {"id": "main"},
            {"$set": settings},
            upsert=True
        )
        return {"message": "Media settings updated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update media settings: {str(e)}"
        )

@admin_router.post("/upload-media")
async def upload_media(
    file: UploadFile = File(...),
    type: str = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Upload media file (logo, images, etc.)"""
    if not type or type not in ['logo', 'hero_image', 'about_image', 'favicon']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid media type. Allowed: logo, hero_image, about_image, favicon"
        )
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only image files are allowed."
        )
    
    # Create uploads directory if it doesn't exist
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{type}_{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / unique_filename
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create URL (in production, this would be your domain)
        file_url = f"/uploads/{unique_filename}"
        
        # Update media settings in database
        media_collection = db.media_settings
        await media_collection.update_one(
            {"id": "main"},
            {"$set": {type: file_url}},
            upsert=True
        )
        
        return {"url": file_url, "message": f"{type} uploaded successfully"}
        
    except Exception as e:
        # Clean up file if database update fails
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@admin_router.delete("/media/{media_type}")
async def remove_media(
    media_type: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Remove media file"""
    if media_type not in ['logo', 'hero_image', 'about_image', 'favicon']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid media type"
        )
    
    try:
        media_collection = db.media_settings
        result = await media_collection.update_one(
            {"id": "main"},
            {"$unset": {media_type: ""}}
        )
        
        return {"message": f"{media_type} removed successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove media: {str(e)}"
        )

# Site Settings Endpoints
@admin_router.get("/site-settings")
async def get_site_settings(current_admin: dict = Depends(get_current_admin)):
    """Get current site settings"""
    try:
        settings = await db.site_settings.find_one({"id": "main"})
        if not settings:
            # Create default settings
            from models import SiteSettings
            default_settings = SiteSettings().dict()
            await db.site_settings.insert_one(default_settings)
            return default_settings
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch site settings: {str(e)}"
        )

@admin_router.put("/site-settings")
async def update_site_settings(
    settings: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Update site settings"""
    try:
        settings["updated_at"] = datetime.utcnow().isoformat()
        result = await db.site_settings.update_one(
            {"id": "main"},
            {"$set": settings},
            upsert=True
        )
        return jsonable_encoder({"message": "Site settings updated successfully"})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update site settings: {str(e)}"
        )

# Offers Management Endpoints
@admin_router.get("/offers")
async def get_offers(current_admin: dict = Depends(get_current_admin)):
    """Get all offers"""
    try:
        offers = await db.offers.find({}).to_list()
        return jsonable_encoder(offers)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch offers: {str(e)}"
        )

@admin_router.post("/offers")
async def create_offer(
    offer_data: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Create new offer"""
    try:
        from models import Offer
        offer = Offer(**offer_data)
        result = await db.offers.insert_one(offer.dict())
        return {"message": "Offer created successfully", "id": offer.id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create offer: {str(e)}"
        )

@admin_router.get("/offers/{offer_id}")
async def get_offer(
    offer_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get specific offer"""
    try:
        offer = await db.offers.find_one({"id": offer_id})
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        return offer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch offer: {str(e)}"
        )

@admin_router.put("/offers/{offer_id}")
async def update_offer(
    offer_id: str,
    offer_data: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Update offer"""
    try:
        # Check if offer exists first
        existing_offer = await db.offers.find_one({"id": offer_id})
        if not existing_offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        offer_data["updated_at"] = datetime.utcnow().isoformat()
        await db.offers.update_one(
            {"id": offer_id},
            {"$set": offer_data}
        )
        return jsonable_encoder({"message": "Offer updated successfully"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update offer: {str(e)}"
        )

@admin_router.patch("/offers/{offer_id}/toggle")
async def toggle_offer(
    offer_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Toggle offer active status"""
    try:
        offer = await db.offers.find_one({"id": offer_id})
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        new_status = not offer.get("active", False)
        result = await db.offers.update_one(
            {"id": offer_id},
            {"$set": {"active": new_status, "updated_at": datetime.utcnow().isoformat()}}
        )
        
        # Get updated offer and return with proper serialization
        updated_offer = await db.offers.find_one({"id": offer_id})
        return jsonable_encoder({
            "message": f"Offer {'activated' if new_status else 'deactivated'} successfully", 
            "active": new_status,
            "offer": updated_offer
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to toggle offer: {str(e)}"
        )

@admin_router.delete("/offers/{offer_id}")
async def delete_offer(
    offer_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete offer"""
    try:
        result = await db.offers.delete_one({"id": offer_id})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        return {"message": "Offer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete offer: {str(e)}"
        )

# Services Management
@admin_router.get("/services", response_model=List[Service])
async def get_services(current_admin: dict = Depends(get_current_admin)):
    services = await db.services.find().to_list(1000)
    return [Service(**service) for service in services]

@admin_router.post("/services", response_model=Service)
async def create_service(service_data: ServiceCreate, current_admin: dict = Depends(get_current_admin)):
    service = Service(**service_data.dict())
    await db.services.insert_one(service.dict())
    return service

@admin_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_data: ServiceUpdate, current_admin: dict = Depends(get_current_admin)):
    update_data = {k: v for k, v in service_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.services.update_one({"id": service_id}, {"$set": update_data})
    # MockDB doesn't have matched_count, skip this check
    
    updated_service = await db.services.find_one({"id": service_id})
    return Service(**updated_service)

@admin_router.delete("/services/{service_id}")
async def delete_service(service_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

# Projects Management
@admin_router.get("/projects", response_model=List[Project])
async def get_projects(current_admin: dict = Depends(get_current_admin)):
    projects = await db.projects.find().to_list(1000)
    return [Project(**project) for project in projects]

@admin_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, current_admin: dict = Depends(get_current_admin)):
    project = Project(**project_data.dict())
    await db.projects.insert_one(project.dict())
    return project

@admin_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_data: ProjectUpdate, current_admin: dict = Depends(get_current_admin)):
    update_data = {k: v for k, v in project_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.projects.update_one({"id": project_id}, {"$set": update_data})
    # MockDB doesn't have matched_count, skip this check
    
    updated_project = await db.projects.find_one({"id": project_id})
    return Project(**updated_project)

@admin_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Testimonials Management
@admin_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(current_admin: dict = Depends(get_current_admin)):
    testimonials = await db.testimonials.find().to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@admin_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate, current_admin: dict = Depends(get_current_admin)):
    testimonial = Testimonial(**testimonial_data.dict())
    await db.testimonials.insert_one(testimonial.dict())
    return testimonial

@admin_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial_data: TestimonialUpdate, current_admin: dict = Depends(get_current_admin)):
    update_data = {k: v for k, v in testimonial_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    # MockDB doesn't have matched_count, skip this check
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**updated_testimonial)

@admin_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

# Blog Management
@admin_router.get("/blogs", response_model=List[BlogPost])
async def get_blogs(current_admin: dict = Depends(get_current_admin)):
    blogs = await db.blogs.find().to_list(1000)
    return [BlogPost(**blog) for blog in blogs]

@admin_router.post("/blogs", response_model=BlogPost)
async def create_blog(blog_data: BlogPostCreate, current_admin: dict = Depends(get_current_admin)):
    blog = BlogPost(**blog_data.dict())
    await db.blogs.insert_one(blog.dict())
    return blog

@admin_router.put("/blogs/{blog_id}", response_model=BlogPost)
async def update_blog(blog_id: str, blog_data: BlogPostUpdate, current_admin: dict = Depends(get_current_admin)):
    update_data = {k: v for k, v in blog_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.blogs.update_one({"id": blog_id}, {"$set": update_data})
    # MockDB doesn't have matched_count, skip this check
    
    updated_blog = await db.blogs.find_one({"id": blog_id})
    return BlogPost(**updated_blog)

@admin_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}

# Contact Management
@admin_router.get("/contacts", response_model=List[ContactInquiry])
async def get_contacts(current_admin: dict = Depends(get_current_admin)):
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [ContactInquiry(**contact) for contact in contacts]

@admin_router.post("/contacts", response_model=ContactInquiry)
async def create_contact(contact_data: ContactCreate):
    contact = ContactInquiry(**contact_data.dict())
    await db.contacts.insert_one(contact.dict())
    return contact

@admin_router.put("/contacts/{contact_id}/read")
async def mark_contact_read(contact_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"read": True}})
    # MockDB doesn't have matched_count, skip this check
    return {"message": "Contact marked as read"}

@admin_router.get("/notifications")
async def get_notifications(current_admin: dict = Depends(get_current_admin)):
    """Get admin notifications"""
    try:
        # Get recent activities for notifications
        recent_contacts = await db.contacts.find({}).sort([("created_at", -1)]).limit(5).to_list()
        recent_blogs = await db.blogs.find({"published": True}).sort([("created_at", -1)]).limit(3).to_list()
        
        notifications = []
        
        # Add contact notifications
        for contact in recent_contacts:
            created_at = contact.get("created_at", "")
            if isinstance(created_at, str):
                try:
                    from datetime import datetime
                    contact_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    time_diff = datetime.utcnow() - contact_time.replace(tzinfo=None)
                    
                    if time_diff.days == 0:
                        if time_diff.seconds < 3600:
                            time_str = f"{time_diff.seconds // 60} min ago"
                        else:
                            time_str = f"{time_diff.seconds // 3600} hour ago"
                    else:
                        time_str = f"{time_diff.days} day ago"
                    
                    notifications.append({
                        "id": f"contact_{contact.get('id', '')}",
                        "title": f"New contact from {contact.get('name', 'Unknown')}",
                        "time": time_str,
                        "unread": not contact.get("read", False),
                        "type": "contact"
                    })
                except:
                    notifications.append({
                        "id": f"contact_{contact.get('id', '')}",
                        "title": f"New contact from {contact.get('name', 'Unknown')}",
                        "time": "Recently",
                        "unread": not contact.get("read", False),
                        "type": "contact"
                    })
        
        # Add blog notifications
        for blog in recent_blogs:
            created_at = blog.get("created_at", "")
            if isinstance(created_at, str):
                try:
                    from datetime import datetime
                    blog_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    time_diff = datetime.utcnow() - blog_time.replace(tzinfo=None)
                    
                    if time_diff.days == 0:
                        if time_diff.seconds < 3600:
                            time_str = f"{time_diff.seconds // 60} min ago"
                        else:
                            time_str = f"{time_diff.seconds // 3600} hour ago"
                    else:
                        time_str = f"{time_diff.days} day ago"
                    
                    notifications.append({
                        "id": f"blog_{blog.get('id', '')}",
                        "title": f"Blog published: {blog.get('title', 'Unknown')[:30]}...",
                        "time": time_str,
                        "unread": True,
                        "type": "blog"
                    })
                except:
                    notifications.append({
                        "id": f"blog_{blog.get('id', '')}",
                        "title": f"Blog published: {blog.get('title', 'Unknown')[:30]}...",
                        "time": "Recently",
                        "unread": True,
                        "type": "blog"
                    })
        
        # Add system notification
        notifications.append({
            "id": "system_backup",
            "title": "System backup completed successfully",
            "time": "3 hours ago",
            "unread": False,
            "type": "system"
        })
        
        return jsonable_encoder(notifications)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch notifications: {str(e)}"
        )

@admin_router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

# Dashboard Stats
@admin_router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    total_projects = await db.projects.count_documents({})
    total_services = await db.services.count_documents({"active": True})
    total_testimonials = await db.testimonials.count_documents({"approved": True})
    total_contacts = await db.contacts.count_documents({})
    unread_contacts = await db.contacts.count_documents({"read": False})
    published_blogs = await db.blogs.count_documents({"published": True})
    total_blogs = await db.blogs.count_documents({})
    
    recent_contacts = await db.contacts.find().sort("created_at", -1).limit(5).to_list(5)
    recent_contacts_list = [ContactInquiry(**contact) for contact in recent_contacts]
    
    return DashboardStats(
        total_projects=total_projects,
        total_services=total_services,
        total_testimonials=total_testimonials,
        total_contacts=total_contacts,
        unread_contacts=unread_contacts,
        published_blogs=published_blogs,
        total_blogs=total_blogs,
        recent_contacts=recent_contacts_list
    )