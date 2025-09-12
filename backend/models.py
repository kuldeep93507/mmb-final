from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password: str
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class MediaSettings(BaseModel):
    logo: Optional[str] = None
    hero_image: Optional[str] = None
    about_image: Optional[str] = None
    favicon: Optional[str] = None

class AdminResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

class AdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

# Service Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: str
    duration: str
    features: List[str]
    icon: str
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    title: str
    description: str
    price: str
    duration: str
    features: List[str]
    icon: str
    active: bool = True

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    duration: Optional[str] = None
    features: Optional[List[str]] = None
    icon: Optional[str] = None
    active: Optional[bool] = None

# Project Models
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    category: str
    tags: List[str]
    technologies: List[str]
    live_url: str
    github_url: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    image: str
    category: str
    tags: List[str]
    technologies: List[str]
    live_url: str
    github_url: Optional[str] = None
    featured: bool = False

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: Optional[bool] = None

# Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    company: str
    text: str
    rating: int = Field(ge=1, le=5)
    image: str
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    position: str
    company: str
    text: str
    rating: int = Field(ge=1, le=5)
    image: str
    approved: bool = True

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    text: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image: Optional[str] = None
    approved: Optional[bool] = None

# Blog Models
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image: str
    category: str
    tags: List[str]
    author: str = "MMB"
    publish_date: datetime = Field(default_factory=datetime.utcnow)
    published: bool = False
    read_time: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    category: str
    tags: List[str]
    author: str = "MMB"
    publish_date: Optional[datetime] = None
    published: bool = False
    read_time: str

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    publish_date: Optional[datetime] = None
    published: Optional[bool] = None
    read_time: Optional[str] = None

# Contact Models
class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    project_type: str
    budget: Optional[str] = None
    message: str
    timeline: Optional[str] = None
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    project_type: str
    budget: Optional[str] = None
    message: str
    timeline: Optional[str] = None

# Dashboard Stats Model
class DashboardStats(BaseModel):
    total_projects: int
    total_services: int
    total_testimonials: int
    total_contacts: int
    unread_contacts: int
    published_blogs: int
    total_blogs: int
    recent_contacts: List[ContactInquiry]

# Enhanced Media Settings Models
class MediaSettingsResponse(BaseModel):
    id: str = "main"
    logo: Optional[str] = None
    favicon: Optional[str] = None
    hero_image: Optional[str] = None
    about_image: Optional[str] = None
    gallery: List[str] = []

class MediaSettingsUpdate(BaseModel):
    logo: Optional[str] = None
    favicon: Optional[str] = None
    hero_image: Optional[str] = None
    about_image: Optional[str] = None
    gallery: Optional[List[str]] = None

# Offer System Models
class Offer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: str = "Get Offer"
    cta_url: Optional[str] = None
    discount_percentage: Optional[int] = None
    discount_amount: Optional[str] = None
    active: bool = True
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    priority: int = 1
    background_color: str = "#ff6b6b"
    text_color: str = "#ffffff"
    banner_image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class OfferCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: str = "Get Offer"
    cta_url: Optional[str] = None
    discount_percentage: Optional[int] = None
    discount_amount: Optional[str] = None
    active: bool = True
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    priority: int = 1
    background_color: str = "#ff6b6b"
    text_color: str = "#ffffff"
    banner_image: Optional[str] = None

class OfferUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    discount_percentage: Optional[int] = None
    discount_amount: Optional[str] = None
    active: Optional[bool] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    priority: Optional[int] = None
    background_color: Optional[str] = None
    text_color: Optional[str] = None
    banner_image: Optional[str] = None

# Site Settings Models
class NavLink(BaseModel):
    label: str
    url: str
    external: bool = False
    order: int = 1

class SocialLink(BaseModel):
    platform: str  # facebook, twitter, instagram, linkedin, github, etc.
    url: str
    icon: Optional[str] = None

class SiteSettings(BaseModel):
    id: str = "main"
    offers_enabled: bool = True
    site_title: str = "MMB Portfolio"
    site_description: str = "Professional Portfolio Website"
    header_tagline: Optional[str] = None
    primary_color: str = "#3b82f6"
    secondary_color: str = "#1e40af"
    accent_color: str = "#ef4444"
    nav_links: List[NavLink] = []
    social_links: List[SocialLink] = []
    footer_text: str = "© 2024 MMB Portfolio. All rights reserved."
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    google_analytics_id: Optional[str] = None
    updated_at: Optional[datetime] = None

class SiteSettingsUpdate(BaseModel):
    offers_enabled: Optional[bool] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    header_tagline: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    nav_links: Optional[List[NavLink]] = None
    social_links: Optional[List[SocialLink]] = None
    footer_text: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    google_analytics_id: Optional[str] = None