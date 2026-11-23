"""
Cynbit AutoScope AI — Multi-Provider Architecture Reasoning Engine
Supports Groq (Llama-3.3-70B), OpenAI (GPT-4o), Google Gemini, and a robust
Deterministic Offline Heuristic Engine ensuring 100% operational reliability.
"""

import os
import json
import datetime
from typing import Optional, Dict, Any, List

from .schemas import (
    ClientInput,
    ArchitectureProposal,
    ArchitectureLayer,
    TechStackItem,
    CostBreakdown,
    SprintMilestone,
)
from .diagram_generator import build_mermaid_flowchart
from .cost_estimator import calculate_engineering_metrics
from prompts.system_prompt import SYSTEM_ARCHITECT_PROMPT


def get_heuristic_architecture(client_input: ClientInput) -> Dict[str, Any]:
    """
    High-fidelity deterministic architecture synthesizer for offline execution.
    Tailored to domain, scale, and compliance constraints.
    """
    industry = client_input.client_industry.lower()
    has_hipaa = any("hipaa" in t.lower() for t in client_input.compliance_tags)
    has_gdpr = any("gdpr" in t.lower() for t in client_input.compliance_tags)
    cloud = client_input.preferred_cloud or "AWS"

    # Domain specific templates
    if "health" in industry or "med" in industry or has_hipaa:
        domain = "Healthcare"
        exec_summary = (
            f"HIPAA-compliant, highly secure medical intelligence platform for {client_input.project_name}. "
            "Engineered with end-to-end encryption, strict access isolation, and asynchronous clinical triage."
        )
        decisions = [
            "FastAPI microservices running in isolated Docker containers with automated mTLS inter-service communication",
            "Multi-tenant PostgreSQL 16 with Row-Level Security (RLS) and AES-256 encrypted tablespaces",
            "Qdrant vector database for semantic search across clinical documentation and patient histories",
            "Redis 7.2 cluster for sub-10ms session cache and token-bucket API rate limiting",
            "Isolated BAA-compliant cloud storage with automated disaster recovery and point-in-time snapshots"
        ]
        stack = [
            TechStackItem(category="Frontend", technology_name="Next.js 14 + TailwindCSS", rationale="Server-rendered clinical web interface with high accessibility"),
            TechStackItem(category="Mobile", technology_name="Flutter / React Native", rationale="Cross-platform iOS/Android app for patient and doctor portals"),
            TechStackItem(category="Backend API", technology_name="FastAPI (Python 3.12)", rationale="Asynchronous high-throughput REST API with native Pydantic validation"),
            TechStackItem(category="Primary DB", technology_name="PostgreSQL 16 (Multi-AZ)", rationale="ACID relational database with Row-Level Security for patient records"),
            TechStackItem(category="Vector DB", technology_name="Qdrant Cloud", rationale="Sub-10ms semantic retrieval over medical literature and logs"),
            TechStackItem(category="Cache & Queue", technology_name="Redis 7.2 + Celery", rationale="In-memory session store and asynchronous background task processor"),
            TechStackItem(category="Cloud & Infra", technology_name=f"{cloud} ECS Fargate", rationale=f"Serverless container orchestration compliant with BAA standards on {cloud}"),
        ]
    elif "fin" in industry or "bank" in industry or "pay" in industry:
        domain = "FinTech"
        exec_summary = (
            f"High-frequency, PCI-DSS compliant financial engine for {client_input.project_name}. "
            "Features immutable double-entry ledger bookkeeping, real-time fraud scoring, and fault-tolerant transaction processing."
        )
        decisions = [
            "Event-driven architecture using Kafka/RabbitMQ for distributed ledger consistency and audit trails",
            "Strict double-entry accounting schema with idempotent payment webhooks",
            "PostgreSQL 16 with write-ahead logging (WAL) archiving for zero data loss",
            "Redis in-memory store for real-time anomaly detection and fraud velocity checks"
        ]
        stack = [
            TechStackItem(category="Frontend", technology_name="React 18 + TypeScript", rationale="Type-safe financial dashboard with real-time WebSocket feeds"),
            TechStackItem(category="Backend API", technology_name="Go / FastAPI", rationale="Ultra-low latency microservices handling payment and ledger transactions"),
            TechStackItem(category="Primary DB", technology_name="PostgreSQL 16 (ACID)", rationale="Strict transactional guarantees with point-in-time recovery"),
            TechStackItem(category="Message Broker", technology_name="Apache Kafka / RabbitMQ", rationale="High-throughput event stream ensuring idempotent payment processing"),
            TechStackItem(category="Cache Tier", technology_name="Redis 7.2 Cluster", rationale="Sub-5ms rate limiting and active fraud rule caching"),
            TechStackItem(category="Cloud & Infra", technology_name=f"{cloud} EKS / Kubernetes", rationale=f"Auto-scaling container pods with PCI-DSS network segmentation on {cloud}"),
        ]
    elif "commerce" in industry or "retail" in industry:
        domain = "E-Commerce"
        exec_summary = (
            f"Scalable omnichannel e-commerce and inventory engine for {client_input.project_name}. "
            "Designed for sub-100ms catalog search, dynamic promotions, and automated order fulfillment."
        )
        decisions = [
            "Headless commerce architecture decoupling Next.js storefront from core catalog services",
            "Redis multi-layer caching achieving sub-30ms product catalog page loads",
            "Elasticsearch / Qdrant semantic product search with personalized recommendations",
            "Async worker queue managing payment gateways, automated invoicing, and shipping webhooks"
        ]
        stack = [
            TechStackItem(category="Storefront", technology_name="Next.js 14 Storefront", rationale="Edge-rendered e-commerce pages with sub-second Core Web Vitals"),
            TechStackItem(category="Backend API", technology_name="FastAPI + Node.js Gateway", rationale="High-concurrency cart and checkout microservices"),
            TechStackItem(category="Primary DB", technology_name="PostgreSQL 16", rationale="Relational integrity for orders, inventory locks, and customers"),
            TechStackItem(category="Search & AI", technology_name="Qdrant / Algolia", rationale="Vector search delivering personalized product discovery"),
            TechStackItem(category="Cache & Session", technology_name="Redis 7.2", rationale="Distributed cart session store and inventory reservation locks"),
            TechStackItem(category="Cloud & Infra", technology_name=f"{cloud} Cloud Run / ECS", rationale=f"Auto-scaling compute handling sudden flash-sale traffic spikes on {cloud}"),
        ]
    else:
        domain = "Enterprise SaaS & AI"
        exec_summary = (
            f"Enterprise AI platform architecture for {client_input.project_name}. "
            "Combines modern microservices, RAG vector intelligence, multi-tenant RBAC, and automated CI/CD deployment."
        )
        decisions = [
            "Microservices architecture with FastAPI backend and Next.js frontend",
            "Multi-tenant data isolation with PostgreSQL schemas and Redis session management",
            "Qdrant vector database paired with Groq/OpenAI for low-latency agentic workflows",
            "Containerized deployment on Docker with automated GitHub Actions CI/CD pipelines"
        ]
        stack = [
            TechStackItem(category="Frontend", technology_name="Next.js 14 + TailwindCSS", rationale="Clean, responsive enterprise SaaS UI with server-side rendering"),
            TechStackItem(category="Backend API", technology_name="FastAPI (Python 3.12)", rationale="Asynchronous REST & WebSocket backend for real-time interactions"),
            TechStackItem(category="Primary DB", technology_name="PostgreSQL 16", rationale="Reliable relational storage for tenant accounts and business metadata"),
            TechStackItem(category="Vector DB", technology_name="Qdrant Cloud", rationale="Fast vector embeddings storage for document Q&A and semantic agents"),
            TechStackItem(category="Cache & Queue", technology_name="Redis 7.2 + Celery", rationale="In-memory cache and background task queue for heavy processing"),
            TechStackItem(category="Cloud & Infra", technology_name=f"{cloud} Managed Containers", rationale=f"Zero-friction automated deployment and monitoring on {cloud}"),
        ]

    layers = [
        ArchitectureLayer(
            layer_name="1. Ingress & Client Tier",
            components=["Web Store / Client Portal", "Mobile Client", "Cloudflare WAF / API Gateway"],
            description="Secure ingress routing, SSL termination, and rate-limiting enforcement."
        ),
        ArchitectureLayer(
            layer_name="2. Application & API Core",
            components=["Authentication Service", "Core Business Microservices (FastAPI)", "Worker Queue (Celery)"],
            description="Stateless business logic handling user requests and asynchronous jobs."
        ),
        ArchitectureLayer(
            layer_name="3. AI & Vector Intelligence",
            components=["Vector DB (Qdrant)", "RAG Embedding Pipeline", "LLM Orchestration Agent"],
            description="Semantic search, contextual retrieval, and generative AI features."
        ),
        ArchitectureLayer(
            layer_name="4. Persistence & Cache Tier",
            components=["PostgreSQL 16 (ACID)", "Redis 7.2 Cluster", "S3 Encrypted Object Store"],
            description="Persistent relational storage, fast in-memory caching, and document vaults."
        ),
        ArchitectureLayer(
            layer_name=f"5. Cloud Infrastructure ({cloud})",
            components=["Docker Container Cluster", "Prometheus & Grafana Monitoring", "GitHub Actions CI/CD"],
            description=f"Automated build, test, and containerized deployment infrastructure on {cloud}."
        )
    ]

    compliance_notes = [
        "End-to-end TLS 1.3 encryption across all client and internal service communication",
        "Role-Based Access Control (RBAC) with fine-grained permission enforcement",
        "Encrypted database storage at rest using AES-256",
        "Regular automated database snapshots and disaster recovery procedures"
    ]
    if has_hipaa:
        compliance_notes.append("Business Associate Agreement (BAA) with cloud providers and PHI de-identification")
    if has_gdpr:
        compliance_notes.append("Automated right-to-forget data deletion endpoints and consent tracking")

    risks = [
        "Scope expansion during UI phase. Mitigation: Strict sprint deliverables and weekly milestone reviews.",
        "Third-party API rate limits. Mitigation: Circuit breaker patterns and intelligent exponential backoff caching.",
        "Database scale under peak traffic. Mitigation: Read-replica pool and aggressive Redis caching tier."
    ]

    return {
        "domain": domain,
        "executive_summary": exec_summary,
        "key_architectural_decisions": decisions,
        "architecture_layers": layers,
        "tech_stack": stack,
        "compliance_and_security": compliance_notes,
        "key_risks_and_mitigations": risks
    }


