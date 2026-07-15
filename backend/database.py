from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse

# URL-encode the password to safely handle the '@' symbol
encoded_password = urllib.parse.quote_plus("Sindhu0509@")
# Using port 6543 (Supabase Connection Pooler) to avoid network firewall blocks on port 5432
DATABASE_URL = f"postgresql://postgres:{encoded_password}@db.tcvegfwrfcdiyzwfqxuv.supabase.co:6543/postgres"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
