import type {
  ClientInput,
  ArchitectureProposal,
  ArchitectureLayer,
  TechStackItem,
  CostBreakdown,
  SprintMilestone,
  CommercialTerms,
} from '../types/proposal';

export function buildMermaidDiagram(input: ClientInput): string {
  const hasHipaa = input.compliance_tags.some((t) => t.toLowerCase().includes('hipaa'));
  const hasGdpr = input.compliance_tags.some((t) => t.toLowerCase().includes('gdpr'));
  const cloud = input.preferred_cloud || 'AWS';

  const lines = [
    'flowchart TD',
    '    subgraph Ingress ["1. Client & Ingress Tier"]',
    '        WebClient["Web Client (Next.js / React)"]',
    '        MobileClient["Mobile App (React Native / Flutter)"]',
    '        APIGateway["API Gateway & Reverse Proxy (Kong / Cloudflare)"]',
    '        WebClient --> APIGateway',
    '        MobileClient --> APIGateway',
    '    end',
    '',
    '    subgraph CoreServices ["2. Application & Compute Tier"]',
    '        AuthService["Auth & IAM Service (OAuth2 / JWT)"]',
    '        BusinessAPI["Core Application API (FastAPI / Python)"]',
    '        WorkerQueue["Task Worker & Async Queue (Celery / Redis)"]',
    '        APIGateway --> AuthService',
    '        APIGateway --> BusinessAPI',
    '        BusinessAPI --> WorkerQueue',
    '    end',
    '',
    '    subgraph AIService ["3. AI & Vector Engine"]',
    '        LLMOrchestrator["Orchestrator (LangGraph / DSPy)"]',
    '        VectorDB["Vector Database (Qdrant / pgvector)"]',
    '        ModelInference["LLM Inference (OpenRouter / Groq)"]',
    '        BusinessAPI --> LLMOrchestrator',
    '        LLMOrchestrator --> VectorDB',
    '        LLMOrchestrator --> ModelInference',
    '    end',
    '',
    '    subgraph Persistence ["4. Storage & Persistence Tier"]',
    '        PrimaryDB[("Primary DB (PostgreSQL 16)")]',
    '        CacheTier[("Cache Layer (Redis 7.2)")]',
    '        BlobStorage[("Object Storage (S3 / Cloud Storage)")]',
    '        BusinessAPI --> PrimaryDB',
    '        BusinessAPI --> CacheTier',
    '        WorkerQueue --> BlobStorage',
    '    end',
    '',
    `    subgraph Infra ["5. Cloud & Security Tier (${cloud})"]`,
    '        WAF["Web Application Firewall & TLS 1.3"]',
    '        Observability["Monitoring (Prometheus & Grafana)"]',
    '        CICD["CI/CD Pipeline (GitHub Actions & Docker)"]',
    '    end',
    '',
    '    APIGateway -.-> WAF',
    '    BusinessAPI -.-> Observability',
  ];

  if (hasHipaa) {
    lines.push('    PrimaryDB -.-> HIPAA["HIPAA Compliant At-Rest AES-256 Encryption"]');
  }
  if (hasGdpr) {
    lines.push('    PrimaryDB -.-> GDPR["GDPR Data Purge & Right-To-Forget Worker"]');
  }

  return lines.join('\n');
}

export function buildAsciiDiagram(input: ClientInput): string {
  const cloud = input.preferred_cloud || 'AWS';
  return `
+---------------------------------------------------------------+
|                 AUTOSCOPE ARCHITECTURE BLUEPRINT              |
|                   Project: ${input.project_name.padEnd(30)} |
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
                |           +---> [ LLM Reasoning: OpenRouter / Groq ]
                |
                +------> [ Async Task Workers (Celery / RabbitMQ) ]
                            |
                            +---> [ Object Storage (S3 Bucket / Encrypted) ]
    |
    v
[ Cloud Infrastructure: ${cloud} Managed Containers + CI/CD Automations ]
+---------------------------------------------------------------+
`;
}

