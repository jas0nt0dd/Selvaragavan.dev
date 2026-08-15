import type { ExperienceEntry } from "@/types";

// Employment start date for the Objectways Technologies role. The UI reads
// this to decide whether to display "Starting August 10, 2026" or
// "August 10, 2026 – Present", so the site stays accurate automatically.
export const OBJECTWAYS_START_DATE = new Date("2026-08-10T00:00:00");

export const experience: ExperienceEntry[] = [
  {
    id: "objectways",
    role: "Gen AI Engineer",
    company: "Objectways Technologies",
    companyUrl: "https://objectways.com/",
    period: "August 10, 2026 – Present",
    status: "current",
    summary: "Working on generative AI engineering initiatives.",
    responsibilities: [
      "Design and implement generative AI applications using modern LLM frameworks.",
      "Develop agentic AI systems with autonomous planning and tool-orchestration capabilities.",
      "Build scalable AI-powered solutions integrated with enterprise applications.",
      "Develop and optimize RAG pipelines using vector databases and embeddings.",
      "Evaluate model performance and implement responsible AI practices.",
      "Collaborate with engineering teams to integrate AI services into business workflows.",
      "Participate in architecture design and technical reviews."
    ]
  },
  {
    id: "robential",
    role: "Robotic Engineer",
    company: "Robential Kinetics Pvt. Ltd.",
    period: "December 2025 – Present",
    status: "current",
    summary: "Connecting AI perception to physical hardware.",
    responsibilities: [
      "Integrate sensors, control logic, and hardware into automation systems.",
      "Build computer-vision workflows for real-time robotic operation.",
      "Work with robotic arms, Arduino / embedded systems, serial communication, and actuator control.",
      "Develop and deploy automation workflows that connect AI perception to physical hardware."
    ]
  }
];
