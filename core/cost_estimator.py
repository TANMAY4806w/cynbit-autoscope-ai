"""
Cynbit AutoScope AI — Sprint & Cost Estimation Engine
Calculates realistic engineering hours, milestone sprints, and cloud infra burn
based on technical complexity, concurrency demands, and compliance requirements.
"""

from typing import List, Dict, Tuple
from .schemas import ClientInput, CostBreakdown, SprintMilestone


def calculate_engineering_metrics(client_input: ClientInput) -> Tuple[CostBreakdown, List[SprintMilestone]]:
    """
    Computes precise engineering hours, sprint deliverables, and cloud cost model.
    """
    scale = client_input.concurrency_tier.lower()
    
    # 1. Base Hours by scale
    if "enterprise" in scale or "100k" in scale:
        base_hours = 640
        cloud_base = 550
    elif "high" in scale or "50k" in scale:
        base_hours = 480
        cloud_base = 350
    elif "medium" in scale or "10k" in scale:
        base_hours = 360
        cloud_base = 220
    else:
        base_hours = 260
        cloud_base = 120

    # 2. Compliance hours & cloud add-on
    compliance_hours = 0
    compliance_cloud = 0
    for tag in client_input.compliance_tags:
        t = tag.lower()
        if "hipaa" in t:
            compliance_hours += 50
            compliance_cloud += 80
        elif "gdpr" in t:
            compliance_hours += 35
            compliance_cloud += 40
        elif "soc2" in t:
            compliance_hours += 45
            compliance_cloud += 60
        elif "pci" in t:
            compliance_hours += 50
            compliance_cloud += 90

    total_hours = base_hours + compliance_hours
    hourly_rate = 45  # Standard blended agency rate for offshore/hybrid delivery ($45/hr)
    total_cost = total_hours * hourly_rate

    # 3. Monthly Cloud Infrastructure Breakdown
    cloud_items: Dict[str, int] = {
        f"Compute Cluster ({client_input.preferred_cloud})": int(cloud_base * 0.40),
        "Managed PostgreSQL DB (Multi-AZ)": int(cloud_base * 0.25),
        "Redis Cache Tier": int(cloud_base * 0.10),
        "Vector DB / Semantic Search": int(cloud_base * 0.15),
        "LLM Token Inference Budget": 60,
        "Storage & Network Egress": int(cloud_base * 0.10),
    }
    if compliance_cloud > 0:
        cloud_items["Security & Audit Logging Compliance Tier"] = compliance_cloud

    monthly_cloud = sum(cloud_items.values())

    cost_breakdown = CostBreakdown(
        total_engineering_hours=total_hours,
        blended_hourly_rate_usd=hourly_rate,
        total_development_cost_usd=total_cost,
        estimated_cloud_monthly_usd=monthly_cloud,
        cloud_cost_items=cloud_items,
    )

    # 4. Generate Structured Sprint Milestones (Default 4 to 6 sprints)
    weeks = client_input.target_timeline_weeks
    num_sprints = max(3, min(6, weeks // 2))
    sprint_duration = max(1, weeks // num_sprints)

    sprints: List[SprintMilestone] = [
        SprintMilestone(
            sprint_number=1,
            sprint_name="Foundation, Data Modeling & Ingress",
            duration_weeks=sprint_duration,
            deliverables=[
                "Git repository architecture & Docker container baseline",
                "PostgreSQL schema migration & ACID entity definitions",
                "OAuth2/JWT authentication service & RBAC policies",
                "API Gateway & reverse proxy routing setup",
            ],
            core_focus="System backbone, security posture, and database schema"
        ),
        SprintMilestone(
            sprint_number=2,
            sprint_name="Core Business Logic & API Microservices",
            duration_weeks=sprint_duration,
            deliverables=[
                "High-performance FastAPI CRUD microservices",
                "Redis caching integration for sub-50ms read latency",
                "Async task processing with Celery & message broker",
                "Automated Pytest coverage suite (>80% unit pass)",
            ],
            core_focus="Core functional domain workflows and service boundaries"
        ),
        SprintMilestone(
            sprint_number=3,
            sprint_name="AI Pipeline, RAG & Vector Intelligence",
            duration_weeks=sprint_duration,
            deliverables=[
                "Vector database setup (Qdrant/pgvector) with indexing",
                "Chunking, embedding generation & semantic retriever",
                "LLM reasoning agent orchestration with fallback loops",
                "Prompt guardrails and structured JSON output validation",
            ],
            core_focus="Autonomous AI capabilities, retrieval, and model inference"
        ),
        SprintMilestone(
            sprint_number=4,
            sprint_name="Frontend UI & Client Interaction",
            duration_weeks=sprint_duration,
            deliverables=[
                "Modern responsive Web Application (Next.js / React)",
                "State management & live API client integration",
                "Mobile-optimized adaptive layout and accessibility",
                "End-to-end integration and smoke test runs",
            ],
            core_focus="User interface, interactive forms, and client journey"
        ),
    ]

    if num_sprints >= 5:
        sprints.append(
            SprintMilestone(
                sprint_number=5,
                sprint_name="Compliance Hardening & Load Testing",
                duration_weeks=sprint_duration,
                deliverables=[
                    "Compliance validation (Audit logs, encryption at rest)",
                    "Locust stress testing up to targeted concurrency",
                    "Disaster recovery and automated backup snapshot schedule",
                    "Penetration testing and vulnerability scanning",
                ],
                core_focus="Production hardening, compliance verification, and scale testing"
            )
        )

    if num_sprints >= 6:
        sprints.append(
            SprintMilestone(
                sprint_number=6,
                sprint_name="Production Deployment & Founder Handoff",
                duration_weeks=sprint_duration,
                deliverables=[
                    f"Production rollout on {client_input.preferred_cloud} with CI/CD",
                    "Prometheus & Grafana alerting dashboards",
                    "OpenAPI/Swagger live documentation handoff",
                    "Client stakeholder sign-off and warranty kick-off",
                ],
                core_focus="Zero-downtime deployment, monitoring, and final delivery"
            )
        )

    return cost_breakdown, sprints