export function calculateCostAndSprints(input: ClientInput): {
  cost: CostBreakdown;
  sprints: SprintMilestone[];
} {
  const scale = input.concurrency_tier.toLowerCase();
  let baseHours = 360;
  let cloudBase = 220;

  if (scale.includes('enterprise') || scale.includes('100k')) {
    baseHours = 640;
    cloudBase = 550;
  } else if (scale.includes('high') || scale.includes('50k')) {
    baseHours = 480;
    cloudBase = 350;
  } else if (scale.includes('low') || scale.includes('1k')) {
    baseHours = 260;
    cloudBase = 120;
  }

  let complianceHours = 0;
  let complianceCloud = 0;

  for (const tag of input.compliance_tags) {
    const t = tag.toLowerCase();
    if (t.includes('hipaa')) {
      complianceHours += 50;
      complianceCloud += 80;
    } else if (t.includes('gdpr')) {
      complianceHours += 35;
      complianceCloud += 40;
    } else if (t.includes('soc2')) {
      complianceHours += 45;
      complianceCloud += 60;
    } else if (t.includes('pci')) {
      complianceHours += 50;
      complianceCloud += 90;
    }
  }

  const totalHours = baseHours + complianceHours;
  const hourlyRateInr = 2500;
  const totalCostInr = totalHours * hourlyRateInr;

  const cloudItems: Record<string, number> = {
    [`Compute Cluster (${input.preferred_cloud} Mumbai)`]: Math.round(cloudBase * 35),
    'Managed PostgreSQL DB (Multi-AZ)': Math.round(cloudBase * 22),
    'Redis Cache Tier': Math.round(cloudBase * 9),
    'Vector DB / Semantic Search': Math.round(cloudBase * 12),
    'LLM Token Inference Budget': 5000,
    'Storage & Network Egress': Math.round(cloudBase * 8),
  };

  if (complianceCloud > 0) {
    cloudItems['Security & Audit Logging Compliance Tier'] = Math.round(complianceCloud * 85);
  }

  const monthlyCloudInr = Object.values(cloudItems).reduce((a, b) => a + b, 0);

  const cost: CostBreakdown = {
    total_engineering_hours: totalHours,
    currency: 'INR',
    currency_symbol: '₹',
    blended_hourly_rate_inr: hourlyRateInr,
    total_development_cost_inr: totalCostInr,
    estimated_cloud_monthly_inr: monthlyCloudInr,
    cloud_cost_items: cloudItems,
    blended_hourly_rate_usd: 45,
    total_development_cost_usd: Math.round(totalCostInr / 85),
    estimated_cloud_monthly_usd: Math.round(monthlyCloudInr / 85),
  };

  const weeks = input.target_timeline_weeks;
  const numSprints = Math.max(3, Math.min(6, Math.floor(weeks / 2)));
  const sprintDuration = Math.max(1, Math.floor(weeks / numSprints));

  const sprints: SprintMilestone[] = [
    {
      sprint_number: 1,
      sprint_name: 'Foundation, Data Modeling & Ingress',
      duration_weeks: sprintDuration,
      deliverables: [
        'Git repository architecture & Docker container baseline',
        'PostgreSQL schema migration & ACID entity definitions',
        'OAuth2/JWT authentication service & RBAC policies',
        'API Gateway & reverse proxy routing setup',
      ],
      core_focus: 'System backbone, security posture, and database schema',
    },
    {
      sprint_number: 2,
      sprint_name: 'Core Business Logic & API Microservices',
      duration_weeks: sprintDuration,
      deliverables: [
        'High-performance FastAPI CRUD microservices',
        'Redis caching integration for sub-50ms read latency',
        'Async task processing with Celery & message broker',
        'Automated Pytest coverage suite (>80% unit pass)',
      ],
      core_focus: 'Core functional domain workflows and service boundaries',
    },
    {
      sprint_number: 3,
      sprint_name: 'AI Pipeline, RAG & Vector Intelligence',
      duration_weeks: sprintDuration,
      deliverables: [
        'Vector database setup (Qdrant/pgvector) with indexing',
        'Chunking, embedding generation & semantic retriever',
        'LLM reasoning agent orchestration with fallback loops',
        'Prompt guardrails and structured JSON output validation',
      ],
      core_focus: 'Autonomous AI capabilities, retrieval, and model inference',
    },
    {
      sprint_number: 4,
      sprint_name: 'Frontend UI & Client Interaction',
      duration_weeks: sprintDuration,
      deliverables: [
        'Modern responsive Web Application (Next.js / React)',
        'State management & live API client integration',
        'Mobile-optimized adaptive layout and accessibility',
        'End-to-end integration and smoke test runs',
      ],
      core_focus: 'User interface, interactive forms, and client journey',
    },
  ];

  if (numSprints >= 5) {
    sprints.push({
      sprint_number: 5,
      sprint_name: 'Compliance Hardening & Load Testing',
      duration_weeks: sprintDuration,
      deliverables: [
        'Compliance validation (Audit logs, encryption at rest)',
        'Locust stress testing up to targeted concurrency',
        'Disaster recovery and automated backup snapshot schedule',
        'Penetration testing and vulnerability scanning',
      ],
      core_focus: 'Production hardening, compliance verification, and scale testing',
    });
  }

  if (numSprints >= 6) {
    sprints.push({
      sprint_number: 6,
      sprint_name: 'Production Deployment & Founder Handoff',
      duration_weeks: sprintDuration,
      deliverables: [
        `Production rollout on ${input.preferred_cloud} with CI/CD`,
        'Prometheus & Grafana alerting dashboards',
        'OpenAPI/Swagger live documentation handoff',
        'Client stakeholder sign-off and warranty kick-off',
      ],
      core_focus: 'Zero-downtime deployment, monitoring, and final delivery',
    });
  }

  return { cost, sprints };
}

