"""
Cynbit AutoScope AI — Data Contracts & Schemas
Enforces strict Pydantic v2 validation for 0% hallucination architecture generation.
Supports technical blueprints, sprint roadmaps, and commercial Statements of Work (SOW).
"""

from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class ClientInput(BaseModel):
    project_name: str = Field(..., description="Name of the client's project or product concept")
    client_industry: str = Field(..., description="Industry vertical (Healthcare, FinTech, E-Commerce, SaaS, EdTech, Logistics)")
    vision_description: str = Field(..., description="Detailed description of the client's business vision and requirements")
    voice_transcript: Optional[str] = Field(default=None, description="Spoken client voice note transcribed via AssemblyAI")
    target_audience: str = Field(default="B2B / B2C", description="Primary user persona")
    concurrency_tier: str = Field(default="Medium (1k - 10k DAU)", description="Expected concurrent user scale")
    compliance_tags: List[str] = Field(default_factory=list, description="Compliance requirements (e.g., HIPAA, GDPR, SOC2, PCI-DSS)")
    preferred_cloud: str = Field(default="AWS", description="Preferred cloud infrastructure (AWS, GCP, Azure, Hybrid)")
    budget_tier: str = Field(default="Growth ($10k - $25k)", description="Client estimated budget range")
    target_timeline_weeks: int = Field(default=8, ge=2, le=52, description="Target delivery timeline in weeks")


class TechStackItem(BaseModel):
    category: str = Field(..., description="Stack category (Frontend, Backend, Database, AI/ML, Cache/Queue, Cloud/DevOps)")
    technology_name: str = Field(..., description="Name of framework or tool (e.g., React, FastAPI, PostgreSQL, Qdrant)")
    rationale: str = Field(..., description="Technical justification for this choice")


class ArchitectureLayer(BaseModel):
    layer_name: str = Field(..., description="Name of layer (Client Tier, API Gateway, Application Core, Data Store, AI Pipeline)")
    components: List[str] = Field(..., description="List of services or modules in this layer")
    description: str = Field(..., description="Brief architectural summary of this layer")


class SprintMilestone(BaseModel):
    sprint_number: int = Field(..., ge=1)
    sprint_name: str = Field(..., description="Name of the sprint milestone")
    duration_weeks: int = Field(default=2, ge=1)
    deliverables: List[str] = Field(..., description="List of concrete engineering outputs")
    core_focus: str = Field(..., description="Key technical milestone achieved")


class CostBreakdown(BaseModel):
    total_engineering_hours: int = Field(..., ge=1, description="Total developer hours")
    blended_hourly_rate_usd: int = Field(default=45, description="Blended hourly billing rate in USD")
    total_development_cost_usd: int = Field(..., description="Total development estimate")
    estimated_cloud_monthly_usd: int = Field(..., description="Estimated cloud infra burn per month")
    cloud_cost_items: Dict[str, int] = Field(default_factory=dict, description="Breakdown of cloud services")


class CommercialTerms(BaseModel):
    deposit_percentage: int = Field(default=30, description="Upfront deposit percentage (e.g. 30%)")
    milestone_percentage: int = Field(default=40, description="Midway milestone payment percentage (e.g. 40%)")
    final_percentage: int = Field(default=30, description="Final sign-off payment percentage (e.g. 30%)")
    warranty_days: int = Field(default=60, description="Post-launch bug fix warranty duration in days")
    intellectual_property_clause: str = Field(
        default="100% intellectual property (IP), source code, and design assets transfer to the client upon final payment receipt.",
        description="IP ownership terms"
    )
    change_order_policy: str = Field(
        default="Scope expansions exceeding sprint parameters billed at $45/hour via written Change Order addendum.",
        description="Change order policy"
    )


class ArchitectureProposal(BaseModel):
    project_name: str = Field(...)
    client_industry: str = Field(...)
    executive_summary: str = Field(..., description="High-level solution overview for executive stakeholders")
    key_architectural_decisions: List[str] = Field(..., description="Crucial engineering choices made")
    architecture_layers: List[ArchitectureLayer] = Field(...)
    tech_stack: List[TechStackItem] = Field(...)
    mermaid_diagram: str = Field(..., description="High-contrast Mermaid flowchart string")
    sprint_plan: List[SprintMilestone] = Field(...)
    cost_breakdown: CostBreakdown = Field(...)
    commercial_terms: CommercialTerms = Field(default_factory=CommercialTerms)
    compliance_and_security: List[str] = Field(default_factory=list)
    key_risks_and_mitigations: List[str] = Field(default_factory=list)
    generation_mode: str = Field(default="LLM-Synthesized", description="Inference mode: OpenRouter, Groq, Gemini, or Offline-Heuristic")
    generated_at: str = Field(..., description="ISO timestamp")
