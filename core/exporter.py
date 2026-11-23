"""
AutoScope AI — Proposal & Statement of Work (SOW) Exporter
Formats architecture proposals and commercial agreements formatted for B2B client presentations.
"""

from .schemas import ArchitectureProposal


def export_proposal_markdown(proposal: ArchitectureProposal) -> str:
    """
    Compiles an executive-grade technical proposal and Statement of Work (SOW)
    formatted for B2B client presentations.
    """
    terms = proposal.commercial_terms
    costs = proposal.cost_breakdown

    deposit_amount = int(costs.total_development_cost_inr * (terms.deposit_percentage / 100))
    milestone_amount = int(costs.total_development_cost_inr * (terms.milestone_percentage / 100))
    final_amount = costs.total_development_cost_inr - deposit_amount - milestone_amount

    lines = [
        f"# Technical Solution Architecture & Statement of Work (SOW)",
        f"## Project: {proposal.project_name}",
        f"**Service Provider:** AutoScope Engineering & Cloud Solutions Architecture  ",
        f"**Inference Engine:** AutoScope AI Engine (`{proposal.generation_mode}`)  ",
        f"**Date Generated:** {proposal.generated_at}  ",
        f"**Industry Vertical:** {proposal.client_industry}  ",
        "",
        "---",
        "",
        "## 1. Executive Summary & Solution Blueprint",
        proposal.executive_summary,
        "",
        "### Key Architectural Decisions",
    ]
    for dec in proposal.key_architectural_decisions:
        lines.append(f"* **{dec}**")

    lines.extend([
        "",
        "---",
        "",
        "## 2. Cloud System Architecture",
        "",
        "```mermaid",
        proposal.mermaid_diagram,
        "```",
        "",
        "---",
        "",
        "## 3. Production Technology Stack",
        "",
        "| Component Category | Technology Selected | Architectural Rationale |",
        "| :--- | :--- | :--- |",
    ])
    for item in proposal.tech_stack:
        lines.append(f"| **{item.category}** | `{item.technology_name}` | {item.rationale} |")

    lines.extend([
        "",
        "---",
        "",
        "## 4. Milestone Sprint Roadmap & Acceptance Criteria",
        "",
    ])
    for sprint in proposal.sprint_plan:
        lines.append(f"### Sprint {sprint.sprint_number}: {sprint.sprint_name} ({sprint.duration_weeks} Weeks)")
        lines.append(f"**Core Milestone:** {sprint.core_focus}  ")
        lines.append("**Key Deliverables & Acceptance Criteria:**")
        for d in sprint.deliverables:
            lines.append(f"- [x] {d}")
        lines.append("")

    lines.extend([
        "---",
        "",
        "## 5. Commercial Investment & Payment Schedule",
        "",
        f"* **Total Scoped Effort:** `{costs.total_engineering_hours} Engineering Hours`",
        f"* **Blended Rate:** `₹{costs.blended_hourly_rate_inr:,} / hour (Development, DevOps, AI, QA)`",
        f"* **Total Fixed-Price Investment:** **`₹{costs.total_development_cost_inr:,} INR`**",
        f"* **Estimated Monthly Cloud Burn:** **`₹{costs.estimated_cloud_monthly_inr:,} INR/month`**",
        "",
        "### Milestone Payment Schedule",
        f"| Payment Gate | Percentage | Amount (INR) | Trigger Event |",
        f"| :--- | :---: | :---: | :--- |",
        f"| **1. Upfront Deposit** | {terms.deposit_percentage}% | **₹{deposit_amount:,}** | Project kickoff & repository provisioning |",
        f"| **2. Mid-Point Milestone** | {terms.milestone_percentage}% | **₹{milestone_amount:,}** | Sprint 3 completion & Core API demo |",
        f"| **3. Final Delivery** | {terms.final_percentage}% | **₹{final_amount:,}** | Staging sign-off & production cutover |",
        "",
        "### Itemized Cloud Infrastructure Burn",
        "| Cloud Service / Resource | Estimated Monthly Burn (INR) |",
        "| :--- | :--- |",
    ])
    for k, v in costs.cloud_cost_items.items():
        lines.append(f"| {k} | `₹{v:,}` |")

    lines.extend([
        "",
        "---",
        "",
        "## 6. Commercial Terms & Legal Protections",
        "",
        f"* **Intellectual Property (IP):** {terms.intellectual_property_clause}",
        f"* **Post-Launch Warranty:** AutoScope provides `{terms.warranty_days} calendar days` of complimentary bug-fixing and SLA monitoring following production delivery.",
        f"* **Scope Management:** {terms.change_order_policy}",
        "",
        "### Compliance & Security Baseline",
    ])
    for c in proposal.compliance_and_security:
        lines.append(f"- 🔒 {c}")

    lines.extend([
        "",
        "### Technical Risk Mitigation",
    ])
    for r in proposal.key_risks_and_mitigations:
        lines.append(f"- ⚠️ {r}")

    lines.extend([
        "",
        "---",
        "",
        "## 7. Signatures & Authorization",
        "",
        "```text",
        "Accepted & Agreed for Client:               Accepted for AutoScope Solutions:",
        "Signature: ______________________          Signature: ______________________",
        "Name:      ______________________          Name:      Principal Architect / Engineering Lead",
        "Title:     ______________________          Title:     Head of Cloud Solutions",
        "Date:      ______________________          Date:      ______________________",
        "```",
        "",
        "> *Generated autonomously by AutoScope AI — Autonomous Cloud Solutions Architect & SOW Synthesizer.*",
    ])

    return "\n".join(lines)
