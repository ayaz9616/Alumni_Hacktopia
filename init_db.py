"""Initialize database tables"""
from database import init_mysql_db

if __name__ == "__main__":
    print("🔧 Initializing database...")
    try:
        init_mysql_db()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
