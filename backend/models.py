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