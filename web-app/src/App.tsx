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
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { ClientInput, ArchitectureProposal } from './types/proposal';
import { generateProposal, exportProposalMarkdown, buildAsciiDiagram } from './services/proposalEngine';
import { MermaidViewer } from './components/MermaidViewer';

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
    budget_tier: 'Growth ($10k - $25k)',
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
    budget_tier: 'Enterprise ($25k - $50k)',
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
    budget_tier: 'Growth ($10k - $25k)',
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
    budget_tier: 'Growth ($10k - $25k)',
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
      a.download = `${proposal.project_name.toLowerCase().replace(/\s+/g, '_')}_cynbit_sow.md`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Cynbit AutoScope AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950 border border-teal-700/60 text-teal-300">
                  Production Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Technical Scoping & Commercial SOW Engine &bull;{' '}
                <a href="https://cynbit.in" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-0.5">
                  cynbit.in <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
              Applicant: <span className="font-semibold text-white">Tanmay Patil</span>
            </div>
            <a
              href="https://www.cynbit.in/candidate/cmwovenwx000708jnepnj4974"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              Candidate Portal <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client Scoping Intake */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/20 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-400" />
                Technical Scoping Intake
              </h2>
              <span className="text-xs text-slate-400">Step 1 of 2</span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                ⚡ 1-Click Client Presets
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Object.keys(PRESETS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Name & Industry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Industry Vertical</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Healthcare</option>
                  <option>FinTech</option>
                  <option>E-Commerce</option>
                  <option>SaaS & AI</option>
                  <option>EdTech & Developer Tools</option>
                  <option>Logistics & IoT</option>
                </select>
              </div>
            </div>

            {/* Vision Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Vision & Requirements</label>
                <span className="text-[11px] text-teal-400 flex items-center gap-1">
                  <Mic className="h-3 w-3" /> Voice Intake Ready
                </span>
              </div>
              <textarea
                rows={4}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans resize-none"
                placeholder="Paste client inquiry or meeting notes..."
              />
            </div>

            {/* Concurrency & Cloud */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Scale / DAU</label>
                <select
                  value={concurrency}
                  onChange={(e) => setConcurrency(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Low (&lt; 1,000 DAU)</option>
                  <option>Medium (1k - 10k DAU)</option>
                  <option>High (10k - 50k DAU)</option>
                  <option>Enterprise (&gt; 100k DAU)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Target Cloud</label>
                <select
                  value={cloud}
                  onChange={(e) => setCloud(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>AWS</option>
                  <option>GCP</option>
                  <option>Azure</option>
                  <option>Hybrid / Multi-Cloud</option>
                </select>
              </div>
            </div>

            {/* Timeline Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <span>Target Timeline</span>
                <span className="text-teal-400 font-mono text-sm">{weeks} Weeks</span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            {/* Compliance Checkboxes */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Compliance & Security Standards
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HIPAA', 'GDPR', 'SOC2', 'PCI-DSS'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCompliance(tag)}
                    className={`py-2 px-3 rounded-lg border font-medium transition-all text-left flex items-center justify-between ${
                      compliance.includes(tag)
                        ? 'bg-teal-950/80 border-teal-500 text-teal-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span>{tag}</span>
                    {compliance.includes(tag) && <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional API Key Input */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                OpenRouter API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-... (defaults to preconfigured key)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Zero-API Fallback: Runs instantly via the built-in Deterministic Expert Engine if no key is entered.
              </p>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="mt-2 w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Architecture & SOW...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Synthesize Architecture & SOW (90s)</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Output Tabs & SOW Results */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          {!proposal ? (
            <div className="h-full min-h-[500px] rounded-2xl bg-slate-900/40 border border-slate-800/80 border-dashed flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="h-16 w-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4 text-teal-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-300 mb-1">Awaiting Technical Input</h3>
              <p className="text-sm max-w-md text-slate-400">
                Select a client scenario on the left or customize parameters, then click{' '}
                <span className="text-teal-400 font-semibold">Synthesize Architecture</span> to generate cloud diagrams, tech specs, sprint
                timelines, and a signed Statement of Work.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-slide-up">
              {/* Metrics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Dev Effort</span>
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {proposal.cost_breakdown.total_engineering_hours}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">hours</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Fixed SOW Cost</span>
                  <span className="text-2xl font-extrabold text-teal-400 font-mono">
                    ${proposal.cost_breakdown.total_development_cost_usd.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">USD</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Cloud Monthly</span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    ${proposal.cost_breakdown.estimated_cloud_monthly_usd.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">USD / month</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Timeline</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{proposal.sprint_plan.length}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">Sprints</span>
                </div>
              </div>

              {/* Accessible ARIA Tab Navigation (compliant with modern-web-guidance) */}
              <div
                role="tablist"
                aria-label="Architecture and SOW Navigation"
                className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 pb-2 text-xs font-semibold scrollbar-none"
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
                      className={`relative px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-600/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
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
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-2">{proposal.project_name} &bull; Executive Summary</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{proposal.executive_summary}</p>
                    <div className="mt-3 text-xs text-slate-400">
                      Engine mode: <span className="font-mono text-teal-400 font-semibold">{proposal.generation_mode}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-400" /> Key Architectural Decisions
                    </h4>
                    <div className="flex flex-col gap-2">
                      {proposal.key_architectural_decisions.map((dec, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{dec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-cyan-400" /> Compliance Baseline
                      </h4>
                      <ul className="text-xs text-slate-300 space-y-2">
                        {proposal.compliance_and_security.map((sec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400">&bull;</span>
                            <span>{sec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-400" /> Risk Mitigation
                      </h4>
                      <ul className="text-xs text-slate-300 space-y-2">
                        {proposal.key_risks_and_mitigations.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400">&bull;</span>
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
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="h-4 w-4 text-teal-400" /> High-Contrast Mermaid Architecture
                      </h3>
                      <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                        Zero-Fill Theme Safe
                      </span>
                    </div>
                    <MermaidViewer chart={proposal.mermaid_diagram} />
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3">Architecture Layers Breakdown</h4>
                    <div className="space-y-3">
                      {proposal.architecture_layers.map((layer, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-teal-300">{layer.layer_name}</span>
                            <span className="text-[11px] text-slate-400">{layer.description}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {layer.components.map((c, j) => (
                              <span key={j} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {lastInput && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-2">Terminal ASCII Map</h4>
                      <pre className="text-[11px] font-mono bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-teal-400 overflow-x-auto whitespace-pre">
                        {buildAsciiDiagram(lastInput)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Tech Stack Matrix */}
              {activeTab === 'stack' && (
                <div role="tabpanel" aria-labelledby="tab-stack" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 animate-slide-up">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-teal-400" /> Production-Grade Stack Specification
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Framework / Tool</th>
                          <th className="py-2.5 px-3">Architectural Justification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {proposal.tech_stack.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-800/20">
                            <td className="py-3 px-3 font-semibold text-teal-300">{item.category}</td>
                            <td className="py-3 px-3 font-mono text-white">{item.technology_name}</td>
                            <td className="py-3 px-3 text-slate-300">{item.rationale}</td>
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
                    <div key={sprint.sprint_number} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-teal-950 border border-teal-600 text-teal-300 text-xs font-bold flex items-center justify-center">
                            {sprint.sprint_number}
                          </span>
                          <span className="font-bold text-sm text-white">{sprint.sprint_name}</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                          ⏱️ {sprint.duration_weeks} Weeks
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Core Milestone:</span> {sprint.core_focus}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {sprint.deliverables.map((deliv, j) => (
                          <div key={j} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2 rounded-lg border border-slate-800/60">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
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
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-3">Engineering Effort Model</h4>
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between py-1.5 border-b border-slate-800">
                          <span>Total Scoped Hours:</span>
                          <span className="font-mono font-bold text-white">{proposal.cost_breakdown.total_engineering_hours} hrs</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-800">
                          <span>Blended Hourly Rate:</span>
                          <span className="font-mono font-bold text-teal-400">${proposal.cost_breakdown.blended_hourly_rate_usd}/hr</span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2">
                          <span className="font-bold text-white">Fixed-Price Total:</span>
                          <span className="font-mono font-extrabold text-base text-teal-400">
                            ${proposal.cost_breakdown.total_development_cost_usd.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-3">Target Cloud Infrastructure</h4>
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between py-1.5 border-b border-slate-800">
                          <span>Cloud Provider:</span>
                          <span className="font-mono font-bold text-white">{cloud}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-800">
                          <span>Monthly Estimated Burn:</span>
                          <span className="font-mono font-bold text-cyan-400">
                            ${proposal.cost_breakdown.estimated_cloud_monthly_usd.toLocaleString()} / mo
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2">
                          <span className="font-bold text-white">SLA Baseline:</span>
                          <span className="font-mono font-bold text-teal-400">99.9% Uptime Guarantee</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3">Itemized Monthly Cloud Infrastructure</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2 px-3">Resource / Tier</th>
                            <th className="py-2 px-3 text-right">Estimated Cost (USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {Object.entries(proposal.cost_breakdown.cloud_cost_items).map(([k, v]) => (
                            <tr key={k}>
                              <td className="py-2 px-3 text-slate-300 font-sans">{k}</td>
                              <td className="py-2 px-3 text-right text-teal-400">${v.toLocaleString()}</td>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">1. Upfront Deposit</span>
                      <span className="text-xl font-mono font-bold text-teal-400 mt-1 block">
                        ${Math.round(proposal.cost_breakdown.total_development_cost_usd * 0.3).toLocaleString()} USD
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block">30% upon SOW signing</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">2. Mid-Point Milestone</span>
                      <span className="text-xl font-mono font-bold text-teal-400 mt-1 block">
                        ${Math.round(proposal.cost_breakdown.total_development_cost_usd * 0.4).toLocaleString()} USD
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block">40% upon Sprint 3 & Core API demo</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">3. Final Delivery</span>
                      <span className="text-xl font-mono font-bold text-teal-400 mt-1 block">
                        ${Math.round(proposal.cost_breakdown.total_development_cost_usd * 0.3).toLocaleString()} USD
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block">30% upon staging cutover & sign-off</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white">Commercial Clauses & Legal Protections</h4>
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-white block mb-0.5">Intellectual Property Ownership:</span>
                      {proposal.commercial_terms.intellectual_property_clause}
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-white block mb-0.5">Warranty & Post-Launch Support:</span>
                      Cynbit provides {proposal.commercial_terms.warranty_days} calendar days of complimentary bug fixing and SLA monitoring.
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-white block mb-0.5">Change Order Policy:</span>
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
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-500 transition-all flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Download Statement of Work (.md)
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy SOW Text'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-2">Statement of Work Preview</h4>
                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 max-h-[420px] overflow-y-auto whitespace-pre-wrap">
                      {exportProposalMarkdown(proposal)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Built by <b>Tanmay Patil</b> for the <b>AI/ML Engineer Intern Assessment</b> at{' '}
            <a href="https://cynbit.in" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">
              Cynbit Technologies Private Limited
            </a>{' '}
            &bull; Jaipur, India
          </span>
          <span>Due: Wednesday, Nov 25, 2026, at 03:10 AM IST</span>
        </div>
      </footer>
    </div>
  );
}
