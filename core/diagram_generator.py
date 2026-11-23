"""
Cynbit AutoScope AI — High-Contrast Mermaid Diagram Generator
Generates clean, high-contrast Mermaid flowcharts compatible with both dark and light UI themes.
Follows zero-fill styling to prevent white-on-white text clipping in IDEs.
"""

from typing import List
from .schemas import ClientInput, ArchitectureLayer


def sanitize_label(text: str) -> str:
    """Sanitizes text for safe inclusion inside Mermaid node brackets."""
    clean = text.replace('"', '').replace("'", "").replace("[", "(").replace("]", ")")
    return clean.strip()


def build_mermaid_flowchart(
    client_input: ClientInput,
    layers: List[ArchitectureLayer] = None
) -> str:
    """
    Builds a clean, high-contrast Mermaid flowchart (flowchart TD)
    strictly avoiding light background fills (fill:#...) to ensure readability
    across dark and light IDE/browser themes.
    """
    industry = client_input.client_industry.lower()
    has_hipaa = any("hipaa" in tag.lower() for tag in client_input.compliance_tags)
    has_gdpr = any("gdpr" in tag.lower() for tag in client_input.compliance_tags)
    cloud = client_input.preferred_cloud or "AWS"

    # Default architectural topology
    lines = [
        "flowchart TD",
        '    subgraph Ingress ["1. Client & Ingress Tier"]',
        '        WebClient["Web Client (Next.js / React)"]',
        '        MobileClient["Mobile App (React Native / Flutter)"]',
        '        APIGateway["API Gateway & Reverse Proxy (Kong / Traefik)"]',
        "        WebClient --> APIGateway",
        "        MobileClient --> APIGateway",
        "    end",
        "",
        '    subgraph CoreServices ["2. Application & Compute Tier"]',
        '        AuthService["Auth & IAM Service (OAuth2 / JWT)"]',
        '        BusinessAPI["Core Application API (FastAPI / Python)"]',
        '        WorkerQueue["Task Worker & Async Queue (Celery / Redis)"]',
        "        APIGateway --> AuthService",
        "        APIGateway --> BusinessAPI",
        "        BusinessAPI --> WorkerQueue",
        "    end",
        "",
        '    subgraph AIService ["3. AI & Vector Engine"]',
        '        LLMOrchestrator["Orchestrator (LangGraph / DSPy)"]',
        '        VectorDB["Vector Database (Qdrant / pgvector)"]',
        '        ModelInference["LLM Inference (Groq / Gemini / Claude)"]',
        "        BusinessAPI --> LLMOrchestrator",
        "        LLMOrchestrator --> VectorDB",
        "        LLMOrchestrator --> ModelInference",
        "    end",
        "",
        '    subgraph Persistence ["4. Storage & Persistence Tier"]',
        '        PrimaryDB[("Primary DB (PostgreSQL 16)")]',
        '        CacheTier[("Cache Layer (Redis 7.2)")]',
        '        BlobStorage[("Object Storage (S3 / Cloud Storage)")]',
        "        BusinessAPI --> PrimaryDB",
        "        BusinessAPI --> CacheTier",
        "        WorkerQueue --> BlobStorage",
        "    end",
        "",
        f'    subgraph Infra ["5. Cloud & Security Tier ({cloud})"]',
        '        WAF["Web Application Firewall & TLS 1.3"]',
        '        Observability["Monitoring (Prometheus & Grafana)"]',
        '        CICD["CI/CD Pipeline (GitHub Actions & Docker)"]',
        "    end",
        "",
        "    APIGateway -.-> WAF",
        "    BusinessAPI -.-> Observability",
    ]

    # Compliance specific annotations
    if has_hipaa:
        lines.append('    PrimaryDB -.-> HIPAA["HIPAA Compliant At-Rest AES-256 Encryption"]')
    if has_gdpr:
        lines.append('    PrimaryDB -.-> GDPR["GDPR Data Purge & Right-To-Forget Worker"]')

    return "\n".join(lines)


def build_ascii_system_diagram(client_input: ClientInput) -> str:
    """Generates a scannable ASCII diagram for terminal and plain text fallback."""
    cloud = client_input.preferred_cloud or "AWS"
    diagram = f"""
+---------------------------------------------------------------+
|                   CYNBIT AUTOSCOPE ARCHITECTURE               |
|                   Project: {client_input.project_name:<30}     |
+---------------------------------------------------------------+
    |
    v
[ Client Interfaces: Web (React/Next.js) + Mobile (Flutter) ]
    |
    v (HTTPS / TLS 1.3)
[ Cloudflare CDN & WAF / API Gateway ]
    |
    +------> [ Authentication & RBAC Service (OAuth2 / JWT) ]
    |
    +------> [ Core Microservices Engine (FastAPI / Python) ]
                |
                +------> [ Redis Cache Tier (Session / Rate Limit) ]
                |
                +------> [ PostgreSQL (ACID Relational Storage) ]
                |
                +------> [ AI Agent & RAG Pipeline (Qdrant Vector DB) ]
                |           |
                |           +---> [ LLM Reasoning: Groq / Gemini / Claude ]
                |
                +------> [ Async Task Workers (Celery / RabbitMQ) ]
                            |
                            +---> [ Object Storage (S3 Bucket / Encrypted) ]
    |
    v
[ Cloud Infrastructure: {cloud} Managed Containers + CI/CD Automations ]
+---------------------------------------------------------------+
"""
    return diagram