export function getDeterministicArchitecture(input: ClientInput): {
  executive_summary: string;
  key_architectural_decisions: string[];
  architecture_layers: ArchitectureLayer[];
  tech_stack: TechStackItem[];
  compliance_and_security: string[];
  key_risks_and_mitigations: string[];
} {
  const ind = input.client_industry.toLowerCase();
  const cloud = input.preferred_cloud || 'AWS';
  const hasHipaa = input.compliance_tags.some((t) => t.toLowerCase().includes('hipaa'));

  if (ind.includes('health') || ind.includes('med') || hasHipaa) {
    return {
      executive_summary: `HIPAA-compliant, highly secure medical intelligence platform for ${input.project_name}. Engineered with end-to-end encryption, strict access isolation, and asynchronous clinical triage.`,
      key_architectural_decisions: [
        'FastAPI microservices running in isolated Docker containers with automated mTLS inter-service communication',
        'Multi-tenant PostgreSQL 16 with Row-Level Security (RLS) and AES-256 encrypted tablespaces',
        'Qdrant vector database for semantic search across clinical documentation and patient histories',
        'Redis 7.2 cluster for sub-10ms session cache and token-bucket API rate limiting',
        'Isolated BAA-compliant cloud storage with automated disaster recovery and point-in-time snapshots',
      ],
      architecture_layers: [
        {
          layer_name: '1. Ingress & Client Tier',
          components: ['Next.js 14 Clinical Portal', 'React Native Mobile App', 'Cloudflare WAF / Kong Gateway'],
          description: 'TLS 1.3 secured entry point with rate limiting and DDoS mitigation.',
        },
        {
          layer_name: '2. Application & API Core',
          components: ['Auth Service (OAuth2 + MFA)', 'Clinical Triage Service (FastAPI)', 'Celery Worker Queue'],
          description: 'Stateless business logic handling user requests and asynchronous jobs.',
        },
        {
          layer_name: '3. AI & Clinical Knowledge Engine',
          components: ['Vector DB (Qdrant)', 'RAG Embedding Pipeline', 'Clinical Agent Reasoner'],
          description: 'Semantic search, contextual retrieval, and generative clinical triage.',
        },
        {
          layer_name: '4. Persistence & Audit Tier',
          components: ['PostgreSQL 16 (Multi-AZ)', 'Redis 7.2 Cluster', 'Encrypted S3 Patient Vault'],
          description: 'ACID compliance with immutable HIPAA audit trail logging.',
        },
        {
          layer_name: `5. Cloud Infrastructure (${cloud})`,
          components: ['ECS Fargate Containers', 'Prometheus & Grafana Alerting', 'GitHub Actions CI/CD'],
          description: `Serverless container orchestration compliant with BAA standards on ${cloud}.`,
        },
      ],
      tech_stack: [
        { category: 'Frontend', technology_name: 'Next.js 14 + TailwindCSS', rationale: 'Server-rendered clinical web interface with high accessibility' },
        { category: 'Mobile App', technology_name: 'React Native / Flutter', rationale: 'Cross-platform mobile app for patient and doctor portals' },
        { category: 'Backend API', technology_name: 'FastAPI (Python 3.12)', rationale: 'Asynchronous high-throughput REST API with native Pydantic validation' },
        { category: 'Primary DB', technology_name: 'PostgreSQL 16 (Multi-AZ)', rationale: 'ACID relational database with Row-Level Security for patient records' },
        { category: 'Vector DB', technology_name: 'Qdrant Cloud', rationale: 'Sub-10ms semantic retrieval over medical literature and logs' },
        { category: 'Cache & Queue', technology_name: 'Redis 7.2 + Celery', rationale: 'In-memory session store and asynchronous background task processor' },
        { category: 'Cloud & Infra', technology_name: `${cloud} ECS Fargate`, rationale: `Serverless container orchestration compliant with BAA standards on ${cloud}` },
      ],
      compliance_and_security: [
        'End-to-end TLS 1.3 encryption across all client and internal service communication',
        'Business Associate Agreement (BAA) with cloud providers and PHI de-identification',
        'Role-Based Access Control (RBAC) with fine-grained permission enforcement',
        'Encrypted database storage at rest using AES-256',
        'Tamper-proof immutable audit logs stored in isolated S3 Glacier vault',
      ],
      key_risks_and_mitigations: [
        'Risk: LLM hallucination in clinical queries. Mitigation: Strict RAG grounding with source citation and confidence threshold cutoff.',
        'Risk: Data privacy breach. Mitigation: Automatic PHI anonymization pipeline before sending prompts to LLM endpoints.',
      ],
    };
  }

  return {
    executive_summary: `Enterprise AI platform architecture for ${input.project_name}. Combines modern microservices, RAG vector intelligence, multi-tenant RBAC, and automated CI/CD deployment.`,
    key_architectural_decisions: [
      'Microservices architecture with FastAPI backend and Next.js frontend',
      'Multi-tenant data isolation with PostgreSQL schemas and Redis session management',
      'Qdrant vector database paired with OpenRouter Llama-3.3-70B for low-latency agentic workflows',
      'Containerized deployment on Docker with automated GitHub Actions CI/CD pipelines',
    ],
    architecture_layers: [
      {
        layer_name: '1. Ingress & Client Tier',
        components: ['Web Client (Next.js)', 'Mobile Responsive View', 'Cloudflare WAF / API Gateway'],
        description: 'Secure ingress routing, SSL termination, and rate-limiting enforcement.',
      },
      {
        layer_name: '2. Application & API Core',
        components: ['Authentication Service', 'Core Business Microservices (FastAPI)', 'Worker Queue (Celery)'],
        description: 'Stateless business logic handling user requests and asynchronous jobs.',
      },
      {
        layer_name: '3. AI & Vector Intelligence',
        components: ['Vector DB (Qdrant)', 'RAG Embedding Pipeline', 'LLM Orchestration Agent'],
        description: 'Semantic search, contextual retrieval, and generative AI features.',
      },
      {
        layer_name: '4. Persistence & Cache Tier',
        components: ['PostgreSQL 16 (ACID)', 'Redis 7.2 Cluster', 'S3 Encrypted Object Store'],
        description: 'Persistent relational storage, fast in-memory caching, and document vaults.',
      },
      {
        layer_name: `5. Cloud Infrastructure (${cloud})`,
        components: ['Docker Container Cluster', 'Prometheus & Grafana Monitoring', 'GitHub Actions CI/CD'],
        description: `Automated build, test, and containerized deployment infrastructure on ${cloud}.`,
      },
    ],
    tech_stack: [
      { category: 'Frontend', technology_name: 'Next.js 14 + TailwindCSS', rationale: 'Clean, responsive enterprise SaaS UI with server-side rendering' },
      { category: 'Backend API', technology_name: 'FastAPI (Python 3.12)', rationale: 'Asynchronous REST & WebSocket backend for real-time interactions' },
      { category: 'Primary DB', technology_name: 'PostgreSQL 16', rationale: 'Reliable relational storage for tenant accounts and business metadata' },
      { category: 'Vector DB', technology_name: 'Qdrant Cloud', rationale: 'Fast vector embeddings storage for document Q&A and semantic agents' },
      { category: 'Cache & Queue', technology_name: 'Redis 7.2 + Celery', rationale: 'In-memory cache and background task queue for heavy processing' },
      { category: 'Cloud & Infra', technology_name: `${cloud} Managed Containers`, rationale: `Zero-friction automated deployment and monitoring on ${cloud}` },
    ],
    compliance_and_security: [
      'End-to-end TLS 1.3 encryption across all client and internal service communication',
      'Role-Based Access Control (RBAC) with fine-grained permission enforcement',
      'Encrypted database storage at rest using AES-256',
      'Regular automated database snapshots and disaster recovery procedures',
    ],
    key_risks_and_mitigations: [
      'Scope expansion during UI phase. Mitigation: Strict sprint deliverables and weekly milestone reviews.',
      'Third-party API rate limits. Mitigation: Circuit breaker patterns and intelligent exponential backoff caching.',
      'Database scale under peak traffic. Mitigation: Read-replica pool and aggressive Redis caching tier.',
    ],
  };
}