def synthesize_architecture_with_llm(client_input: ClientInput) -> Optional[Dict[str, Any]]:
    """
    Attempts to call Groq, OpenAI, or Gemini to synthesize the architecture proposal.
    Returns None if no API key is available or if inference fails.
    """
    groq_key = os.getenv("GROQ_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    user_prompt = f"""
Analyze this client project and generate a technical architecture:
Project Name: {client_input.project_name}
Industry: {client_input.client_industry}
Vision & Requirements: {client_input.vision_description}
Target Audience: {client_input.target_audience}
Scale / Concurrency: {client_input.concurrency_tier}
Compliance: {', '.join(client_input.compliance_tags) if client_input.compliance_tags else 'None specified'}
Preferred Cloud: {client_input.preferred_cloud}
Target Timeline: {client_input.target_timeline_weeks} weeks

Respond with a valid JSON object with the following keys:
- executive_summary (string)
- key_architectural_decisions (list of strings)
- architecture_layers (list of objects with layer_name, components, description)
- tech_stack (list of objects with category, technology_name, rationale)
- compliance_and_security (list of strings)
- key_risks_and_mitigations (list of strings)
"""

    # 1. Try Groq (Llama-3.3-70b-versatile - sub-second latency)
    if groq_key:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_ARCHITECT_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=2500,
            )
            data = json.loads(completion.choices[0].message.content)
            data["_provider"] = "Groq (Llama-3.3-70B)"
            return data
        except Exception:
            pass

    # 2. Try OpenAI
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_ARCHITECT_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            data = json.loads(completion.choices[0].message.content)
            data["_provider"] = "OpenAI (GPT-4o-mini)"
            return data
        except Exception:
            pass

    # 3. Try Gemini
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                f"{SYSTEM_ARCHITECT_PROMPT}\n\n{user_prompt}\nReturn strict JSON."
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            data = json.loads(text.strip())
            data["_provider"] = "Google Gemini 1.5 Flash"
            return data
        except Exception:
            pass

    return None


def generate_full_proposal(client_input: ClientInput) -> ArchitectureProposal:
    """
    Master pipeline:
    1. Attempts LLM synthesis (Groq / OpenAI / Gemini).
    2. Falls back to Deterministic Heuristic Engine if offline or no API key.
    3. Calculates engineering costs and sprint milestones.
    4. Generates high-contrast Mermaid diagram.
    5. Validates with Pydantic for 100% type safety.
    """
    cost_breakdown, sprint_plan = calculate_engineering_metrics(client_input)
    mermaid_diagram = build_mermaid_flowchart(client_input)

    llm_output = synthesize_architecture_with_llm(client_input)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if llm_output:
        provider = llm_output.get("_provider", "LLM-Synthesized")
        
        # Parse layers safely
        layers = []
        for l in llm_output.get("architecture_layers", []):
            layers.append(ArchitectureLayer(
                layer_name=l.get("layer_name", "Service Layer"),
                components=l.get("components", ["Core Microservice"]),
                description=l.get("description", "Architectural component tier")
            ))
        
        # Parse stack safely
        stack = []
        for s in llm_output.get("tech_stack", []):
            stack.append(TechStackItem(
                category=s.get("category", "Component"),
                technology_name=s.get("technology_name", "Standard Tool"),
                rationale=s.get("rationale", "Industry best practice")
            ))

        return ArchitectureProposal(
            project_name=client_input.project_name,
            client_industry=client_input.client_industry,
            executive_summary=llm_output.get("executive_summary", "Architecture blueprint generated by Cynbit AutoScope AI."),
            key_architectural_decisions=llm_output.get("key_architectural_decisions", ["Microservice modularity", "Containerization"]),
            architecture_layers=layers if layers else [ArchitectureLayer(layer_name="Core Tier", components=["FastAPI", "Postgres"], description="Foundational services")],
            tech_stack=stack if stack else [TechStackItem(category="API", technology_name="FastAPI", rationale="Performance")],
            mermaid_diagram=mermaid_diagram,
            sprint_plan=sprint_plan,
            cost_breakdown=cost_breakdown,
            compliance_and_security=llm_output.get("compliance_and_security", ["TLS 1.3", "AES-256"]),
            key_risks_and_mitigations=llm_output.get("key_risks_and_mitigations", ["Scope creep mitigation through agile sprints"]),
            generation_mode=provider,
            generated_at=timestamp,
        )
    else:
        # High-Fidelity Heuristic Engine
        h_data = get_heuristic_architecture(client_input)
        return ArchitectureProposal(
            project_name=client_input.project_name,
            client_industry=client_input.client_industry,
            executive_summary=h_data["executive_summary"],
            key_architectural_decisions=h_data["key_architectural_decisions"],
            architecture_layers=h_data["architecture_layers"],
            tech_stack=h_data["tech_stack"],
            mermaid_diagram=mermaid_diagram,
            sprint_plan=sprint_plan,
            cost_breakdown=cost_breakdown,
            compliance_and_security=h_data["compliance_and_security"],
            key_risks_and_mitigations=h_data["key_risks_and_mitigations"],
            generation_mode="Deterministic Expert Engine (Offline / Zero-API Ready)",
            generated_at=timestamp,
        )
