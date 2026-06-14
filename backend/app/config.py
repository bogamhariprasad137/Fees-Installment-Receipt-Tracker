import os
import urllib.parse

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fees-tracker-secret-key-123456")
    
    # DB settings
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_USER = os.environ.get("DB_USER", "root")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
    DB_NAME = os.environ.get("DB_NAME", "fees_tracker")
    DB_PORT = int(os.environ.get("DB_PORT", 3306))
    
    # Parse DATABASE_URL if present
    # e.g., mysql+pymysql://user:password@host:port/database
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if DATABASE_URL:
        try:
            # Simple parse
            url = urllib.parse.urlparse(DATABASE_URL)
            # url.netloc contains user:password@host:port
            netloc = url.netloc
            auth, host_port = netloc.split("@") if "@" in netloc else ("", netloc)
            
            if auth:
                user_pass = auth.split(":")
                DB_USER = user_pass[0]
                if len(user_pass) > 1:
                    DB_PASSWORD = urllib.parse.unquote(user_pass[1])
            
            if ":" in host_port:
                DB_HOST, port_str = host_port.split(":")
                DB_PORT = int(port_str)
            else:
                DB_HOST = host_port
                
            DB_NAME = url.path.lstrip("/")
        except Exception as e:
            print(f"Error parsing DATABASE_URL: {e}, falling back to defaults")
