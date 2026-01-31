# database.py

import os
import hashlib
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError
import json

load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")

# Extract database name from URI or use default
def get_db_name_from_uri(uri):
    """Extract database name from MongoDB URI or return default."""
    if not uri:
        return "resume_tracker"
    
    # Try to extract database name from URI path
    try:
        from urllib.parse import urlparse
        parsed = urlparse(uri)
        # Remove leading slash and query params
        db_name = parsed.path.lstrip('/').split('?')[0]
        return db_name if db_name else "resume_tracker"
    except:
        return "resume_tracker"

MONGO_DB_NAME = get_db_name_from_uri(MONGO_URI)

# Initialize MongoDB client
mongo_client = None
db = None

def init_mongodb():
    """Initialize MongoDB connection and create indexes."""
    global mongo_client, db
    
    if mongo_client is None:
        try:
            mongo_client = MongoClient(MONGO_URI)
            db = mongo_client[MONGO_DB_NAME]
            
            # Create indexes for better performance
            # Users collection
            db.users.create_index("username", unique=True, sparse=True)
            db.users.create_index("email", unique=True, sparse=True)
            db.users.create_index("google_id", unique=True, sparse=True)
            
            # User resumes collection
            db.user_resumes.create_index([("user_id", ASCENDING), ("resume_hash", ASCENDING)], unique=True)
            db.user_resumes.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
            
            # User analysis collection
            db.user_analysis.create_index([
                ("user_id", ASCENDING),
                ("resume_hash", ASCENDING),
                ("jd_hash", ASCENDING),
                ("provider", ASCENDING),
                ("model", ASCENDING),
                ("intensity", ASCENDING)
            ], unique=True)
            db.user_analysis.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
            
            # User settings collection
            db.user_settings.create_index("user_id", unique=True)
            
            print("✅ MongoDB connected and indexes created successfully!")
            return True
        except Exception as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            raise
    return True

def get_db():
    """Get MongoDB database instance."""
    if db is None:
        init_mongodb()
    return db


# --- User Auth Functions ---
def create_user(username: str, password: str):
    """Create a new user with traditional auth."""
    username = (username or '').strip()
    password = (password or '').strip()
    if not username or not password:
        return None
    
    pwd_hash = hashlib.sha256(password.encode()).hexdigest()
    database = get_db()
    
    try:
        user_doc = {
            "username": username,
            "password_hash": pwd_hash,
            "auth_type": "traditional",
            "created_at": datetime.utcnow(),
            "last_login": None
        }
        result = database.users.insert_one(user_doc)
        return str(result.inserted_id)
    except DuplicateKeyError:
        return None
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return None

def authenticate_user(username: str, password: str):
    """Authenticate user with username and password."""
    database = get_db()
    
    try:
        user = database.users.find_one({"username": username})
        if not user:
            return None
        
        pwd_hash = hashlib.sha256(password.encode()).hexdigest()
        if pwd_hash == user['password_hash']:
            return {
                "id": str(user['_id']),
                "username": user['username']
            }
        return None
    except Exception as e:
        print(f"❌ Error authenticating user: {e}")
        return None

def get_user_by_username(username: str):
    """Get user by username."""
    database = get_db()
    
    try:
        user = database.users.find_one({"username": username})
        if user:
            return {
                "id": str(user['_id']),
                "username": user['username']
            }
        return None
    except Exception as e:
        print(f"❌ Error getting user: {e}")
        return None


# --- Google OAuth Functions ---
def create_or_update_google_user(email: str, google_id: str, name: str = None, picture: str = None):
    """Create a new user from Google OAuth or update existing user."""
    database = get_db()
    
    try:
        # Check if user with this google_id already exists
        user = database.users.find_one({"google_id": google_id})
        
        if user:
            # Update last login and profile info
            database.users.update_one(
                {"google_id": google_id},
                {
                    "$set": {
                        "last_login": datetime.utcnow(),
                        "full_name": name,
                        "profile_picture": picture
                    }
                }
            )
            user = database.users.find_one({"google_id": google_id})
        else:
            # Check if email already exists
            existing = database.users.find_one({"email": email})
            
            if existing:
                # Link Google account to existing user
                database.users.update_one(
                    {"email": email},
                    {
                        "$set": {
                            "google_id": google_id,
                            "auth_type": "google",
                            "full_name": name,
                            "profile_picture": picture,
                            "last_login": datetime.utcnow()
                        }
                    }
                )
                user = database.users.find_one({"email": email})
            else:
                # Create new user
                user_doc = {
                    "email": email,
                    "google_id": google_id,
                    "full_name": name,
                    "profile_picture": picture,
                    "auth_type": "google",
                    "created_at": datetime.utcnow(),
                    "last_login": datetime.utcnow()
                }
                result = database.users.insert_one(user_doc)
                user = database.users.find_one({"_id": result.inserted_id})
        
        if not user:
            print(f"❌ Failed to create/retrieve user")
            return None
        
        return {
            "id": str(user['_id']),
            "username": user.get('username') or user.get('email', '').split('@')[0],
            "email": user.get('email'),
            "name": user.get('full_name'),
            "picture": user.get('profile_picture'),
            "google_id": user.get('google_id'),
            "auth_type": user.get('auth_type')
        }
    except Exception as e:
        print(f"❌ Error creating/updating Google user: {e}")
        return None


