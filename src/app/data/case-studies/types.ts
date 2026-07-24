export interface ArchitectureNode {
  id: string;
  label: string;
  group?: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CaseStudySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CaseStudyDecision {
  question: string;
  answer: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  type: string;
  stack: string[];
  links: CaseStudyLink[];
  problem: CaseStudySection;
  role: CaseStudySection;
  architecture: {
    summary: string;
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
    /** Mermaid source kept for reference / future tooling */
    mermaid: string;
  };
  decisions: CaseStudyDecision[];
  shipped: CaseStudySection;
  challenges: CaseStudySection;
  lessons: CaseStudySection;
  roadmap?: CaseStudySection;
}
