export interface ClientInput {
  project_name: string;
  client_industry: string;
  vision_description: string;
  voice_transcript?: string;
  target_audience: string;
  concurrency_tier: string;
  compliance_tags: string[];
  preferred_cloud: string;
  budget_tier: string;
  target_timeline_weeks: number;
}

export interface TechStackItem {
  category: string;
  technology_name: string;
  rationale: string;
}

export interface ArchitectureLayer {
  layer_name: string;
  components: string[];
  description: string;
}

export interface SprintMilestone {
  sprint_number: number;
  sprint_name: string;
  duration_weeks: number;
  deliverables: string[];
  core_focus: string;
}

export interface CostBreakdown {
  total_engineering_hours: number;
  currency?: string;
  currency_symbol?: string;
  blended_hourly_rate_inr: number;
  total_development_cost_inr: number;
  estimated_cloud_monthly_inr: number;
  cloud_cost_items: Record<string, number>;
  blended_hourly_rate_usd?: number;
  total_development_cost_usd?: number;
  estimated_cloud_monthly_usd?: number;
}

export interface CommercialTerms {
  deposit_percentage: number;
  milestone_percentage: number;
  final_percentage: number;
  warranty_days: number;
  intellectual_property_clause: string;
  change_order_policy: string;
}

export interface ArchitectureProposal {
  project_name: string;
  client_industry: string;
  executive_summary: string;
  key_architectural_decisions: string[];
  architecture_layers: ArchitectureLayer[];
  tech_stack: TechStackItem[];
  mermaid_diagram: string;
  sprint_plan: SprintMilestone[];
  cost_breakdown: CostBreakdown;
  commercial_terms: CommercialTerms;
  compliance_and_security: string[];
  key_risks_and_mitigations: string[];
  generation_mode: string;
  generated_at: string;
}
