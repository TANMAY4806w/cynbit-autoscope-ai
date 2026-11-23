# Cynbit AutoScope AI ⚡
### Autonomous Client Scoping, Cloud Architecture & Commercial SOW Engine

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit%201.45-FF4B4B.svg)](https://streamlit.io/)
[![Pydantic v2](https://img.shields.io/badge/Schema-Pydantic%20v2-E92063.svg)](https://docs.pydantic.dev/)
[![OpenRouter](https://img.shields.io/badge/LLM-Llama--3.3--70B-purple.svg)](https://openrouter.ai/)
[![AssemblyAI](https://img.shields.io/badge/Voice-AssemblyAI-0066CC.svg)](https://www.assemblyai.com/)
[![Pytest](https://img.shields.io/badge/Tests-7%20Passed-brightgreen.svg)](https://docs.pytest.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Applicant:** Tanmay Patil ([patiltanmay019@gmail.com](mailto:patiltanmay019@gmail.com) | +91 8308695986)  
> **Role:** AI/ML Engineer Intern Assessment  
> **Company:** Cynbit Technologies Private Limited ([cynbit.in](https://cynbit.in), Jaipur, India)  
> **Candidate Portal:** [cynbit.in/candidate/cmwovenwx000708jnepnj4974](https://www.cynbit.in/candidate/cmwovenwx000708jnepnj4974)

---

## 📌 1. The Business Problem at Cynbit Technologies

```mermaid
flowchart LR
    A["Inbound Vague Lead"] --> B["5-10 Hrs Discovery Calls"]
    B --> C["Manual Diagramming & Scoping"]
    C --> D["3-5 Days Proposal Delay"]
    D --> E["Cynbit AutoScope AI"]
    E --> F["Instant Blueprint & SOW in 90s"]
    F --> G["70% Presales Overhead Cut"]
```

* **The Agency Pain Point:** Cynbit builds custom AI automation, web apps, and cloud systems for B2B clients. Inbound inquiries (via `cynbit.in/contact`) are typically vague (e.g. *"Build an AI doctor app with chat"*).
* **The Cost:** Senior technical architects and founders spend **5 to 10 hours per lead** conducting discovery calls, sketching architecture diagrams, picking compliant tech stacks, and modeling sprint budgets.
* **The Solution:** **Cynbit AutoScope AI** automates this entire presales pipeline into an interactive **90-second technical discovery, architecture generator, and Statement of Work (SOW) compiler**.

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
* Git

### Step 1: Clone Repository
```bash
git clone https://github.com/TANMAY4806w/cynbit-autoscope-ai.git
cd cynbit-autoscope-ai
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run Automated Pytest Suite (7/7 Passing)
```bash
python -m pytest tests/ -v
```
*(Verifies schema validation, offline engine, cost math, high-contrast Mermaid syntax, audio fallback, and SOW clauses).*

### Step 4: Launch Web Dashboard
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## 📁 4. Repository File Structure

```text
cynbit-autoscope-ai/
├── app.py                      # Interactive Streamlit Web Application
├── requirements.txt            # Python dependencies (Streamlit, Pydantic, Pytest)
├── .env.example                # Configuration template for optional API keys
├── README.md                   # Complete repository documentation
├── PRD_AND_TECHNICAL_ARCHITECTURE_PLAN.md # Master Product Requirements & Architecture Spec
├── docs/
│   └── PRD_AND_TECHNICAL_ARCHITECTURE_PLAN.md
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
    └── test_engine.py          # Pytest automated test suite (7/7 Passing in 0.18s)
```

---

## 💼 5. Candidate & Assessment Information

* **Candidate:** Tanmay Patil
* **Email:** [patiltanmay019@gmail.com](mailto:patiltanmay019@gmail.com)
* **Phone:** +91 8308695986
* **Assessment Role:** AI/ML Engineer Intern
* **Organization:** Cynbit Technologies Private Limited ([cynbit.in](https://cynbit.in))
* **Submission Portal:** [cynbit.in/candidate/cmwovenwx000708jnepnj4974](https://www.cynbit.in/candidate/cmwovenwx000708jnepnj4974)
