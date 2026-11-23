"""
Unit and Integration Tests for Cynbit AutoScope AI Engine & FastAPI Server
Run with: pytest tests/ -v
"""

import sys
import os

# Ensure package root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from server import app
from core.schemas import ClientInput, ArchitectureProposal, CommercialTerms
from core.architect_engine import generate_full_proposal, get_heuristic_architecture
from core.diagram_generator import build_mermaid_flowchart
from core.cost_estimator import calculate_engineering_metrics
from core.exporter import export_proposal_markdown
from core.audio_transcriber import transcribe_client_audio

client = TestClient(app)


def test_client_input_validation():
    """Verifies that ClientInput validates correctly with required and default fields."""
    client_in = ClientInput(
        project_name="DocAI",
        client_industry="Healthcare",
        vision_description="AI-driven clinical document summarization and question answering.",
        concurrency_tier="Medium (1k - 10k DAU)",
        compliance_tags=["HIPAA", "GDPR"],
        preferred_cloud="AWS",
        target_timeline_weeks=8
    )
    assert client_in.project_name == "DocAI"
    assert client_in.client_industry == "Healthcare"
    assert "HIPAA" in client_in.compliance_tags
    assert client_in.target_timeline_weeks == 8


def test_heuristic_offline_engine():
    """Verifies that the offline deterministic engine generates valid structured architecture."""
    client_in = ClientInput(
        project_name="FinLedger",
        client_industry="FinTech",
        vision_description="Real-time payment ledger with fraud anomaly detection.",
        compliance_tags=["PCI-DSS"],
        preferred_cloud="AWS",
    )
    h_data = get_heuristic_architecture(client_in)
    assert h_data["domain"] == "FinTech"
    assert len(h_data["key_architectural_decisions"]) > 0
    assert len(h_data["architecture_layers"]) >= 4
    assert len(h_data["tech_stack"]) >= 4


def test_mermaid_high_contrast_rules():
    """Verifies that generated Mermaid diagrams strictly obey the zero-fill high contrast rule."""
    client_in = ClientInput(
        project_name="HealthSync",
        client_industry="Healthcare",
        vision_description="Telehealth app with video triage",
        compliance_tags=["HIPAA"],
        preferred_cloud="AWS"
    )
    mermaid = build_mermaid_flowchart(client_in)
    assert mermaid.startswith("flowchart TD")
    # Verify strict high-contrast rule: no fill:#... styling that causes white-on-white text issues in dark mode
    assert "fill:#" not in mermaid
    assert "HIPAA" in mermaid


def test_cost_and_sprint_math():
    """Verifies engineering cost calculations and sprint milestones."""
    client_in = ClientInput(
        project_name="SaaSKit",
        client_industry="SaaS",
        vision_description="Multi-tenant marketing platform",
        concurrency_tier="Medium (1k - 10k DAU)",
        compliance_tags=["SOC2"],
        target_timeline_weeks=10
    )
    cost_breakdown, sprints = calculate_engineering_metrics(client_in)
    
    # Check total cost equals hours * hourly rate (INR)
    assert cost_breakdown.total_development_cost_inr == (
        cost_breakdown.total_engineering_hours * cost_breakdown.blended_hourly_rate_inr
    )
    # Check cloud sum
    assert cost_breakdown.estimated_cloud_monthly_inr == sum(cost_breakdown.cloud_cost_items.values())
    # Check sprints
    assert len(sprints) >= 4
    assert sprints[0].sprint_number == 1


def test_commercial_terms_and_sow_math():
    """Verifies commercial payment milestones and terms."""
    terms = CommercialTerms()
    assert terms.deposit_percentage + terms.milestone_percentage + terms.final_percentage == 100
    assert terms.warranty_days >= 30
    assert "intellectual property" in terms.intellectual_property_clause.lower()


def test_audio_transcriber_graceful_handling():
    """Verifies that the audio transcriber gracefully handles missing files."""
    success, result = transcribe_client_audio("non_existent_file.mp3")
    assert success is False
    assert len(result) > 0


def test_full_proposal_generation_and_export():
    """Verifies end-to-end proposal generation and markdown export."""
    client_in = ClientInput(
        project_name="ShopSmart AI",
        client_industry="E-Commerce",
        vision_description="Omnichannel shopping assistant with semantic product search.",
        concurrency_tier="High (10k - 50k DAU)",
        compliance_tags=["GDPR"],
        preferred_cloud="GCP",
        target_timeline_weeks=12
    )
    proposal = generate_full_proposal(client_in)
    assert isinstance(proposal, ArchitectureProposal)
    assert proposal.project_name == "ShopSmart AI"
    assert len(proposal.tech_stack) > 0
    assert len(proposal.sprint_plan) > 0
    
    md_output = export_proposal_markdown(proposal)
    assert "Statement of Work (SOW)" in md_output
    assert "Cynbit Technologies Private Limited" in md_output
    assert "```mermaid" in md_output
    assert "Milestone Payment Schedule" in md_output
    assert "Signatures & Authorization" in md_output


def test_api_health_endpoint():
    """Verifies FastAPI GET /api/health returns 200 and integration dictionary."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "integrations" in data
    assert data["integrations"]["deterministic_offline_engine"] is True


def test_api_synthesize_endpoint():
    """Verifies FastAPI POST /api/synthesize accepts ClientInput and returns 200 ArchitectureProposal."""
    payload = {
        "project_name": "TestAPI Project",
        "client_industry": "FinTech",
        "vision_description": "Automated payment anomaly detector.",
        "concurrency_tier": "Medium (1k - 10k DAU)",
        "compliance_tags": ["PCI-DSS"],
        "preferred_cloud": "AWS",
        "budget_tier": "Growth ($10k - $25k)",
        "target_timeline_weeks": 8
    }
    response = client.post("/api/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["project_name"] == "TestAPI Project"
    assert "mermaid_diagram" in data
    assert "cost_breakdown" in data
    assert "sprint_plan" in data
