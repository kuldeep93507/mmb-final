from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import json
from pathlib import Path
from admin_routes import admin_router
from public_routes import public_router
from profile_routes import profile_router
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory if it doesn't exist
uploads_dir = ROOT_DIR / "uploads"
uploads_dir.mkdir(exist_ok=True)

# Mock database using JSON files
class MockResult:
    def __init__(self, modified_count=0, deleted_count=0, inserted_id=None):
        self.modified_count = modified_count
        self.deleted_count = deleted_count
        self.inserted_id = inserted_id

class MockDB:
    def __init__(self):
        self.data_dir = ROOT_DIR / 'mock_data'
        self.data_dir.mkdir(exist_ok=True)
        
    def get_collection(self, name):
        return MockCollection(self.data_dir / f'{name}.json')

class MockCursor:
    def __init__(self, file_path, filter_dict=None, limit_count=None, sort_field=None, sort_order=1):
        self.file_path = file_path
        self.filter_dict = filter_dict
        self.limit_count = limit_count
        self.sort_field = sort_field
        self.sort_order = sort_order
        
    def sort(self, field, order=1):
        return MockCursor(self.file_path, self.filter_dict, self.limit_count, field, order)
        
    def limit(self, count):
        return MockCursor(self.file_path, self.filter_dict, count, self.sort_field, self.sort_order)
        
    async def to_list(self, limit=None):
        if not self.file_path.exists():
            return []
        
        with open(self.file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                return []
        
        # Apply filter if provided
        if self.filter_dict:
            filtered_data = []
            for item in data:
                match = True
                for key, value in self.filter_dict.items():
                    if key not in item or item[key] != value:
                        match = False
                        break
                if match:
                    filtered_data.append(item)
            data = filtered_data
        
        # Apply sort
        if self.sort_field:
            try:
                data.sort(key=lambda x: x.get(self.sort_field, ''), reverse=(self.sort_order == -1))
            except:
                pass
        
        # Apply limit
        if self.limit_count:
            data = data[:self.limit_count]
        if limit:
            data = data[:limit]
        return data

class MockCollection:
    def __init__(self, file_path):
        self.file_path = file_path
        
    def find(self, filter_dict=None):
        return MockCursor(self.file_path, filter_dict)
        
    async def find_async(self, filter_dict=None, limit=None):
        if not self.file_path.exists():
            return []
        
        with open(self.file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                return []
        
        if limit:
            data = data[:limit]
        return data
        
    async def find_one(self, filter_dict):
        if not self.file_path.exists():
            return None
            
        with open(self.file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                return None
        
        # Simple filter matching
        for item in data:
            match = True
            for key, value in filter_dict.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                return item
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
        
    async def update_one(self, filter_dict, update_dict, upsert=False):
        data = []
        if self.file_path.exists():
            with open(self.file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except:
                    data = []
        
        # Find and update item
        modified_count = 0
        found = False
        for i, item in enumerate(data):
            match = True
            for key, value in filter_dict.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                if '$set' in update_dict:
                    data[i].update(update_dict['$set'])
                modified_count = 1
                found = True
                break
        
        # If not found and upsert is True, create new document
        if not found and upsert:
            new_doc = filter_dict.copy()
            if '$set' in update_dict:
                new_doc.update(update_dict['$set'])
            # Add a unique ID for the new document
            import uuid
            new_doc['_id'] = str(uuid.uuid4())
            data.append(new_doc)
            modified_count = 1
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        return MockResult(modified_count=modified_count)
        
    async def delete_one(self, filter_dict):
        if not self.file_path.exists():
            return MockResult(deleted_count=0)
            
        with open(self.file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                return MockResult(deleted_count=0)
        
        # Find and delete item
        deleted_count = 0
        for i, item in enumerate(data):
            match = True
            for key, value in filter_dict.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                del data[i]
                deleted_count = 1
                break
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        return MockResult(deleted_count=deleted_count)
        
    async def delete_many(self, filter_dict):
        return None
        
    async def count_documents(self, filter_dict=None):
        if not self.file_path.exists():
            return 0
            
        with open(self.file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                return 0
        
        if filter_dict is None or not filter_dict:
            return len(data)
            
        # Simple filter matching for count
        count = 0
        for item in data:
            match = True
            for key, value in filter_dict.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                count += 1
        return count

# Create mock database instance
db = MockDB()

# Add collections as attributes for compatibility
db.admins = db.get_collection('admins')
db.services = db.get_collection('services')
db.projects = db.get_collection('projects')
db.testimonials = db.get_collection('testimonials')
db.blogs = db.get_collection('blogs')
db.contacts = db.get_collection('contacts')
db.profiles = db.get_collection('profiles')

# Inject database into route modules
import admin_routes
import public_routes
import profile_routes

admin_routes.db = db
public_routes.db = db
profile_routes.db = db

# Create the main app
app = FastAPI(title="MMB Portfolio API", version="1.0.0")

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Include routers
app.include_router(admin_router)
app.include_router(public_router)
app.include_router(profile_router)

# Get CORS origins from environment - avoid wildcard for security
cors_origins_env = os.getenv('CORS_ORIGINS', '')
if cors_origins_env:
    cors_origins = [origin.strip() for origin in cors_origins_env.split(',')]
else:
    # Default to specific domains for security
    cors_origins = [
        'https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev',
        'http://localhost:5000'
    ]

# Admin panel route  
@app.get("/admin")
async def admin_panel():
    frontend_url = os.getenv('FRONTEND_URL', 'https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev')
    return {"message": f"Admin Panel - Please use frontend at {frontend_url}/admin/login"}

# Legacy route for compatibility
@app.get("/api/")
async def root():
    return {"message": "MMB Portfolio API - Admin Panel Ready"}

# Root route
@app.get("/")
async def home():
    frontend_url = os.getenv('FRONTEND_URL', 'https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev')
    return {"message": "MMB Portfolio API - Backend Server Running", "admin_panel": f"{frontend_url}/admin/login", "api_docs": "/docs"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Shutdown event removed - using mock database

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
