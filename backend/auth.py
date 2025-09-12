import jwt
import bcrypt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'mmb-admin-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current admin from JWT token with token version validation"""
    import admin_routes  # Import here to avoid circular imports
    
    token = credentials.credentials
    payload = verify_token(token)
    admin_id = payload.get("sub")
    token_version = payload.get("token_version")
    
    if admin_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate token version against current admin record
    db = admin_routes.db
    admin = await db.admins.find_one({"id": admin_id})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    
    current_token_version = admin.get("token_version", 1)
    if token_version != current_token_version:
        raise HTTPException(status_code=401, detail="Token has been invalidated")
    
    return {"id": admin_id, "email": payload.get("email")}

# Default admin credentials - CHANGE THESE IMMEDIATELY AFTER DEPLOYMENT
DEFAULT_ADMIN = {
    "email": "fiewin375@gmail.com",
    "password": "MMB@2024!Secure",  # This will be hashed
    "name": "Kuldeep Parjapati"
}