def get_user_by_google_id(google_id: str):
    """Get user by Google ID."""
    database = get_db()
    
    try:
        user = database.users.find_one({"google_id": google_id})
        if user:
            return {
                "id": str(user['_id']),
                "username": user.get('username') or user.get('email', '').split('@')[0],
                "email": user.get('email'),
                "name": user.get('full_name'),
                "picture": user.get('profile_picture'),
                "google_id": user.get('google_id'),
                "auth_type": user.get('auth_type')
            }
        return None
    except Exception as e:
        print(f"❌ Error getting user by Google ID: {e}")
        return None


def get_user_by_email(email: str):
    """Get user by email."""
    database = get_db()
    
    try:
        user = database.users.find_one({"email": email})
        if user:
            return {
                "id": str(user['_id']),
                "username": user.get('username') or user.get('email', '').split('@')[0],
                "email": user.get('email'),
                "name": user.get('full_name'),
                "picture": user.get('profile_picture'),
                "auth_type": user.get('auth_type')
            }
        return None
    except Exception as e:
        print(f"❌ Error getting user by email: {e}")
        return None


def get_user_settings(user_id: int) -> dict:
    """Get user settings."""
    database = get_db()
    
    try:
        settings = database.user_settings.find_one({"user_id": user_id})
        if settings:
            return settings.get('settings', {})
        return {}
    except Exception as e:
        print(f"❌ Error getting user settings: {e}")
        return {}

def save_user_settings(user_id: int, settings: dict):
    """Save user settings."""
    database = get_db()
    
    try:
        database.user_settings.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "settings": settings,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        return True
    except Exception as e:
        print(f"❌ Error saving user settings: {e}")
        return False

# --- User resume storage (per-user, hashed) ---
def save_user_resume(user_id: int, filename: str, resume_hash: str, resume_text: str):
    """Save or update a user's resume."""
    if not user_id or not resume_hash or not resume_text:
        return None
    
    database = get_db()
    
    try:
        # Check if resume with this hash already exists for this user
        existing = database.user_resumes.find_one({
            "user_id": user_id,
            "resume_hash": resume_hash
        })
        
        if existing:
            return str(existing['_id'])
        
        # Insert new resume
        resume_doc = {
            "user_id": user_id,
            "filename": filename,
            "resume_hash": resume_hash,
            "resume_text": resume_text,
            "created_at": datetime.utcnow()
        }
        result = database.user_resumes.insert_one(resume_doc)
        return str(result.inserted_id)
    except DuplicateKeyError:
        # If duplicate, fetch existing
        existing = database.user_resumes.find_one({
            "user_id": user_id,
            "resume_hash": resume_hash
        })
        return str(existing['_id']) if existing else None
    except Exception as e:
        print(f"❌ Error saving user resume: {e}")
        return None

def get_user_resumes(user_id: int):
    """List saved resumes for a user."""
    database = get_db()
    
    try:
        resumes = database.user_resumes.find(
            {"user_id": user_id}
        ).sort("created_at", DESCENDING)
        
        result = []
        for resume in resumes:
            result.append({
                "id": str(resume['_id']),
                "filename": resume.get('filename'),
                "resume_hash": resume.get('resume_hash'),
                "created_at": resume.get('created_at')
            })
        return result
    except Exception as e:
        print(f"❌ Error getting user resumes: {e}")
        return []

def get_user_resume_by_id(user_id: int, user_resume_id: str):
    """Get a specific resume by ID."""
    database = get_db()
    
    try:
        from bson.objectid import ObjectId
        resume = database.user_resumes.find_one({
            "_id": ObjectId(user_resume_id),
            "user_id": user_id
        })
        
        if resume:
            return {
                "id": str(resume['_id']),
                "filename": resume.get('filename'),
                "resume_hash": resume.get('resume_hash'),
                "resume_text": resume.get('resume_text'),
                "created_at": resume.get('created_at')
            }
        return None
    except Exception as e:
        print(f"❌ Error getting user resume by ID: {e}")
        return None

# --- Analysis caching ---
def get_cached_analysis(user_id: int, resume_hash: str, jd_hash: str, provider: str, model: str, intensity: str):
    """Get cached analysis result."""
    database = get_db()
    
    try:
        analysis = database.user_analysis.find_one({
            "user_id": user_id,
            "resume_hash": resume_hash,
            "jd_hash": jd_hash,
            "provider": provider or '',
            "model": model or '',
            "intensity": intensity or 'full'
        })
        
        if analysis:
            return analysis.get('result_json', {})
        return None
    except Exception as e:
        print(f"❌ Error getting cached analysis: {e}")
        return None

def save_cached_analysis(user_id: int, resume_hash: str, jd_hash: str, provider: str, model: str, intensity: str, result: dict):
    """Save analysis result to cache."""
    if not user_id or not resume_hash or not jd_hash or not result:
        return False
    
    database = get_db()
    
    try:
        database.user_analysis.update_one(
            {
                "user_id": user_id,
                "resume_hash": resume_hash,
                "jd_hash": jd_hash,
                "provider": provider or '',
                "model": model or '',
                "intensity": intensity or 'full'
            },
            {
                "$set": {
                    "result_json": result,
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        return True
    except Exception as e:
        print(f"❌ Error saving cached analysis: {e}")
        return False

# Legacy function for compatibility
def init_mysql_db():
    """Initialize MongoDB (replaces MySQL init)."""
    return init_mongodb()

# --- Pinecone Functions (kept for compatibility) ---
