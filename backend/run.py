import uvicorn
import sys

if __name__ == "__main__":
    print("Starting FastAPI backend server wrapper...")
    try:
        uvicorn.run("main:app", host="127.0.0.1", port=8081, log_level="info")
    except Exception as e:
        print("CRITICAL EXCEPTION IN BACKEND SERVER:")
        import traceback
        traceback.print_exc()
        sys.exit(1)
