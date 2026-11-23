"""
Cynbit AutoScope AI — Production FastAPI Backend & Static Server
Provides REST endpoints with OpenAPI documentation and serves the React production frontend.
"""

import os
import tempfile
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Load environment
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from core.schemas import ClientInput, ArchitectureProposal
from core.architect_engine import generate_full_proposal
from core.exporter import export_proposal_markdown
from core.audio_transcriber import transcribe_client_audio

app = FastAPI(
    title="Cynbit AutoScope AI API",
    description="Autonomous Solutions Architect & ProposalCraft Engine for Cynbit Technologies Private Limited",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """Returns service health and active AI integration status."""
    return {
        "status": "healthy",
        "service": "Cynbit AutoScope AI",
        "integrations": {
            "openrouter": bool(os.getenv("OPENROUTER_API_KEY")),
            "groq": bool(os.getenv("GROQ_API_KEY")),
            "assemblyai": bool(os.getenv("ASSEMBLYAI_API_KEY")),
            "deterministic_offline_engine": True
        }
    }

@app.post("/api/synthesize", response_model=ArchitectureProposal)
def synthesize_proposal(client_input: ClientInput):
    """
    Main multi-agent pipeline: takes raw client requirements,
    extracts constraints, synthesizes microservices architecture,
    builds high-contrast Mermaid topology, and models sprint SOW budget.
    """
    try:
        proposal = generate_full_proposal(client_input)
        return proposal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribes an uploaded audio meeting recording or voice note via AssemblyAI."""
    suffix = os.path.splitext(file.filename)[1] or ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    success, result = transcribe_client_audio(tmp_path)
    try:
        os.remove(tmp_path)
    except Exception:
        pass

    if not success:
        raise HTTPException(status_code=400, detail=result)
    return {"transcript": result}

@app.post("/api/export-sow")
def export_sow(proposal: ArchitectureProposal):
    """Compiles a complete Statement of Work (SOW) markdown document with commercial terms."""
    md = export_proposal_markdown(proposal)
    return {"markdown": md}

# Serve React static assets if built
dist_dir = os.path.join(os.path.dirname(__file__), "web-app", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and not os.path.isdir(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"⚡ Starting Cynbit AutoScope AI on http://localhost:{port}")
    print(f"📖 OpenAPI Swagger Documentation at http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
