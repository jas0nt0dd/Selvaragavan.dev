import type { Award, EducationEntry, Certification } from "@/types";

export const awards: (Award & { color?: string })[] = [
  {
    id: "eureka-bughunt",
    title: "1st Place — Eureka Bug Bounty",
    organization: "IIT BHU Varanasi",
    description: "First place in the Eureka Bug Bounty competition.",
    color: "#C4172B"
  },
  {
    id: "aws-campus",
    title: "Top 20 — AWS Campus Hackathon",
    organization: "IIT Kanpur / Techkriti '26",
    color: "#FF9900"
  },
  {
    id: "ai-tool-dev",
    title: "Finalist — AI Tool Dev Challenge 2.0",
    organization: "with PolicyLens AI",
    description: "Finalist placement with the PolicyLens AI civic-tech submission.",
    color: "#6366F1"
  },
  {
    id: "vista-codefest",
    title: "Top 30 — Vista Codefest '26",
    organization: "Computer Vision track · Kaggle / IIT BHU",
    color: "#06B6D4"
  },
  {
    id: "enigma-codefest",
    title: "Top 30 — Enigma Codefest '26",
    organization: "ML & Algorithmic track · Kaggle / IIT BHU",
    color: "#8B5CF6"
  },
  {
    id: "mlops-score",
    title: "0.9625 Average Score",
    organization: "MLOps Incident Response Environment",
    description: "Average evaluation score achieved across all four difficulty tiers.",
    color: "#14B8A6"
  }
];

export const education: EducationEntry[] = [
  {
    id: "kathir",
    degree: "B.Tech — Artificial Intelligence and Data Science",
    institution: "Kathir College of Engineering",
    period: "2023 – 2027",
    detail: "CGPA: 7.8"
  }
];

// Certificate/verification links were not present in the supplied source.
// Cards stay hidden from the credentials wall until a `url` is added here —
// see the "verified" flag consumed by the EvidenceCard component.
export const certifications: Certification[] = [
  { id: "aws", title: "AWS — certification on file", issuer: "AWS", verified: false },
  { id: "udemy", title: "Udemy — certification on file", issuer: "Udemy", verified: false },
  { id: "iit-madras", title: "IIT Madras — certification on file", issuer: "IIT Madras", verified: false },
  { id: "wadhwani", title: "Wadhwani Foundation — certification on file", issuer: "Wadhwani Foundation", verified: false },
  { id: "lesuccess", title: "LeSuccess — certification on file", issuer: "LeSuccess", verified: false },
  { id: "amypo", title: "Amypo Technologies — certification on file", issuer: "Amypo Technologies", verified: false }
];
