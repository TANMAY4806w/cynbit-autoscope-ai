import { useState } from 'react';
import {
  Sparkles,
  Layers,
  Server,
  DollarSign,
  FileText,
  Calendar,
  Shield,
  Download,
  Copy,
  CheckCircle2,
  Cpu,
  Mic,
  FileCode2,
} from 'lucide-react';
import type { ClientInput, ArchitectureProposal } from './types/proposal';
import { generateProposal, exportProposalMarkdown, buildAsciiDiagram } from './services/proposalEngine';
import { MermaidViewer } from './components/MermaidViewer';
import { CustomSelect } from './components/CustomSelect';

const PRESETS: Record<string, Partial<ClientInput>> = {
  'Healthcare: MediTriage AI (HIPAA)': {
    project_name: 'MediTriage AI',
    client_industry: 'Healthcare',
    vision_description:
      'A clinical patient triage platform that analyzes patient symptoms, reads electronic health records (EHR) via RAG, and recommends specialist consultations while adhering to HIPAA privacy standards.',
    concurrency_tier: 'Medium (1k - 10k DAU)',
    compliance_tags: ['HIPAA', 'GDPR'],
    preferred_cloud: 'AWS',
    target_timeline_weeks: 10,
    budget_tier: 'Growth (₹10L - ₹25L)',
  },
  'FinTech: PayFlow Guard (PCI-DSS)': {
    project_name: 'PayFlow Guard',
    client_industry: 'FinTech',
    vision_description:
      'High-frequency cross-border payment gateway with real-time fraud scoring, automated AML checks, and immutable double-entry ledger bookkeeping.',
    concurrency_tier: 'High (10k - 50k DAU)',
    compliance_tags: ['PCI-DSS', 'SOC2'],
    preferred_cloud: 'AWS',
    target_timeline_weeks: 12,
    budget_tier: 'Enterprise (₹25L - ₹50L)',
  },
  'E-Commerce: ShopStream AI': {
    project_name: 'ShopStream AI',
    client_industry: 'E-Commerce',
    vision_description:
      'Omnichannel retail platform with vector-based product recommendations, real-time inventory locks, and sub-100ms flash sale checkout capacity.',
    concurrency_tier: 'High (10k - 50k DAU)',
    compliance_tags: ['GDPR'],
    preferred_cloud: 'GCP',
    target_timeline_weeks: 8,
    budget_tier: 'Growth (₹10L - ₹25L)',
  },
  'EdTech: BitElevate CodeMentor': {
    project_name: 'BitElevate CodeMentor',
    client_industry: 'EdTech & Developer Tools',
    vision_description:
      'Automated code evaluation and sandbox execution engine for student cohorts. Evaluates AST modularity, runs automated Pytest test suites, and provides personalized AI code refactoring advice.',
    concurrency_tier: 'Medium (1k - 10k DAU)',
    compliance_tags: ['SOC2'],
    preferred_cloud: 'AWS',
    target_timeline_weeks: 8,
    budget_tier: 'Growth (₹10L - ₹25L)',
  },
};

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState<string>('Healthcare: MediTriage AI (HIPAA)');
  const [projectName, setProjectName] = useState<string>('MediTriage AI');
  const [industry, setIndustry] = useState<string>('Healthcare');
  const [vision, setVision] = useState<string>(PRESETS['Healthcare: MediTriage AI (HIPAA)'].vision_description || '');
  const [concurrency, setConcurrency] = useState<string>('Medium (1k - 10k DAU)');
  const [cloud, setCloud] = useState<string>('AWS');
  const [weeks, setWeeks] = useState<number>(10);
  const [compliance, setCompliance] = useState<string[]>(['HIPAA', 'GDPR']);
  const [apiKey, setApiKey] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ArchitectureProposal | null>(null);
  const [lastInput, setLastInput] = useState<ClientInput | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [copied, setCopied] = useState<boolean>(false);

  const handlePresetChange = (name: string) => {
    setSelectedPreset(name);
    const p = PRESETS[name];
    if (p) {
      if (p.project_name) setProjectName(p.project_name);
      if (p.client_industry) setIndustry(p.client_industry);
      if (p.vision_description) setVision(p.vision_description);
      if (p.concurrency_tier) setConcurrency(p.concurrency_tier);
      if (p.preferred_cloud) setCloud(p.preferred_cloud);
      if (p.target_timeline_weeks) setWeeks(p.target_timeline_weeks);
      if (p.compliance_tags) setCompliance(p.compliance_tags);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const input: ClientInput = {
      project_name: projectName,
      client_industry: industry,
      vision_description: vision,
      target_audience: 'B2B / B2C Enterprise',
      concurrency_tier: concurrency,
      compliance_tags: compliance,
      preferred_cloud: cloud,
      budget_tier: 'Growth ($10k - $25k)',
      target_timeline_weeks: weeks,
    };

    try {
      const res = await generateProposal(input, apiKey);
      setProposal(res);
      setLastInput(input);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompliance = (tag: string) => {
    if (compliance.includes(tag)) {
      setCompliance(compliance.filter((t) => t !== tag));
    } else {
      setCompliance([...compliance, tag]);
    }
  };

  const handleCopyMarkdown = () => {
    if (proposal) {
      const md = exportProposalMarkdown(proposal);
      navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (proposal) {
      const md = exportProposalMarkdown(proposal);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${proposal.project_name.toLowerCase().replace(/\s+/g, '_')}_architecture_sow.md`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200 shadow-sm">
              <Cpu className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-white">AutoScope AI</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700 text-zinc-300 font-mono">
                  v1.0 • Enterprise
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Autonomous Cloud Solutions Architect & Commercial SOW Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <FileCode2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>API Specs</span>
            </a>
            <a
              href="https://github.com/TANMAY4806w/cynbit-autoscope-ai"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client Scoping Intake */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-6 rounded-xl bg-[#121215] border border-zinc-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="font-semibold text-base text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-400" />
                Technical Scoping Intake
              </h2>
              <span className="text-xs text-zinc-400">Step 1 of 2</span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">
                Client Scenario Preset
              </label>
              <CustomSelect
                value={selectedPreset}
                onChange={handlePresetChange}
                options={Object.keys(PRESETS).map((k) => ({ value: k, label: k }))}
                ariaLabel="Select Client Scenario Preset"
              />
            </div>

            {/* Project Name & Industry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Industry Vertical</label>
                <CustomSelect
                  value={industry}
                  onChange={setIndustry}
                  options={[
                    'Healthcare',
                    'FinTech',
                    'E-Commerce',
                    'SaaS & AI',
                    'EdTech & Developer Tools',
                    'Logistics & IoT',
                  ]}
                  ariaLabel="Select Industry Vertical"
                />
              </div>
            </div>

            {/* Vision Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Client Vision & Requirements</label>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                  <Mic className="h-3 w-3" /> Voice Intake Supported
                </span>
              </div>
              <textarea
                rows={4}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 font-sans resize-none leading-relaxed transition-colors"
                placeholder="Paste client inquiry or meeting notes..."
              />
            </div>

            {/* Concurrency & Cloud */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Scale / Concurrency</label>
                <CustomSelect
                  value={concurrency}
                  onChange={setConcurrency}
                  options={[
                    'Low (< 1,000 DAU)',
                    'Medium (1k - 10k DAU)',
                    'High (10k - 50k DAU)',
                    'Enterprise (> 100k DAU)',
                  ]}
                  ariaLabel="Select Concurrency Scale"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Target Cloud</label>
                <CustomSelect
                  value={cloud}
                  onChange={setCloud}
                  options={['AWS', 'GCP', 'Azure', 'Hybrid / Multi-Cloud']}
                  ariaLabel="Select Target Cloud"
                />
              </div>
            </div>

            {/* Timeline Slider */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                <span>Target Timeline</span>
                <span className="text-zinc-200 font-mono text-xs font-semibold">{weeks} Weeks</span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Compliance Checkboxes */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-2">
                Compliance & Security Standards
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HIPAA', 'GDPR', 'SOC2', 'PCI-DSS'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCompliance(tag)}
                    className={`py-2 px-3 rounded-lg border font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                      compliance.includes(tag)
                        ? 'bg-blue-950/40 border-blue-500/70 text-blue-200'
                        : 'bg-[#18181b] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{tag}</span>
                    {compliance.includes(tag) && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional API Key Input */}
            <div className="pt-1">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">
                OpenRouter API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-... (configured in server .env)"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 font-mono transition-colors"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Zero-API Fallback: Runs instantly via the built-in Deterministic Expert Engine if no key is entered.
              </p>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="mt-2 w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Architecture & SOW...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-blue-200" />
                  <span>Synthesize Architecture & SOW</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Output Tabs & SOW Results */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          {!proposal ? (
            <div className="h-full min-h-[500px] rounded-xl bg-[#121215]/50 border border-zinc-800 border-dashed flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <div className="h-12 w-12 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Awaiting Technical Input</h3>
              <p className="text-xs max-w-sm text-zinc-400 leading-relaxed">
                Select a client scenario on the left or customize parameters, then click{' '}
                <span className="text-zinc-200 font-medium">Synthesize Architecture & SOW</span> to generate cloud diagrams, tech specs, sprint
                timelines, and a Statement of Work.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-slide-up">
              {/* Metrics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#121215] border border-zinc-800">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Dev Effort</span>
                  <span className="text-xl font-semibold text-white font-mono mt-0.5 block">
                    {proposal.cost_breakdown.total_engineering_hours}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">hours total</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121215] border border-zinc-800">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Fixed SOW Cost</span>
                  <span className="text-xl font-semibold text-zinc-100 font-mono mt-0.5 block">
                    ₹{(proposal.cost_breakdown.total_development_cost_inr || (proposal.cost_breakdown.total_development_cost_usd ? proposal.cost_breakdown.total_development_cost_usd * 85 : 0)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">INR project fee</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121215] border border-zinc-800">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Cloud Monthly</span>
                  <span className="text-xl font-semibold text-zinc-100 font-mono mt-0.5 block">
                    ₹{(proposal.cost_breakdown.estimated_cloud_monthly_inr || (proposal.cost_breakdown.estimated_cloud_monthly_usd ? proposal.cost_breakdown.estimated_cloud_monthly_usd * 85 : 0)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">INR / month</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121215] border border-zinc-800">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Timeline</span>
                  <span className="text-xl font-semibold text-white font-mono mt-0.5 block">{proposal.sprint_plan.length}</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">Sprints ({weeks}w)</span>
                </div>
              </div>

              {/* Accessible ARIA Tab Navigation */}
              <div
                role="tablist"
                aria-label="Architecture and SOW Navigation"
                className="flex items-center gap-1 overflow-x-auto border-b border-zinc-800 pb-2 text-xs font-medium scrollbar-none"
              >
                {[
                  { id: 'summary', label: 'Executive Brief', icon: FileText },
                  { id: 'arch', label: 'Architecture Blueprint', icon: Layers },
                  { id: 'stack', label: 'Tech Stack Matrix', icon: Server },
                  { id: 'sprints', label: 'Sprint Roadmap', icon: Calendar },
                  { id: 'budget', label: 'Budget & Cloud', icon: DollarSign },
                  { id: 'terms', label: 'Commercial Terms', icon: Shield },
                  { id: 'export', label: 'Export SOW', icon: Download },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-selected={isSelected}
                      onClick={() => setActiveTab(t.id)}
                      className={`relative px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer text-xs ${
                        isSelected
                          ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Executive Summary */}
              {activeTab === 'summary' && (
                <div role="tabpanel" aria-labelledby="tab-summary" className="flex flex-col gap-4 animate-slide-up">
                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <h3 className="text-sm font-semibold text-white mb-2">{proposal.project_name} &bull; Executive Summary</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{proposal.executive_summary}</p>
                    <div className="mt-3 text-[11px] text-zinc-400">
                      Engine mode: <span className="font-mono text-zinc-200 font-medium px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60">{proposal.generation_mode}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-zinc-400" /> Key Architectural Decisions
                    </h4>
                    <div className="flex flex-col gap-2">
                      {proposal.key_architectural_decisions.map((dec, i) => (
                        <div key={i} className="text-xs text-zinc-300 flex items-start gap-2 bg-[#18181b] p-2.5 rounded-lg border border-zinc-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{dec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-zinc-400" /> Compliance Baseline
                      </h4>
                      <ul className="text-xs text-zinc-300 space-y-2">
                        {proposal.compliance_and_security.map((sec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-zinc-500">&bull;</span>
                            <span>{sec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> Risk Mitigation
                      </h4>
                      <ul className="text-xs text-zinc-300 space-y-2">
                        {proposal.key_risks_and_mitigations.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-zinc-500">&bull;</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Architecture Blueprint */}
              {activeTab === 'arch' && (
                <div role="tabpanel" aria-labelledby="tab-arch" className="flex flex-col gap-4 animate-slide-up">
                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-zinc-400" /> High-Contrast Architecture Diagram
                      </h3>
                      <span className="text-[10px] font-mono uppercase bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-300">
                        Zero-Fill Neutral
                      </span>
                    </div>
                    <MermaidViewer chart={proposal.mermaid_diagram} />
                  </div>

                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Architecture Layers Breakdown</h4>
                    <div className="space-y-2.5">
                      {proposal.architecture_layers.map((layer, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#18181b] border border-zinc-800 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-200">{layer.layer_name}</span>
                            <span className="text-[11px] text-zinc-400">{layer.description}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {layer.components.map((c, j) => (
                              <span key={j} className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {lastInput && (
                    <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Terminal ASCII Map</h4>
                      <pre className="text-[11px] font-mono bg-[#09090b] p-4 rounded-lg border border-zinc-800 text-zinc-300 overflow-x-auto whitespace-pre">
                        {buildAsciiDiagram(lastInput)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Tech Stack Matrix */}
              {activeTab === 'stack' && (
                <div role="tabpanel" aria-labelledby="tab-stack" className="p-5 rounded-xl bg-[#121215] border border-zinc-800 animate-slide-up">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-zinc-400" /> Production-Grade Stack Specification
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400">
                          <th className="py-2.5 px-3 font-medium">Category</th>
                          <th className="py-2.5 px-3 font-medium">Framework / Tool</th>
                          <th className="py-2.5 px-3 font-medium">Architectural Justification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {proposal.tech_stack.map((item, i) => (
                          <tr key={i} className="hover:bg-zinc-800/20">
                            <td className="py-2.5 px-3 font-medium text-zinc-200">{item.category}</td>
                            <td className="py-2.5 px-3 font-mono text-zinc-100">{item.technology_name}</td>
                            <td className="py-2.5 px-3 text-zinc-400">{item.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Sprint Roadmap */}
              {activeTab === 'sprints' && (
                <div role="tabpanel" aria-labelledby="tab-sprints" className="flex flex-col gap-3 animate-slide-up">
                  {proposal.sprint_plan.map((sprint) => (
                    <div key={sprint.sprint_number} className="p-4 rounded-xl bg-[#121215] border border-zinc-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center font-mono">
                            {sprint.sprint_number}
                          </span>
                          <span className="font-semibold text-sm text-white">{sprint.sprint_name}</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                          {sprint.duration_weeks} Weeks
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="font-medium text-zinc-300">Milestone:</span> {sprint.core_focus}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {sprint.deliverables.map((deliv, j) => (
                          <div key={j} className="text-xs text-zinc-300 flex items-start gap-2 bg-[#18181b] p-2 rounded-lg border border-zinc-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Budget & Cloud */}
              {activeTab === 'budget' && (
                <div role="tabpanel" aria-labelledby="tab-budget" className="flex flex-col gap-4 animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Engineering Effort Model</h4>
                      <div className="space-y-2 text-xs text-zinc-300">
                        <div className="flex justify-between py-1.5 border-b border-zinc-800">
                          <span>Total Scoped Hours:</span>
                          <span className="font-mono font-medium text-white">{proposal.cost_breakdown.total_engineering_hours} hrs</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-zinc-800">
                          <span>Blended Hourly Rate:</span>
                          <span className="font-mono font-medium text-zinc-200">
                            ₹{(proposal.cost_breakdown.blended_hourly_rate_inr || 2500).toLocaleString('en-IN')}/hr
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2">
                          <span className="font-medium text-white">Fixed-Price Total:</span>
                          <span className="font-mono font-semibold text-base text-zinc-100">
                            ₹{(proposal.cost_breakdown.total_development_cost_inr || (proposal.cost_breakdown.total_development_cost_usd ? proposal.cost_breakdown.total_development_cost_usd * 85 : 0)).toLocaleString('en-IN')} INR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Target Cloud Infrastructure</h4>
                      <div className="space-y-2 text-xs text-zinc-300">
                        <div className="flex justify-between py-1.5 border-b border-zinc-800">
                          <span>Cloud Provider:</span>
                          <span className="font-mono font-medium text-white">{cloud} (Mumbai)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-zinc-800">
                          <span>Monthly Estimated Burn:</span>
                          <span className="font-mono font-medium text-zinc-200">
                            ₹{(proposal.cost_breakdown.estimated_cloud_monthly_inr || (proposal.cost_breakdown.estimated_cloud_monthly_usd ? proposal.cost_breakdown.estimated_cloud_monthly_usd * 85 : 0)).toLocaleString('en-IN')} / mo
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2">
                          <span className="font-medium text-white">SLA Baseline:</span>
                          <span className="font-mono font-medium text-zinc-200">99.9% Uptime Guarantee</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Itemized Monthly Cloud Infrastructure</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-400">
                            <th className="py-2 px-3 font-medium">Resource / Tier</th>
                            <th className="py-2 px-3 text-right font-medium">Estimated Cost (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-mono">
                          {Object.entries(proposal.cost_breakdown.cloud_cost_items).map(([k, v]) => (
                            <tr key={k}>
                              <td className="py-2 px-3 text-zinc-300 font-sans">{k}</td>
                              <td className="py-2 px-3 text-right text-zinc-200">₹{v.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Commercial Terms & SOW */}
              {activeTab === 'terms' && (
                <div role="tabpanel" aria-labelledby="tab-terms" className="flex flex-col gap-4 animate-slide-up">
                  {(() => {
                    const totalDev = proposal.cost_breakdown.total_development_cost_inr || (proposal.cost_breakdown.total_development_cost_usd ? proposal.cost_breakdown.total_development_cost_usd * 85 : 0);
                    const deposit = Math.round(totalDev * 0.3);
                    const midpoint = Math.round(totalDev * 0.4);
                    const finalDelivery = totalDev - deposit - midpoint;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">1. Upfront Deposit (30%)</span>
                          <span className="text-lg font-mono font-semibold text-zinc-100 mt-1 block">
                            ₹{deposit.toLocaleString('en-IN')} INR
                          </span>
                          <span className="text-xs text-zinc-400 mt-0.5 block">Upon SOW signing & kickoff</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">2. Mid-Point Milestone (40%)</span>
                          <span className="text-lg font-mono font-semibold text-zinc-100 mt-1 block">
                            ₹{midpoint.toLocaleString('en-IN')} INR
                          </span>
                          <span className="text-xs text-zinc-400 mt-0.5 block">Upon Sprint 3 & Core API demo</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">3. Final Delivery (30%)</span>
                          <span className="text-lg font-mono font-semibold text-zinc-100 mt-1 block">
                            ₹{finalDelivery.toLocaleString('en-IN')} INR
                          </span>
                          <span className="text-xs text-zinc-400 mt-0.5 block">Upon staging cutover & sign-off</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Commercial Clauses & Legal Protections</h4>
                    <div className="p-3 rounded-lg bg-[#18181b] border border-zinc-800 text-xs text-zinc-300">
                      <span className="font-semibold text-white block mb-0.5">Intellectual Property Ownership:</span>
                      {proposal.commercial_terms.intellectual_property_clause}
                    </div>
                    <div className="p-3 rounded-lg bg-[#18181b] border border-zinc-800 text-xs text-zinc-300">
                      <span className="font-semibold text-white block mb-0.5">Warranty & Post-Launch Support:</span>
                      AutoScope provides {proposal.commercial_terms.warranty_days} calendar days of complimentary bug fixing and SLA monitoring.
                    </div>
                    <div className="p-3 rounded-lg bg-[#18181b] border border-zinc-800 text-xs text-zinc-300">
                      <span className="font-semibold text-white block mb-0.5">Change Order Policy:</span>
                      {proposal.commercial_terms.change_order_policy}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Proposal Export */}
              {activeTab === 'export' && (
                <div role="tabpanel" aria-labelledby="tab-export" className="flex flex-col gap-4 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadMarkdown}
                      className="px-4 py-2 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Download Statement of Work (.md)
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="px-4 py-2 rounded-lg font-medium text-xs text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy SOW Text'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Statement of Work Preview</h4>
                    <pre className="text-xs font-mono bg-[#09090b] p-4 rounded-lg border border-zinc-800 text-zinc-300 max-h-[420px] overflow-y-auto whitespace-pre-wrap">
                      {exportProposalMarkdown(proposal)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modern Open-Source Enterprise Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#09090b] py-4 px-6 mt-auto z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
            <span className="font-semibold text-zinc-200">AutoScope AI</span>
            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
            <span>Autonomous Cloud Solutions Architect & Commercial Statement of Work (SOW) Synthesizer</span>
            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
            <span className="text-zinc-500 font-mono text-[11px]">Production Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/TANMAY4806w/cynbit-autoscope-ai"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="text-zinc-700">&bull;</span>
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              API Docs
            </a>
            <span className="text-zinc-700">&bull;</span>
            <span className="text-zinc-500 font-mono text-[11px]">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
