"""
Cynbit AutoScope AI — Streamlit Interactive Web Application
Enterprise-grade Autonomous Solutions Architect & ProposalCraft Engine.
Designed for Cynbit Technologies Private Limited (cynbit.in).
"""

import os
import tempfile
import streamlit as st
import datetime

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Import core modules
from core.schemas import ClientInput, ArchitectureProposal
from core.architect_engine import generate_full_proposal
from core.diagram_generator import build_ascii_system_diagram
from core.exporter import export_proposal_markdown
from core.audio_transcriber import transcribe_client_audio

# Page configuration
st.set_page_config(
    page_title="Cynbit AutoScope AI",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Classic Enterprise Styling with Smooth Transitions & High Contrast
st.markdown("""
<style>
    /* Global Typography & Palette */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Sliding Keyframe Animation for Classic Smooth Transitions */
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animated-panel {
        animation: slideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Header Styling */
    .cynbit-header {
        padding: 1.2rem 1.8rem;
        background: linear-gradient(135deg, rgba(10, 37, 64, 0.95), rgba(0, 96, 103, 0.90));
        border-radius: 14px;
        color: #FFFFFF;
        margin-bottom: 1.8rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        animation: slideInUp 0.3s ease-out;
    }
    
    .cynbit-title {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .cynbit-subtitle {
        font-size: 0.95rem;
        color: #E2E8F0;
        margin-top: 0.3rem;
        font-weight: 500;
    }
    
    .status-pill {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.25);
        margin-right: 8px;
    }
    
    /* Metric Cards */
    .metric-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
        margin-bottom: 1.5rem;
    }
    
    .custom-card {
        border-radius: 12px;
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 16px 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .custom-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }
    
    /* Tab Styling Overrides */
    .stTabs [data-baseweb="tab-list"] {
        gap: 12px;
        border-bottom: 2px solid rgba(15, 23, 42, 0.08);
        padding-bottom: 4px;
    }
    
    .stTabs [data-baseweb="tab"] {
        font-weight: 600;
        font-size: 0.92rem;
        border-radius: 8px 8px 0 0;
        padding: 8px 16px;
        transition: all 0.25s ease;
    }
    
    .stTabs [aria-selected="true"] {
        color: #006067 !important;
        border-bottom: 3px solid #006067 !important;
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
    "Custom Client Request": {
        "project_name": "",
        "industry": "SaaS & AI",
        "vision": "",
        "concurrency": "Medium (1k - 10k DAU)",
        "compliance": [],
        "cloud": "AWS",
        "weeks": 8,
        "budget": "Growth ($10k - $25k)"
    }
}


# Sidebar Configuration
with st.sidebar:
    st.markdown("### 🏢 Cynbit Technologies")
    st.markdown("**AI/ML Engineer Intern Assessment**")
    st.caption("Candidate: Tanmay Patil | Jaipur, India")
    st.markdown("---")
    
    st.markdown("#### ⚡ 1-Click Client Presets")
    selected_preset = st.selectbox(
        "Load realistic client inquiry:",
        list(PRESETS.keys()),
        index=0
    )
    preset_data = PRESETS[selected_preset]
    
    st.markdown("---")
    st.markdown("#### ⚙️ Inference Engine Selector")
    engine_choice = st.selectbox(
        "Active Reasoner:",
        [
            "Auto-Detect (Prioritize OpenRouter Llama-3.3-70B)",
            "Force OpenRouter (Llama-3.3-70B)",
            "Force Deterministic Offline Expert Engine"
        ]
    )
    
    # Provider badges
    has_or = bool(os.getenv("OPENROUTER_API_KEY"))
    has_aai = bool(os.getenv("ASSEMBLYAI_API_KEY"))
    has_groq = bool(os.getenv("GROQ_API_KEY"))
    
    st.markdown("##### 🔌 Connected Service Status")
    st.markdown(f"- OpenRouter: {'🟢 Active' if has_or else '⚪ Unset'}")
    st.markdown(f"- AssemblyAI Voice: {'🟢 Active' if has_aai else '⚪ Unset'}")
    st.markdown(f"- Groq Hardware: {'🟢 Active' if has_groq else '⚪ Unset'}")
    st.markdown("- Offline Engine: 🟢 **Always Ready (0% Uptime Risk)**")


# Corporate Header
st.markdown("""
<div class="cynbit-header">
    <div class="cynbit-title">
        <span>⚡ Cynbit AutoScope AI</span>
    </div>
    <div class="cynbit-subtitle">
        Autonomous Technical Solution Architect & ProposalCraft Engine for <b>Cynbit Technologies</b> (<a href="https://cynbit.in" target="_blank" style="color: #99F6E4; text-decoration: underline;">cynbit.in</a>)
    </div>
    <div style="margin-top: 10px;">
        <span class="status-pill">Pydantic v2 Contract-Safe</span>
        <span class="status-pill">AssemblyAI Voice Ready</span>
        <span class="status-pill">High-Contrast Mermaid Architecture</span>
        <span class="status-pill">Commercial SOW Generator</span>
    </div>
</div>
""", unsafe_allow_html=True)


# Client Intake Section
st.markdown("### 📋 Client Vision & Technical Scoping Intake")
st.caption("Transform vague client requests or recorded client meetings into an enterprise architecture and priced SOW in 90 seconds.")

col_main, col_settings = st.columns([2, 1])

with col_main:
    project_name = st.text_input("Project / Product Name", value=preset_data["project_name"] or "MediTriage AI")
    industry = st.selectbox(
        "Industry Vertical",
        ["Healthcare", "FinTech", "E-Commerce", "SaaS & AI", "EdTech & Developer Tools", "Logistics & IoT"],
        index=["Healthcare", "FinTech", "E-Commerce", "SaaS & AI", "EdTech & Developer Tools", "Logistics & IoT"].index(preset_data["industry"]) if preset_data["industry"] in ["Healthcare", "FinTech", "E-Commerce", "SaaS & AI", "EdTech & Developer Tools", "Logistics & IoT"] else 0
    )
    
    # Audio Upload (AssemblyAI Integration)
    voice_transcript_text = None
    with st.expander("🎙️ Client Voice Note / Zoom Audio Upload (Powered by AssemblyAI)", expanded=False):
        uploaded_audio = st.file_uploader(
            "Upload client meeting recording or voice note (.mp3, .wav, .m4a)",
            type=["mp3", "wav", "m4a", "ogg"]
        )
        if uploaded_audio:
            with st.spinner("Transcribing audio with AssemblyAI..."):
                with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{uploaded_audio.name}") as tmp_file:
                    tmp_file.write(uploaded_audio.read())
                    tmp_path = tmp_file.name
                
                success, transcript = transcribe_client_audio(tmp_path)
                try: os.remove(tmp_path)
                except Exception: pass
                
                if success:
                    st.success("✅ Voice recording transcribed successfully!")
                    st.info(transcript)
                    voice_transcript_text = transcript
                else:
                    st.warning(f"Voice transcription note: {transcript}")
    
    initial_vision_text = preset_data["vision"]
    if voice_transcript_text and not initial_vision_text:
        initial_vision_text = voice_transcript_text

    vision = st.text_area(
        "Client Vision & Core Problem Statement",
        value=initial_vision_text,
        height=130,
        help="Paste raw inquiry from client email, contact form, or transcribed voice note."
    )

with col_settings:
    concurrency = st.selectbox(
        "Expected Concurrency / Scale",
        ["Low (< 1,000 DAU)", "Medium (1k - 10k DAU)", "High (10k - 50k DAU)", "Enterprise (> 100k DAU)"],
        index=1
    )
    cloud_pref = st.selectbox(
        "Target Cloud Provider",
        ["AWS", "GCP", "Azure", "Hybrid / Multi-Cloud"],
        index=0
    )
    timeline_weeks = st.slider("Target Delivery Timeline (Weeks)", min_value=4, max_value=24, value=preset_data["weeks"])
    
    compliance = st.multiselect(
        "Compliance & Security Baseline",
        ["HIPAA", "GDPR", "SOC2", "PCI-DSS"],
        default=preset_data["compliance"]
    )

# Execution CTA
st.markdown("<br>", unsafe_allow_html=True)
generate_clicked = st.button("🚀 Synthesize Architecture & Proposal (90s)", type="primary", use_container_width=True)

# State Management & Pipeline Execution
if generate_clicked or "current_proposal" in st.session_state:
    if generate_clicked:
        with st.spinner("Executing 5-Agent Pipeline: Normalizing constraints, synthesizing microservices, generating Mermaid topology, and computing SOW budget..."):
            client_input = ClientInput(
                project_name=project_name,
                client_industry=industry,
                vision_description=vision,
                voice_transcript=voice_transcript_text,
                concurrency_tier=concurrency,
                compliance_tags=compliance,
                preferred_cloud=cloud_pref,
                target_timeline_weeks=timeline_weeks
            )
            
            # Handle offline force override if selected
            if "Force Deterministic" in engine_choice:
                old_or = os.environ.get("OPENROUTER_API_KEY")
                if "OPENROUTER_API_KEY" in os.environ: del os.environ["OPENROUTER_API_KEY"]
                proposal = generate_full_proposal(client_input)
                if old_or: os.environ["OPENROUTER_API_KEY"] = old_or
            else:
                proposal = generate_full_proposal(client_input)
                
            st.session_state["current_proposal"] = proposal
            st.session_state["client_input"] = client_input

    proposal: ArchitectureProposal = st.session_state["current_proposal"]
    client_in: ClientInput = st.session_state["client_input"]

    st.markdown("<div class='animated-panel'>", unsafe_allow_html=True)
    st.success(f"✅ Architecture & SOW synthesized successfully! Engine mode: **{proposal.generation_mode}**")
    
    # Top KPI Metrics row
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Total Dev Effort", f"{proposal.cost_breakdown.total_engineering_hours} hrs")
    with m2:
        st.metric("Fixed-Price SOW Budget", f"${proposal.cost_breakdown.total_development_cost_usd:,} USD")
    with m3:
        st.metric("Est. Cloud Monthly Burn", f"${proposal.cost_breakdown.estimated_cloud_monthly_usd:,}/mo")
    with m4:
        st.metric("Milestone Sprints", f"{len(proposal.sprint_plan)} Sprints")

    # Sliding Interactive Tabs
    tab_summary, tab_arch, tab_stack, tab_sprints, tab_costs, tab_terms, tab_export = st.tabs([
        "📄 Executive Brief",
        "🏛️ System Architecture",
        "🛠️ Tech Stack Matrix",
        "📅 Sprint Roadmap",
        "💰 Budget & Cloud Infra",
        "⚖️ Commercial Terms & SOW",
        "📥 Proposal Exporter"
    ])

    # Tab 1: Executive Brief
    with tab_summary:
        st.markdown(f"### Project: {proposal.project_name}")
        st.info(proposal.executive_summary)
        
        col_dec, col_sec = st.columns(2)
        with col_dec:
            st.markdown("#### 🎯 Key Architectural Decisions")
            for dec in proposal.key_architectural_decisions:
                st.markdown(f"- **{dec}**")
        with col_sec:
            st.markdown("#### 🛡️ Compliance & Security Posture")
            for sec in proposal.compliance_and_security:
                st.markdown(f"- 🔒 {sec}")
            
        st.markdown("#### ⚠️ Technical Risk Analysis & Mitigation")
        for risk in proposal.key_risks_and_mitigations:
            st.markdown(f"- {risk}")

    # Tab 2: System Architecture
    with tab_arch:
        st.markdown("### 🗺️ Visual Cloud Architecture Blueprint")
        st.caption("Clean, high-contrast Mermaid flowchart adhering to zero-fill background rules for dark & light modes:")
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
        st.markdown("### 🗓️ Milestone Sprint Execution Timeline & Acceptance Criteria")
        for sprint in proposal.sprint_plan:
            with st.container(border=True):
                c_title, c_dur = st.columns([3, 1])
                with c_title:
                    st.markdown(f"#### Sprint {sprint.sprint_number}: {sprint.sprint_name}")
                with c_dur:
                    st.badge(f"⏱️ {sprint.duration_weeks} Weeks", color="blue")
                
                st.markdown(f"**Core Technical Milestone:** {sprint.core_focus}")
                st.markdown("**Concrete Deliverables & Acceptance Criteria:**")
                for d in sprint.deliverables:
                    st.markdown(f"- [x] {d}")

    # Tab 5: Budget & Costs
    with tab_costs:
        st.markdown("### 💵 Development Investment & Cloud Estimation")
        col_dev, col_cloud = st.columns(2)
        
        with col_dev:
            st.markdown("#### 👨‍💻 Engineering Hours Model")
            st.markdown(f"- **Total Scoped Hours:** `{proposal.cost_breakdown.total_engineering_hours} hours`")
            st.markdown(f"- **Blended Rate:** `${proposal.cost_breakdown.blended_hourly_rate_usd}/hr (Dev, DevOps, QA, AI)`")
            st.markdown(f"- **Total Fixed-Price SOW:** **`${proposal.cost_breakdown.total_development_cost_usd:,} USD`**")
            
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

    # Tab 6: Commercial Terms & SOW
    with tab_terms:
        st.markdown("### ⚖️ Commercial Terms & Milestone Payment Gates")
        terms = proposal.commercial_terms
        costs = proposal.cost_breakdown
        
        dep_amt = int(costs.total_development_cost_usd * (terms.deposit_percentage / 100))
        mid_amt = int(costs.total_development_cost_usd * (terms.milestone_percentage / 100))
        fin_amt = int(costs.total_development_cost_usd * (terms.final_percentage / 100))
        
        col_t1, col_t2, col_t3 = st.columns(3)
        with col_t1:
            with st.container(border=True):
                st.markdown("##### 1. Upfront Deposit")
                st.markdown(f"### ${dep_amt:,} USD")
                st.caption(f"{terms.deposit_percentage}% upon SOW signing & repo kickoff")
        with col_t2:
            with st.container(border=True):
                st.markdown("##### 2. Mid-Point Milestone")
                st.markdown(f"### ${mid_amt:,} USD")
                st.caption(f"{terms.milestone_percentage}% upon Sprint 3 completion & Core API demo")
        with col_t3:
            with st.container(border=True):
                st.markdown("##### 3. Final Acceptance")
                st.markdown(f"### ${fin_amt:,} USD")
                st.caption(f"{terms.final_percentage}% upon production cutover & client sign-off")
                
        st.markdown("#### 📜 Legal Protections & Policies")
        st.markdown(f"- **Intellectual Property (IP):** {terms.intellectual_property_clause}")
        st.markdown(f"- **Complimentary Warranty:** `{terms.warranty_days} calendar days` post-launch bug fixing & SLA monitoring.")
        st.markdown(f"- **Scope Expansion Policy:** {terms.change_order_policy}")

    # Tab 7: Export & Proposal
    with tab_export:
        st.markdown("### 📥 Client-Facing Statement of Work (SOW) Export")
        markdown_text = export_proposal_markdown(proposal)
        
        st.download_button(
            label="📄 Download Complete Statement of Work (Markdown)",
            data=markdown_text,
            file_name=f"{proposal.project_name.lower().replace(' ', '_')}_cynbit_sow.md",
            mime="text/markdown",
            type="primary"
        )
        
        with st.expander("Preview Formatted SOW Document", expanded=True):
            st.markdown(markdown_text)

    st.markdown("</div>", unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown(
    '<div style="text-align: center; color: #718096; font-size: 0.85rem;">'
    'Built with pride by <b>Tanmay Patil</b> for the <b>AI/ML Engineer Intern Assessment</b> at '
    '<b>Cynbit Technologies Private Limited</b> (Jaipur, India) • 2026'
    '</div>',
    unsafe_allow_html=True
)
