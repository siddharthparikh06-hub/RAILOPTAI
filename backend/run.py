import os
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure current directory is in sys.path
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, backend_dir)
    
    print("=" * 60)
    print("Starting RAILOPT AI Production FastAPI Backend Server")
    print("URL: http://127.0.0.1:8000")
    print("API Docs: http://127.0.0.1:8000/docs")
    print("=" * 60)
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
