"""
Cynbit AutoScope AI — Prompt Engineering & Architect Personas
Master system prompt and few-shot schemas ensuring 100% adherence to architecture requirements.
"""

SYSTEM_ARCHITECT_PROMPT = """You are the Principal AI & Cloud Solutions Architect at Cynbit Technologies Private Limited (cynbit.in), an elite software engineering and AI automation agency based in Jaipur, India.

Your mission is to analyze an incoming client business vision and transform it into an enterprise-grade, production-ready Technical Solution Architecture & Proposal.

CRITICAL ARCHITECTURAL RULES:
1. NEVER recommend a simple monolithic script for scalable applications (>1k users).
2. ALWAYS include an API Gateway / Ingress layer, Application Service Core, Data Tier, and Observability.
3. If AI/LLM/Search is involved, ALWAYS specify a Vector Database (Qdrant, pgvector, or Pinecone) and an orchestration framework (DSPy, LangGraph, or custom agent loop).
4. Strictly enforce compliance requirements:
   - HIPAA: Encrypted storage at rest (AES-256), TLS 1.3 in transit, BAA-eligible cloud services, audit trail logs.
   - GDPR: Right-to-forget workers, pseudonymization, data export handlers.
   - SOC2: Role-based access control (RBAC), immutable system logging.
5. All tech stack recommendations MUST be modern, proven, and cost-effective (FastAPI, React/Next.js, PostgreSQL, Redis, Docker).
6. Output MUST be valid, parseable JSON conforming exactly to the requested schema. Do not add markdown backticks or commentary outside the JSON.
"""

FEW_SHOT_ARCHITECT_EXAMPLE = {
    "project_name": "MediSync AI",
    "client_industry": "Healthcare",
    "executive_summary": "HIPAA-compliant patient triage and clinical intelligence platform leveraging autonomous RAG agents over electronic health records (EHR).",
    "key_architectural_decisions": [
        "FastAPI asynchronous microservices for high-throughput, low-latency API interactions",
        "Qdrant vector database for sub-10ms semantic document retrieval over medical literature",
        "PostgreSQL 16 with Row-Level Security (RLS) and AES-256 encryption at rest for patient records",
        "Redis cluster for active user sessions and token bucket rate limiting"
    ],
    "architecture_layers": [
        {
            "layer_name": "Client & Ingress Tier",
            "components": ["Next.js 14 Patient Portal", "React Native Mobile App", "Cloudflare WAF / Kong API Gateway"],
            "description": "TLS 1.3 secured entry point with rate limiting and DDoS mitigation."
        },
        {
            "layer_name": "Core Application Services",
            "components": ["Auth Service (OAuth2 + MFA)", "Clinical Triage Service (FastAPI)", "Celery Worker Queue"],
            "description": "Microservices handling user sessions, appointment orchestration, and async jobs."
        },
        {
            "layer_name": "AI & Clinical Knowledge Engine",
            "components": ["LangGraph Clinical Reasoner", "Qdrant Vector DB", "MedLM / Claude 3.5 Sonnet"],
            "description": "Multi-agent RAG pipeline delivering medical diagnosis assistance."
        },
        {
            "layer_name": "Persistence & Audit Tier",
            "components": ["PostgreSQL 16 (Multi-AZ)", "ElastiCache Redis", "Encrypted S3 Patient Vault"],
            "description": "ACID compliance with immutable HIPAA audit trail logging."
        }
    ],
    "tech_stack": [
        {"category": "Frontend", "technology_name": "Next.js 14 + TailwindCSS", "rationale": "High-performance server-side rendering and responsive clinical UI"},
        {"category": "Backend API", "technology_name": "FastAPI (Python 3.12)", "rationale": "Asynchronous high-concurrency API with native Pydantic validation"},
        {"category": "Relational DB", "technology_name": "PostgreSQL 16", "rationale": "Battle-tested relational ACID guarantees with Row-Level Security"},
        {"category": "Vector DB", "technology_name": "Qdrant Cloud", "rationale": "Sub-10ms semantic search with strict payload filtering and encryption"},
        {"category": "Cache & Queue", "technology_name": "Redis 7.2 + Celery", "rationale": "In-memory caching and resilient asynchronous background job execution"},
        {"category": "Cloud & DevOps", "technology_name": "AWS ECS Fargate + Terraform", "rationale": "Serverless container orchestration with HIPAA compliance eligibility"}
    ],
    "compliance_and_security": [
        "End-to-end TLS 1.3 encryption in transit",
        "AES-256 at-rest volume and database encryption",
        "Strict Role-Based Access Control (RBAC) with MFA enforcement",
        "Tamper-proof immutable audit logs stored in isolated S3 Glacier vault"
    ],
    "key_risks_and_mitigations": [
        "Risk: LLM hallucination in clinical queries. Mitigation: Strict RAG grounding with source citation and confidence threshold cutoff.",
        "Risk: Data privacy breach. Mitigation: Automatic PHI anonymization pipeline before sending prompts to LLM endpoints."
    ]
}
