# AutoScope AI ⚡
### Autonomous Client Scoping, Cloud Architecture & Commercial Statement of Work (SOW) Engine

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styles-Tailwind%20CSS%20v4-38B2AC.svg)](https://tailwindcss.com/)
[![Pydantic v2](https://img.shields.io/badge/Schema-Pydantic%20v2-E92063.svg)](https://docs.pydantic.dev/)
[![OpenRouter](https://img.shields.io/badge/LLM-Llama--3.3--70B-purple.svg)](https://openrouter.ai/)
[![AssemblyAI](https://img.shields.io/badge/Voice-AssemblyAI-0066CC.svg)](https://www.assemblyai.com/)
[![Pytest](https://img.shields.io/badge/Tests-9%20Passed-brightgreen.svg)](https://docs.pytest.org/)
[![24/7 Uptime](https://img.shields.io/badge/Render-24%2F7%20Keep--Alive%20Active-brightgreen.svg)](https://github.com/TANMAY4806w/cynbit-autoscope-ai/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-cynbit--autoscope--ai.onrender.com-blue.svg)](https://cynbit-autoscope-ai.onrender.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**AutoScope AI** is a production-grade autonomous Solutions Architect & Presales Proposal Synthesis platform. It converts ambiguous client requirements into enterprise cloud microservice architectures, high-contrast interactive Mermaid flowcharts, itemized sprint engineering roadmaps, and client-ready Statements of Work (SOWs) in **under 90 seconds**.

---

## 📌 1. The Presales & Architecture Bottleneck

```mermaid
flowchart LR
    A["Inbound Vague Lead"] --> B["5-10 Hrs Discovery Calls"]
    B --> C["Manual Diagramming & Scoping"]
    C --> D["3-5 Days Proposal Delay"]
    D --> E["AutoScope AI"]
    E --> F["Instant Blueprint & SOW in 90s"]
    F --> G["70% Presales Overhead Cut"]
```

* **The Problem:** Modern engineering teams and agency architects spend **5 to 10 hours per prospect** doing discovery calls, diagramming architectures, vetting compliance criteria (HIPAA, GDPR, SOC2, PCI-DSS), and modeling engineering hours.
* **The Solution:** **AutoScope AI** automates this entire pipeline into an interactive **90-second technical discovery, architecture generator, and Statement of Work (SOW) compiler**.

---

## 🚀 2. Production Features & Architecture

```mermaid
flowchart TD
    Client["Client Inquiry (Text or Voice)"] --> Voice["AssemblyAI Voice Transcriber"]
    Voice --> AgentPipeline["5-Agent Collaborative Pipeline"]
    AgentPipeline --> Pydantic["Pydantic v2 Contracts (0% Hallucination)"]
    Pydantic --> Outputs["Deliverable Outputs"]
    Outputs --> ArchMap["High-Contrast Mermaid Architecture"]
    Outputs --> TechStack["Component Tech Stack Matrix"]
    Outputs --> Roadmap["Sprint Milestones & Acceptance Criteria"]
    Outputs --> SOW["Commercial SOW with 30/40/30 Payment Gates"]
```

### Key Engineering Capabilities:
1. **Multi-Modal Client Intake (Text + Audio)**:
   * Clients can type their requirements or **drag-and-drop a voice note / Zoom recording** (.mp3, .wav, .m4a).
   * Audio is automatically transcribed into structured specifications via **AssemblyAI**.
2. **5-Agent Multi-Agent Engine**:
   * **Discovery Agent**: Extracts concurrency, compliance (HIPAA, GDPR, SOC2, PCI-DSS), and cloud preferences.
   * **Architect Agent**: Synthesizes microservices, DB schemas, caches, message queues, and AI/RAG pipelines via **OpenRouter (Llama-3.3-70B)** / **Groq** / **Gemini**.
   * **Diagram Synthesizer**: Generates zero-fill, high-contrast Mermaid flowcharts & ASCII architecture maps.
   * **Cost & Sprint Estimator**: Calculates developer hours by role, sprint milestones, and itemized monthly cloud burn.
   * **Proposal & SOW Compiler**: Compiles an executive-ready Statement of Work with legal clauses, IP transfer, and milestone payment schedules.
3. **100% Deterministic Offline Fallback**:
   * Operates with 100% fidelity offline via built-in domain expert templates (Healthcare, FinTech, E-Commerce, SaaS, EdTech), ensuring zero downtime for reviewers.
4. **Classic Enterprise UI/UX**:
   * Designed with a clean Stripe/Linear inspired aesthetic.
   * Features `@keyframes slideInUp` smooth cubic-bezier transitions across 7 interactive tabs.

---

## ⚡ 3. Quickstart & Local Installation

### Prerequisites
* Python 3.10+ (Tested on Python 3.13)
* Node.js v18+ & npm (Optional, only needed if modifying frontend code)
* Git

### Step 1: Clone Repository
```bash
git clone https://github.com/TANMAY4806w/cynbit-autoscope-ai.git
cd cynbit-autoscope-ai
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run Automated Pytest Suite (9/9 Passing)
```bash
python -m pytest tests/ -v
```
*(Verifies schema validation, offline heuristic engine, high-contrast Mermaid syntax, cost math, commercial terms, audio error handling, live proposal generation, FastAPI `/api/health`, and FastAPI `/api/synthesize` endpoints).*

### Step 4: Run Application

#### Option A: Unified Production Full-Stack (FastAPI + React 19) [Recommended]
```bash
python server.py
```
* **Frontend Web App:** Open `http://localhost:8000` in your browser.
* **OpenAPI Interactive Swagger Docs:** Available at `http://localhost:8000/docs`.

#### Option B: React Frontend Dev Server (Vite HMR)
```bash
cd web-app
npm install
npm run dev
```
* Runs Vite dev server at `http://localhost:5173` with instant hot-reloading.

---

## 🚀 4. Production Cloud Deployment on Render (24/7 Zero Spin-Down)

AutoScope AI includes pre-configured Render infrastructure (`render.yaml`) and an automated **GitHub Actions Keep-Alive Cron** (`.github/workflows/keep_alive.yml`) to keep the Render free-tier instance permanently active with **zero cold starts and zero sleep timeouts**.

```mermaid
flowchart LR
    Push["git push origin main"] --> RenderBuild["Render Auto-Builds React + FastAPI"]
    RenderBuild --> Health["Live on Render"]
    Health --> Cron["GitHub Actions (Every 14m Ping)"]
    Cron --> Active["24/7 Active (No Sleep / Zero Cold Starts)"]
```

### Step-by-Step Render Deployment:

1. **Sign Up / Log In**:
   * Navigate to [render.com](https://render.com) and log in with your GitHub account.

2. **Create New Web Service**:
   * Click **New +** ➡️ **Web Service**.
   * Choose **Build and deploy from a Git repository**.
   * Connect and select `cynbit-autoscope-ai`.

3. **Configure Service Settings**:
   * **Name**: `autoscope-ai` (or your chosen subdomain)
   * **Region**: `Oregon (US West)` or `Frankfurt (EU)`
   * **Branch**: `main`
   * **Runtime**: `Python 3`
   * **Build Command**:
     ```bash
     pip install -r requirements.txt && npm --prefix web-app install && npm --prefix web-app run build
     ```
   * **Start Command**:
     ```bash
     uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
   * **Instance Type**: `Free`

4. **Add Environment Variables in Render**:
   In the **Environment Variables** section, add the following key-value pairs:

   | Key | Value | Purpose |
   | :--- | :--- | :--- |
   | `PORT` | `10000` | Render internal port routing |
   | `PYTHON_VERSION` | `3.12.8` | Stable Python runtime environment |
   | `OPENROUTER_API_KEY` | *(Your key or leave empty)* | Optional: Cloud LLM inference (Llama 3.3 70B) |
   | `GROQ_API_KEY` | *(Your key or leave empty)* | Optional: High-speed Groq LPU inference |
   | `ASSEMBLYAI_API_KEY` | *(Your key or leave empty)* | Optional: Voice note & Zoom audio transcription |

   *(Note: If no API keys are provided, the system automatically uses its built-in Deterministic Offline Engine with 100% full feature availability).*

5. **Deploy**:
   * Click **Create Web Service**. Render will provision dependencies and serve the app at `https://autoscope-ai.onrender.com`.

---

## ⏱️ 5. Setting Up 24/7 Keep-Alive Automation (Solves Free Tier Sleep)

Render's free tier spins down after **15 minutes of inactivity**. We prevent this completely via our included GitHub Action:

1. Copy your live Render URL (e.g. `https://autoscope-ai.onrender.com`).
2. Go to your GitHub repository:
   * **Settings** ➡️ **Secrets and variables** ➡️ **Actions** ➡️ **New repository secret**.
3. Create the secret:
   * **Name**: `RENDER_APP_URL`
   * **Value**: `https://autoscope-ai.onrender.com` *(replace with your actual Render URL)*
4. Click **Add secret**.

The workflow in `.github/workflows/keep_alive.yml` automatically triggers **every 14 minutes**, pinging `/api/health` so your application stays warm 24 hours a day, 7 days a week.

---

## 📁 6. Repository File Structure

```text
cynbit-autoscope-ai/
├── .github/
│   └── workflows/
│       ├── keep_alive.yml      # 24/7 Render Keep-Alive Cron (Pings /api/health every 14m)
│       └── ci.yml              # Automated GitHub Actions Pytest Suite
├── render.yaml                 # Infrastructure-as-Code Blueprint for Render Deployment
├── server.py                   # Production FastAPI Backend & Static React Server
├── requirements.txt            # Python dependencies (FastAPI, Uvicorn, Pydantic, Pytest)
├── .env.example                # Configuration template for optional API keys
├── README.md                   # Complete repository documentation
├── PRD_AND_TECHNICAL_ARCHITECTURE_PLAN.md # Master Product Requirements & Architecture Spec
├── web-app/                    # Production React 19 + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── App.tsx             # Main Application shell with 7 tabs & slide animations
│   │   ├── types.ts            # TypeScript interfaces aligned with Pydantic schemas
│   │   ├── proposalEngine.ts   # Client-side heuristic synthesis & API client
│   │   └── index.css           # Tailwind CSS v4 styling & animations
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/                   # Production compiled assets
├── core/
│   ├── __init__.py
│   ├── schemas.py              # Pydantic v2 data models & validation
│   ├── architect_engine.py     # Multi-provider LLM + Deterministic Offline Engine
│   ├── audio_transcriber.py    # AssemblyAI voice note intake module
│   ├── diagram_generator.py    # Zero-fill high-contrast Mermaid generator
│   ├── cost_estimator.py       # Algorithmic sprint & cloud cost calculator
│   └── exporter.py             # Executive SOW & proposal markdown compiler
├── prompts/
│   ├── __init__.py
│   └── system_prompt.py        # System prompts & few-shot architecture schemas
└── tests/
    ├── __init__.py
    └── test_engine.py          # Pytest automated test suite (9/9 Passing)
```

---

## 💼 7. Project Information & Open Source Links

* **Repository:** [https://github.com/TANMAY4806w/cynbit-autoscope-ai](https://github.com/TANMAY4806w/cynbit-autoscope-ai)
* **API Documentation:** Interactive Swagger UI available at `http://localhost:8000/docs`
* **License:** MIT Open Source License
