from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse

# URL-encode the password to safely handle the '@' symbol
encoded_password = urllib.parse.quote_plus("Sindhuja0509@")
DATABASE_URL = f"postgresql://postgres:{encoded_password}@db.tcvegfwrfcdiyzwfqxuv.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
