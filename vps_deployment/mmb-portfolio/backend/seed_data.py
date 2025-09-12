import asyncio
import os
import json
from dotenv import load_dotenv
from pathlib import Path
from models import *
from auth import hash_password
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Mock database using JSON files
class MockDB:
    def __init__(self):
        self.data_dir = ROOT_DIR / 'mock_data'
        self.data_dir.mkdir(exist_ok=True)
        
    def get_collection(self, name):
        return MockCollection(self.data_dir / f'{name}.json')

class MockCollection:
    def __init__(self, file_path):
        self.file_path = file_path
        
    async def delete_many(self, filter_dict):
        return None
        
    async def insert_one(self, document):
        data = []
        if self.file_path.exists():
            with open(self.file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except:
                    data = []
        
        # Convert datetime objects to strings
        doc_dict = document.model_dump() if hasattr(document, 'model_dump') else document
        for key, value in doc_dict.items():
            if isinstance(value, datetime):
                doc_dict[key] = value.isoformat()
                
        data.append(doc_dict)
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        return None

db = MockDB()

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data (mock implementation)
    admins_collection = db.get_collection('admins')
    services_collection = db.get_collection('services')
    projects_collection = db.get_collection('projects')
    testimonials_collection = db.get_collection('testimonials')
    
    await admins_collection.delete_many({})
    await services_collection.delete_many({})
    await projects_collection.delete_many({})
    await testimonials_collection.delete_many({})
    
    blogs_collection = db.get_collection('blogs')
    contacts_collection = db.get_collection('contacts')
    await blogs_collection.delete_many({})
    await contacts_collection.delete_many({})
    
    # Seed Admin - CHANGE THESE CREDENTIALS IMMEDIATELY AFTER DEPLOYMENT
    admin_data = Admin(
        email="kuldeep@mmb.dev",
        password=hash_password("MMB@2024!Secure"),
        name="Kuldeep Parjapati"
    )
    await admins_collection.insert_one(admin_data)
    print("✅ Admin user created")
    
    # Seed Services
    services_data = [
        Service(
            title="Website Development",
            description="Custom responsive websites built with modern technologies like React, Next.js, and Node.js",
            price="Starting from ₹15,000",
            duration="7-14 days",
            features=["Responsive Design", "Fast Loading", "SEO Optimized", "Admin Panel"],
            icon="Globe",
            active=True
        ),
        Service(
            title="Landing Page Design",
            description="High-conversion landing pages that turn visitors into customers with compelling design and copy",
            price="Starting from ₹8,000",
            duration="3-5 days",
            features=["Conversion Focused", "Mobile First", "A/B Testing", "Analytics Setup"],
            icon="Layout",
            active=True
        ),
        Service(
            title="UX/UI Design",
            description="User-centered design approach with wireframes, prototypes, and beautiful interfaces",
            price="Starting from ₹12,000",
            duration="5-10 days",
            features=["User Research", "Wireframes", "Prototypes", "Design System"],
            icon="Palette",
            active=True
        ),
        Service(
            title="WordPress Development",
            description="Custom WordPress themes and plugins with easy-to-use admin panels",
            price="Starting from ₹10,000",
            duration="5-7 days",
            features=["Custom Themes", "Plugin Development", "WooCommerce", "SEO Ready"],
            icon="Code",
            active=True
        ),
        Service(
            title="Content Writing",
            description="SEO-optimized content that engages your audience and improves search rankings",
            price="Starting from ₹500/page",
            duration="1-3 days",
            features=["SEO Optimized", "Engaging Copy", "Research Based", "Plagiarism Free"],
            icon="PenTool",
            active=True
        ),
        Service(
            title="Digital Marketing",
            description="Complete digital marketing solutions including social media and SEO strategies",
            price="Starting from ₹5,000/month",
            duration="Ongoing",
            features=["Social Media", "SEO Strategy", "Content Calendar", "Analytics"],
            icon="TrendingUp",
            active=True
        )
    ]
    
    for service in services_data:
        await services_collection.insert_one(service)
    print("✅ Services created")
    
    # Seed Projects
    projects_data = [
        Project(
            title="Skillpay - Payment Solutions",
            description="Modern payment gateway website with secure transactions and user-friendly interface",
            image="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
            category="Website Development",
            tags=["React", "Payment Gateway", "Security"],
            technologies=["React", "Node.js", "Stripe", "MongoDB"],
            live_url="https://skillpay.shop",
            github_url="https://github.com/mmb/skillpay",
            featured=True
        ),
        Project(
            title="Durga Chemical Solutions",
            description="Corporate website for chemical solutions company with product catalog and inquiry system",
            image="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
            category="Corporate Website",
            tags=["WordPress", "Corporate", "Catalog"],
            technologies=["WordPress", "PHP", "MySQL"],
            live_url="https://durgachemsol.com",
            featured=True
        ),
        Project(
            title="Hisar Job Place",
            description="Job portal connecting employers with job seekers in Hisar region",
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
            category="Web Application",
            tags=["Job Portal", "React", "Database"],
            technologies=["React", "Node.js", "MongoDB", "JWT"],
            live_url="https://hisarjobplace.in",
            featured=True
        ),
        Project(
            title="NeoGenie Shop",
            description="E-commerce platform with modern design and seamless shopping experience",
            image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
            category="E-commerce",
            tags=["E-commerce", "Shopping", "Payment"],
            technologies=["React", "Node.js", "Stripe", "MongoDB"],
            live_url="https://neogenie.shop",
            featured=True
        ),
        Project(
            title="Pensiya Krishi Farm",
            description="Agricultural website showcasing farm products and organic farming practices",
            image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
            category="Agriculture",
            tags=["Agriculture", "Organic", "Products"],
            technologies=["WordPress", "WooCommerce", "PHP"],
            live_url="https://pensiyakrishifarm.com",
            featured=False
        ),
        Project(
            title="Krishi Ledger App",
            description="Farm management application for tracking crops, expenses, and profits",
            image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
            category="Web Application",
            tags=["Agriculture", "Management", "Dashboard"],
            technologies=["React", "Node.js", "Charts.js", "MongoDB"],
            live_url="https://krishi-ledger-c4ab0f15.base44.app",
            featured=False
        ),
        Project(
            title="Tech Haryana",
            description="Technology news and updates platform for Haryana region",
            image="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
            category="News Portal",
            tags=["Technology", "News", "Regional"],
            technologies=["WordPress", "PHP", "MySQL", "Bootstrap"],
            live_url="https://techharyana.in",
            featured=False
        ),
        Project(
            title="Pensiya Krishi Farm Shop",
            description="Online shop for organic farm products with delivery system",
            image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
            category="E-commerce",
            tags=["Agriculture", "E-commerce", "Organic"],
            technologies=["WooCommerce", "WordPress", "Payment Gateway"],
            live_url="https://pensiyakrishifarm.shop",
            featured=True
        ),
        Project(
            title="DigiSell Platform",
            description="Digital marketplace for buying and selling digital products and services",
            image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
            category="Digital Marketplace",
            tags=["Marketplace", "Digital Products", "E-commerce"],
            technologies=["React", "Node.js", "Payment Gateway", "MongoDB"],
            live_url="https://digi-sell-727f2f0c.base44.app",
            featured=True
        )
    ]
    
    for project in projects_data:
        await projects_collection.insert_one(project)
    print("✅ Projects created")
    
    # Seed Testimonials
    testimonials_data = [
        Testimonial(
            name="Rajesh Kumar",
            position="CEO",
            company="Durga Chemical Solutions",
            text="MMB delivered an exceptional website that perfectly represents our brand. Professional service and excellent communication throughout the project.",
            rating=5,
            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            approved=True
        ),
        Testimonial(
            name="Priya Sharma",
            position="Founder",
            company="NeoGenie Shop",
            text="The e-commerce platform MMB built for us increased our sales by 40%. Amazing work and great attention to detail!",
            rating=5,
            image="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            approved=True
        ),
        Testimonial(
            name="Amit Singh",
            position="Owner",
            company="Pensiya Krishi Farm",
            text="Professional, timely delivery, and excellent support. MMB understood our agricultural business needs perfectly.",
            rating=5,
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            approved=True
        )
    ]
    
    for testimonial in testimonials_data:
        await testimonials_collection.insert_one(testimonial)
    print("✅ Testimonials created")
    
    # Seed Blog Posts
    blogs_data = [
        BlogPost(
            title="Complete Guide to React Hooks in 2024",
            excerpt="Master React Hooks with practical examples and learn how to build modern, efficient React applications using useState, useEffect, and custom hooks.",
            content="<h2>Introduction to React Hooks</h2><p>React Hooks revolutionized how we write React components...</p>",
            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
            category="React",
            tags=["React", "Hooks", "JavaScript", "Frontend"],
            author="MMB",
            read_time="12 min read",
            published=True
        ),
        BlogPost(
            title="Building Responsive Websites with Tailwind CSS",
            excerpt="Learn advanced Tailwind CSS techniques for creating beautiful, responsive designs that work perfectly across all devices and screen sizes.",
            content="<h2>Getting Started with Tailwind CSS</h2><p>Tailwind CSS is a utility-first CSS framework...</p>",
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
            category="CSS",
            tags=["Tailwind CSS", "Responsive Design", "CSS", "Web Design"],
            author="MMB",
            read_time="8 min read",
            published=True
        ),
        BlogPost(
            title="Node.js Best Practices for Production Applications",
            excerpt="Essential Node.js best practices, security considerations, and performance optimizations for building scalable backend applications in production.",
            content="<h2>Node.js Production Best Practices</h2><p>Building production-ready Node.js applications requires...</p>",
            image="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
            category="Node.js",
            tags=["Node.js", "Backend", "JavaScript", "Best Practices"],
            author="MMB",
            read_time="15 min read",
            published=False
        )
    ]
    
    for blog in blogs_data:
        await blogs_collection.insert_one(blog)
    print("✅ Blog posts created")
    
    # Seed Sample Contacts
    contacts_data = [
        ContactInquiry(
            name="John Doe",
            email="john@example.com",
            phone="+91 98765 43210",
            project_type="Website Development",
            budget="₹25,000 - ₹50,000",
            message="I need a modern website for my business. Please contact me to discuss the requirements.",
            timeline="1-2 Months",
            read=False
        ),
        ContactInquiry(
            name="Sarah Wilson",
            email="sarah@company.com",
            phone="+91 87654 32109",
            project_type="E-commerce Store",
            budget="₹50,000 - ₹1,00,000",
            message="Looking for an e-commerce solution with payment gateway integration.",
            timeline="3-4 Weeks",
            read=True
        )
    ]
    
    for contact in contacts_data:
        await contacts_collection.insert_one(contact)
    print("✅ Contact inquiries created")
    
    print("🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())