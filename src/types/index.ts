// Central type definitions. Pages and components render these shapes;
// content itself lives exclusively in src/data/*.

export interface NavItem {
  index: string; // "01"
  label: string;
  path: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: IconName;
}

export type IconName =
  | "bat"
  | "menu"
  | "close"
  | "arrow"
  | "arrowUp"
  | "external"
  | "github"
  | "linkedin"
  | "mail"
  | "play"
  | "pause"
  | "shield"
  | "cpu"
  | "eye"
  | "terminal"
  | "robot"
  | "chevronDown"
  | "chevronRight"
  | "signal"
  | "check"
  | "file";

export type ExperienceStatus = "current" | "completed" | "upcoming";

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  status: ExperienceStatus;
  summary: string;
  responsibilities: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  skills: { name: string; interest?: boolean }[];
}

export type ProjectCategory =
  | "ai"
  | "security"
  | "computer-vision"
  | "robotics"
  | "fullstack"
  | "mlops";

export interface ProjectMedia {
  video?: string;
  poster?: string;
}

export interface ProjectLinks {
  repository?: string;
  live?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory[];
  technologies: string[];
  status: string;
  impact: string;
  metrics?: { label: string; value: string }[];
  year?: string;
  media: ProjectMedia;
  links: ProjectLinks;
  featured: boolean;
  problem?: string;
  solution?: string;
  outcome?: string;
}

export interface Service {
  id: string;
  code: string; // "MOD-01"
  title: string;
  problem: string;
  delivery: string[];
  suitedFor: string;
  outcome: string;
  tags: string[];
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date?: string;
  description?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  period: string;
  detail?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  url?: string;
  verified: boolean;
}

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  subtitleUrl?: string;
  period: string;
  description?: string;
  status?: ExperienceStatus;
  meta?: string;
}
