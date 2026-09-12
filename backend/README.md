# RAILOPT AI — Backend & Supabase Integration (SIH26027)

**Product Name**: RAILOPT AI  
**Problem Statement**: SIH26027 — AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways  
**Ministry**: Ministry of Railways  
**Domain**: Transportation & Logistics  

---

## 🏗️ Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: Supabase PostgreSQL & SQLAlchemy 2.x (with SQLite local fallback)
- **Authentication**: Supabase Auth & JWT Verification (`CONTROL001` / `demo123`)
- **AI/ML Priority Engine**: scikit-learn (Explainable maintenance priority scoring)
- **Optimization Engine**: Google OR-Tools CP-SAT Solver (Multi-departmental joint block packing)
- **Conflict Detector**: Block vs Block, Block vs Train, Resource Conflict Detection
- **Simulator**: Timetable Train Impact Simulator

---

## ⚡ Quick Start Instructions

### 1. Environment Setup
```bash
cd backendcd
python -m venv .venv
```
Windows:
```powershell
.venv\Scripts\activate
```
Install requirements:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your Supabase database URL & keys:
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Seed Database
```bash
python scripts/seed_database.py
```

### 4. Run FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API Docs will be available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🔐 Demo Account Credentials

For SIH presentation and jury evaluation:
- **Employee ID**: `CONTROL001`
- **Password**: `demo123`
- **Role**: Control Officer
- **Department**: Operations Control Office