export async function generateProposal(
  input: ClientInput,
  openRouterKey?: string
): Promise<ArchitectureProposal> {
  const { cost, sprints } = calculateCostAndSprints(input);
  const mermaidDiagram = buildMermaidDiagram(input);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const commercialTerms: CommercialTerms = {
    deposit_percentage: 30,
    milestone_percentage: 40,
    final_percentage: 30,
    warranty_days: 60,
    intellectual_property_clause:
      '100% intellectual property (IP), source code, and design assets transfer to the client upon final payment receipt.',
    change_order_policy:
      'Scope expansions exceeding sprint parameters billed at ₹2,500/hour via written Change Order addendum.',
  };

  const key = openRouterKey || (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
  if (key) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/TANMAY4806w/cynbit-autoscope-ai',
          'X-Title': 'AutoScope AI',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: [
            {
              role: 'system',
              content:
                'You are the Principal Solutions Architect at AutoScope AI. Output valid JSON conforming strictly to executive_summary, key_architectural_decisions (array of strings), architecture_layers (array of {layer_name, components, description}), tech_stack (array of {category, technology_name, rationale}), compliance_and_security (array of strings), key_risks_and_mitigations (array of strings). Do not include markdown codeblocks.',
            },
            {
              role: 'user',
              content: `Project: ${input.project_name}\nIndustry: ${input.client_industry}\nVision: ${input.vision_description}\nScale: ${input.concurrency_tier}\nCompliance: ${input.compliance_tags.join(', ')}\nCloud: ${input.preferred_cloud}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 2500,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            project_name: input.project_name,
            client_industry: input.client_industry,
            executive_summary: parsed.executive_summary || 'Architecture blueprint generated by AutoScope AI.',
            key_architectural_decisions: parsed.key_architectural_decisions || [],
            architecture_layers: parsed.architecture_layers || [],
            tech_stack: parsed.tech_stack || [],
            mermaid_diagram: mermaidDiagram,
            sprint_plan: sprints,
            cost_breakdown: cost,
            commercial_terms: commercialTerms,
            compliance_and_security: parsed.compliance_and_security || [],
            key_risks_and_mitigations: parsed.key_risks_and_mitigations || [],
            generation_mode: 'OpenRouter (Llama-3.3-70B)',
            generated_at: now,
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  const dData = getDeterministicArchitecture(input);
  return {
    project_name: input.project_name,
    client_industry: input.client_industry,
    executive_summary: dData.executive_summary,
    key_architectural_decisions: dData.key_architectural_decisions,
    architecture_layers: dData.architecture_layers,
    tech_stack: dData.tech_stack,
    mermaid_diagram: mermaidDiagram,
    sprint_plan: sprints,
    cost_breakdown: cost,
    commercial_terms: commercialTerms,
    compliance_and_security: dData.compliance_and_security,
    key_risks_and_mitigations: dData.key_risks_and_mitigations,
    generation_mode: 'Deterministic Expert Engine (Offline / Zero-API Ready)',
    generated_at: now,
  };
}

export function exportProposalMarkdown(proposal: ArchitectureProposal): string {
  const terms = proposal.commercial_terms;
  const costs = proposal.cost_breakdown;

  const totalCost = costs.total_development_cost_inr || (costs.total_development_cost_usd ? costs.total_development_cost_usd * 85 : 0);
  const hourlyRate = costs.blended_hourly_rate_inr || 2500;
  const cloudMonthly = costs.estimated_cloud_monthly_inr || (costs.estimated_cloud_monthly_usd ? costs.estimated_cloud_monthly_usd * 85 : 0);

  const deposit = Math.round(totalCost * (terms.deposit_percentage / 100));
  const milestone = Math.round(totalCost * (terms.milestone_percentage / 100));
  const finalAmt = totalCost - deposit - milestone;

  const lines = [
    '# Technical Solution Architecture & Statement of Work (SOW)',
    `## Project: ${proposal.project_name}`,
    '**Service Provider:** AutoScope Engineering & Cloud Solutions Architecture  ',
    `**Inference Engine:** AutoScope AI Engine (\`${proposal.generation_mode}\`)  `,
    `**Date Generated:** ${proposal.generated_at}  `,
    `**Industry Vertical:** ${proposal.client_industry}  `,
    '',
    '---',
    '',
    '## 1. Executive Summary & Solution Blueprint',
    proposal.executive_summary,
    '',
    '### Key Architectural Decisions',
  ];

  for (const dec of proposal.key_architectural_decisions) {
    lines.push(`* **${dec}**`);
  }

  lines.push(
    '',
    '---',
    '',
    '## 2. Cloud System Architecture',
    '',
    '```mermaid',
    proposal.mermaid_diagram,
    '```',
    '',
    '---',
    '',
    '## 3. Production Technology Stack',
    '',
    '| Component Category | Technology Selected | Architectural Rationale |',
    '| :--- | :--- | :--- |'
  );

  for (const item of proposal.tech_stack) {
    lines.push(`| **${item.category}** | \`${item.technology_name}\` | ${item.rationale} |`);
  }

  lines.push(
    '',
    '---',
    '',
    '## 4. Milestone Sprint Roadmap & Acceptance Criteria',
    ''
  );

  for (const sprint of proposal.sprint_plan) {
    lines.push(
      `### Sprint ${sprint.sprint_number}: ${sprint.sprint_name} (${sprint.duration_weeks} Weeks)`,
      `**Core Milestone:** ${sprint.core_focus}  `,
      '**Key Deliverables & Acceptance Criteria:**'
    );
    for (const d of sprint.deliverables) {
      lines.push(`- [x] ${d}`);
    }
    lines.push('');
  }

  lines.push(
    '---',
    '',
    '## 5. Commercial Investment & Payment Schedule',
    '',
    `* **Total Scoped Effort:** \`${costs.total_engineering_hours} Engineering Hours\``,
    `* **Blended Rate:** \`₹${hourlyRate.toLocaleString('en-IN')} / hour (Development, DevOps, AI, QA)\``,
    `* **Total Fixed-Price Investment:** **₹${totalCost.toLocaleString('en-IN')} INR**`,
    `* **Estimated Monthly Cloud Burn:** **₹${cloudMonthly.toLocaleString('en-IN')} INR/month**`,
    '',
    '### Milestone Payment Schedule',
    '| Payment Gate | Percentage | Amount (INR) | Trigger Event |',
    '| :--- | :---: | :---: | :--- |',
    `| **1. Upfront Deposit** | ${terms.deposit_percentage}% | **₹${deposit.toLocaleString('en-IN')}** | Project kickoff & repository provisioning |`,
    `| **2. Mid-Point Milestone** | ${terms.milestone_percentage}% | **₹${milestone.toLocaleString('en-IN')}** | Sprint 3 completion & Core API demo |`,
    `| **3. Final Delivery** | ${terms.final_percentage}% | **₹${finalAmt.toLocaleString('en-IN')}** | Staging sign-off & production cutover |`,
    '',
    '### Itemized Cloud Infrastructure Burn',
    '| Cloud Service / Resource | Estimated Monthly Burn (INR) |',
    '| :--- | :--- |'
  );

  for (const [k, v] of Object.entries(costs.cloud_cost_items)) {
    lines.push(`| ${k} | \`₹${v.toLocaleString('en-IN')}\` |`);
  }

  lines.push(
    '',
    '---',
    '',
    '## 6. Commercial Terms & Legal Protections',
    '',
    `* **Intellectual Property (IP):** ${terms.intellectual_property_clause}`,
    `* **Post-Launch Warranty:** AutoScope provides \`${terms.warranty_days} calendar days\` of complimentary bug-fixing and SLA monitoring following production delivery.`,
    `* **Scope Management:** ${terms.change_order_policy}`,
    '',
    '### Compliance & Security Baseline'
  );

  for (const c of proposal.compliance_and_security) {
    lines.push(`- 🔒 ${c}`);
  }

  lines.push(
    '',
    '### Technical Risk Mitigation'
  );

  for (const r of proposal.key_risks_and_mitigations) {
    lines.push(`- ⚠️ ${r}`);
  }

  lines.push(
    '',
    '---',
    '',
    '## 7. Signatures & Authorization',
    '',
    '```text',
    'Accepted & Agreed for Client:               Accepted for AutoScope Solutions:',
    'Signature: ______________________          Signature: ______________________',
    'Name:      ______________________          Name:      Principal Architect / Engineering Lead',
    'Title:     ______________________          Title:     Head of Cloud Solutions',
    'Date:      ______________________          Date:      ______________________',
    '```',
    '',
    '> *Generated autonomously by AutoScope AI — Autonomous Cloud Solutions Architect & SOW Synthesizer.*'
  );

  return lines.join('\n');
}
