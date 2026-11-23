"""
Cynbit AutoScope AI — Streamlit Interactive Application
Autonomous Technical Solution Architect for Cynbit Technologies Private Limited.
"""

import os
import streamlit as st
import datetime

# Import core modules
from core.schemas import ClientInput, ArchitectureProposal
from core.architect_engine import generate_full_proposal
from core.diagram_generator import build_ascii_system_diagram
from core.exporter import export_proposal_markdown

# Page configuration
st.set_page_config(
    page_title="Cynbit AutoScope AI",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-Contrast Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 0.2rem;
        color: #1E88E5;
    }
    .subtitle {
        font-size: 1.05rem;
        color: #718096;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: rgba(30, 136, 229, 0.08);
        border: 1px solid rgba(30, 136, 229, 0.25);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
    }
    .badge-cynbit {
        background-color: #0D47A1;
        color: white;
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.85rem;
    }
</style>
""", unsafe_allow_html=True)


# Presets for quick evaluation
PRESETS = {
    "Healthcare: MediTriage AI (HIPAA)": {
        "project_name": "MediTriage AI",
        "industry": "Healthcare",
        "vision": "A clinical patient triage platform that analyzes patient symptoms, reads electronic health records (EHR) via RAG, and recommends specialist consultations while adhering to HIPAA privacy standards.",
        "concurrency": "Medium (1k - 10k DAU)",
        "compliance": ["HIPAA", "GDPR"],
        "cloud": "AWS",
        "weeks": 10,
        "budget": "Growth ($10k - $25k)"
    },
    "FinTech: PayFlow Guard (PCI-DSS)": {
        "project_name": "PayFlow Guard",
        "industry": "FinTech",
        "vision": "High-frequency cross-border payment gateway with real-time fraud scoring, automated AML checks, and immutable double-entry ledger bookkeeping.",
        "concurrency": "High (10k - 50k DAU)",
        "compliance": ["PCI-DSS", "SOC2"],
        "cloud": "AWS",
        "weeks": 12,
        "budget": "Enterprise ($25k - $50k)"
    },
    "E-Commerce: ShopStream AI": {
        "project_name": "ShopStream AI",
        "industry": "E-Commerce",
        "vision": "Omnichannel retail platform with vector-based product recommendations, real-time inventory locks, and sub-100ms flash sale checkout capacity.",
        "concurrency": "High (10k - 50k DAU)",
        "compliance": ["GDPR"],
        "cloud": "GCP",
        "weeks": 8,
        "budget": "Growth ($10k - $25k)"
    },
    "EdTech: BitElevate CodeMentor": {
        "project_name": "BitElevate CodeMentor",
        "industry": "EdTech & Developer Tools",
        "vision": "Automated code evaluation and sandbox execution engine for student cohorts. Evaluates AST modularity, runs automated Pytest test suites, and provides personalized AI code refactoring advice.",
        "concurrency": "Medium (1k - 10k DAU)",
        "compliance": ["SOC2"],
        "cloud": "AWS",
        "weeks": 8,
        "budget": "Growth ($10k - $25k)"
    },
    "Custom Inbound Request": {
        "project_name": "",
        "industry": "SaaS",
        "vision": "",
        "concurrency": "Medium (1k - 10k DAU)",
        "compliance": [],
        "cloud": "AWS",
        "weeks": 8,
        "budget": "Growth ($10k - $25k)"
    }
}


# Sidebar
with st.sidebar:
    st.markdown("### 🏢 Cynbit Technologies")
    st.markdown("**AI/ML Engineer Intern Assessment**")
    st.caption("Candidate: Tanmay Patil")
    st.markdown("---")
    
    st.markdown("#### ⚡ 1-Click Demo Presets")
    selected_preset = st.selectbox(
        "Load realistic client scenario:",
        list(PRESETS.keys()),
        index=0
    )
    preset_data = PRESETS[selected_preset]
    
    st.markdown("---")
    st.markdown("#### ⚙️ Inference Settings")
    st.info("💡 **Zero-Config Ready**: Operates with 100% fidelity offline via the built-in Deterministic Expert Engine, or optionally with live LLM APIs if keys are set.")
    
    api_choice = st.selectbox(
        "Active Reasoner Mode:",
        ["Auto-Detect (Groq / OpenAI / Gemini / Offline)", "Force Offline Expert Engine"]
    )
    
    with st.expander("Optional API Keys (Overrides .env)"):
        groq_input = st.text_input("Groq API Key", type="password", value=os.getenv("GROQ_API_KEY", ""))
        openai_input = st.text_input("OpenAI API Key", type="password", value=os.getenv("OPENAI_API_KEY", ""))
        gemini_input = st.text_input("Gemini API Key", type="password", value=os.getenv("GEMINI_API_KEY", ""))
        
        if groq_input:
            os.environ["GROQ_API_KEY"] = groq_input
        if openai_input:
            os.environ["OPENAI_API_KEY"] = openai_input
        if gemini_input:
            os.environ["GEMINI_API_KEY"] = gemini_input


# Header
st.markdown('<div class="main-title">⚡ Cynbit AutoScope AI</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Autonomous Technical Solutions Architect & Proposal Synthesis Engine for <b>Cynbit Technologies</b> (<a href="https://cynbit.in" target="_blank">cynbit.in</a>)</div>', unsafe_allow_html=True)

# Main Intake Form
st.markdown("### 📋 Client Vision & Project Requirements Intake")

col1, col2 = st.columns([2, 1])

with col1:
    project_name = st.text_input("Project Name", value=preset_data["project_name"] or "MediTriage AI")
    industry = st.selectbox(
        "Industry Vertical",
        ["Healthcare", "FinTech", "E-Commerce", "SaaS & AI", "EdTech & Developer Tools", "Logistics & IoT"],
        index=["Healthcare", "FinTech", "E-Commerce", "SaaS", "EdTech & Developer Tools", "Logistics"].index(preset_data["industry"]) if preset_data["industry"] in ["Healthcare", "FinTech", "E-Commerce", "SaaS", "EdTech & Developer Tools", "Logistics"] else 0
    )
    vision = st.text_area(
        "Client Vision & Core Problem Statement",
        value=preset_data["vision"],
        height=130,
        help="Paste raw inquiry from client email or cynbit.in contact form"
    )

with col2:
    concurrency = st.selectbox(
        "Expected Concurrency / Scale",
        ["Low (< 1,000 DAU)", "Medium (1k - 10k DAU)", "High (10k - 50k DAU)", "Enterprise (> 100k DAU)"],
        index=1
    )
    cloud_pref = st.selectbox(
        "Preferred Cloud Provider",
        ["AWS", "GCP", "Azure", "Hybrid / Multi-Cloud"],
        index=0
    )
    timeline_weeks = st.slider("Target Delivery Timeline (Weeks)", min_value=4, max_value=24, value=preset_data["weeks"])
    
    compliance = st.multiselect(
        "Compliance & Regulatory Flags",
        ["HIPAA", "GDPR", "SOC2", "PCI-DSS"],
        default=preset_data["compliance"]
    )

# Action button
generate_clicked = st.button("🚀 Synthesize Architecture & Proposal", type="primary", use_container_width=True)

# Execution & State Management
if generate_clicked or "current_proposal" in st.session_state:
    if generate_clicked:
        with st.spinner("Analyzing constraints, synthesizing microservices topology, and calculating sprint budget..."):
            client_input = ClientInput(
                project_name=project_name,
                client_industry=industry,
                vision_description=vision,
                concurrency_tier=concurrency,
                compliance_tags=compliance,
                preferred_cloud=cloud_pref,
                target_timeline_weeks=timeline_weeks
            )
            # Check offline override
            if api_choice == "Force Offline Expert Engine":
                old_groq, old_openai, old_gemini = os.environ.get("GROQ_API_KEY"), os.environ.get("OPENAI_API_KEY"), os.environ.get("GEMINI_API_KEY")
                if "GROQ_API_KEY" in os.environ: del os.environ["GROQ_API_KEY"]
                if "OPENAI_API_KEY" in os.environ: del os.environ["OPENAI_API_KEY"]
                if "GEMINI_API_KEY" in os.environ: del os.environ["GEMINI_API_KEY"]
                proposal = generate_full_proposal(client_input)
                if old_groq: os.environ["GROQ_API_KEY"] = old_groq
                if old_openai: os.environ["OPENAI_API_KEY"] = old_openai
                if old_gemini: os.environ["GEMINI_API_KEY"] = old_gemini
            else:
                proposal = generate_full_proposal(client_input)
                
            st.session_state["current_proposal"] = proposal
            st.session_state["client_input"] = client_input

    proposal: ArchitectureProposal = st.session_state["current_proposal"]
    client_in: ClientInput = st.session_state["client_input"]

    st.success(f"✅ Architecture synthesized successfully! Engine mode: **{proposal.generation_mode}**")
    
    # Top KPI Metrics row
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Total Dev Effort", f"{proposal.cost_breakdown.total_engineering_hours} hrs")
    with m2:
        st.metric("Development Budget", f"${proposal.cost_breakdown.total_development_cost_usd:,} USD")
    with m3:
        st.metric("Cloud Infra Burn", f"${proposal.cost_breakdown.estimated_cloud_monthly_usd:,}/mo")
    with m4:
        st.metric("Milestone Sprints", f"{len(proposal.sprint_plan)} Sprints")

    # Tabs
    tab_summary, tab_arch, tab_stack, tab_sprints, tab_costs, tab_export = st.tabs([
        "📄 Executive Brief",
        "🏛️ System Architecture",
        "🛠️ Tech Stack Spec",
        "📅 Sprint Roadmap",
        "💰 Budget & Cloud Model",
        "📥 Proposal Exporter"
    ])

    # Tab 1: Executive Brief
    with tab_summary:
        st.markdown(f"### Project: {proposal.project_name}")
        st.info(proposal.executive_summary)
        
        st.markdown("#### 🎯 Key Architectural Decisions")
        for dec in proposal.key_architectural_decisions:
            st.markdown(f"- **{dec}**")
            
        st.markdown("#### 🛡️ Compliance & Security Posture")
        for sec in proposal.compliance_and_security:
            st.markdown(f"- 🔒 {sec}")
            
        st.markdown("#### ⚠️ Risk Analysis & Mitigation")
        for risk in proposal.key_risks_and_mitigations:
            st.markdown(f"- {risk}")

    # Tab 2: System Architecture
    with tab_arch:
        st.markdown("### 🗺️ Visual Architecture Blueprint")
        st.caption("Clean, high-contrast Mermaid flowchart adhering to zero-fill background rules:")
        st.markdown(f"```mermaid\n{proposal.mermaid_diagram}\n```")
        
        with st.expander("Terminal / ASCII Architecture Map"):
            st.code(build_ascii_system_diagram(client_in), language="text")
            
        st.markdown("#### 🏗️ Architecture Layers Breakdown")
        for layer in proposal.architecture_layers:
            with st.container(border=True):
                st.markdown(f"**{layer.layer_name}**")
                st.caption(layer.description)
                st.markdown("**Components:** " + ", ".join([f"`{c}`" for c in layer.components]))

    # Tab 3: Tech Stack
    with tab_stack:
        st.markdown("### 🧰 Production-Grade Technology Stack")
        stack_data = [
            {"Category": s.category, "Technology": s.technology_name, "Rationale": s.rationale}
            for s in proposal.tech_stack
        ]
        st.table(stack_data)

    # Tab 4: Sprint Roadmap
    with tab_sprints:
        st.markdown("### 🗓️ Milestone Sprint Execution Timeline")
        for sprint in proposal.sprint_plan:
            with st.container(border=True):
                c_title, c_dur = st.columns([3, 1])
                with c_title:
                    st.markdown(f"#### Sprint {sprint.sprint_number}: {sprint.sprint_name}")
                with c_dur:
                    st.badge(f"⏱️ {sprint.duration_weeks} Weeks", color="blue")
                
                st.markdown(f"**Core Milestone:** {sprint.core_focus}")
                st.markdown("**Concrete Deliverables:**")
                for d in sprint.deliverables:
                    st.markdown(f"- 📦 {d}")

    # Tab 5: Budget & Costs
    with tab_costs:
        st.markdown("### 💵 Development Investment & Cloud Estimation")
        col_dev, col_cloud = st.columns(2)
        
        with col_dev:
            st.markdown("#### 👨‍💻 Engineering Hours Model")
            st.markdown(f"- **Total Scoped Hours:** `{proposal.cost_breakdown.total_engineering_hours} hours`")
            st.markdown(f"- **Blended Rate:** `${proposal.cost_breakdown.blended_hourly_rate_usd}/hr`")
            st.markdown(f"- **Total Implementation:** **`${proposal.cost_breakdown.total_development_cost_usd:,} USD`**")
            
        with col_cloud:
            st.markdown("#### ☁️ Estimated Monthly Cloud Burn")
            st.markdown(f"- **Total Monthly Burn:** **`${proposal.cost_breakdown.estimated_cloud_monthly_usd:,} USD/month`**")
            st.markdown(f"- **Target Cloud Infrastructure:** `{client_in.preferred_cloud}`")
            
        st.markdown("#### 📊 Itemized Cloud Infrastructure Breakdown")
        cloud_table = [
            {"Cloud Resource / Service": k, "Estimated Monthly Cost (USD)": f"${v:,}"}
            for k, v in proposal.cost_breakdown.cloud_cost_items.items()
        ]
        st.table(cloud_table)

    # Tab 6: Export & Proposal
    with tab_export:
        st.markdown("### 📥 Client-Facing Proposal Export")
        markdown_text = export_proposal_markdown(proposal)
        
        st.download_button(
            label="📄 Download Full Proposal (Markdown)",
            data=markdown_text,
            file_name=f"{proposal.project_name.lower().replace(' ', '_')}_technical_proposal.md",
            mime="text/markdown",
            type="primary"
        )
        
        with st.expander("Preview Formatted Markdown Document", expanded=True):
            st.markdown(markdown_text)

# Footer
st.markdown("---")
st.markdown(
    '<div style="text-align: center; color: #718096; font-size: 0.85rem;">'
    'Built with pride by <b>Tanmay Patil</b> for the <b>AI/ML Engineer Intern Assessment</b> at '
    '<b>Cynbit Technologies Private Limited</b> (Jaipur, India) • 2026'
    '</div>',
    unsafe_allow_html=True
)
