import type { Project } from "@/types";

// Drop matching video/poster files into public/assets/projects/ using the
// exact filenames referenced below and they will appear automatically —
// no component changes required. See public/assets/projects/README.md.

export const projects: Project[] = [
  {
    id: "armurai",
    slug: "armurai-autonomous-pentesting",
    title: "ArmurAI — Autonomous Pentesting Framework",
    shortDescription:
      "A fully autonomous AI-powered penetration-testing framework chaining five security tools with zero manual intervention.",
    fullDescription:
      "A fully autonomous AI-powered penetration-testing framework with GUI, Rich TUI, and CLI interfaces. It intelligently chains five security tools — including Nmap, Gobuster, Nikto, an AI analyzer, and an orchestration agent — with zero manual intervention. It uses a 3.56GB local LLM with GPU acceleration and spans more than 2,000 lines across 13 files.",
    problem: "Manual penetration-testing workflows require an operator to run and interpret each tool in sequence.",
    solution:
      "An orchestration agent chains reconnaissance, enumeration and vulnerability scanning tools, then routes findings through a locally-hosted LLM analyzer for triage — all without manual intervention.",
    outcome: "A single autonomous run replaces a multi-tool manual workflow across GUI, TUI and CLI interfaces.",
    category: ["security", "ai"],
    technologies: ["Python", "llama.cpp", "CustomTkinter", "Rich", "Nmap", "Local LLM", "LangGraph"],
    status: "Active",
    impact: "2,000+ lines across 13 files · zero manual intervention",
    metrics: [
      { label: "Tools chained", value: "5" },
      { label: "Local model", value: "3.56GB" },
      { label: "Codebase", value: "2,000+ lines / 13 files" }
    ],
    media: {
      poster: "/assets/projects/armurai-poster.jpg"
    },
    links: { repository: "https://github.com/jas0nt0dd/pentest-ai-" },
    featured: true
  },
  {
    id: "gnn-malware",
    slug: "gnn-malware-detector",
    title: "GNN Malware Detector",
    shortDescription:
      "A graph-neural-network system that converts PE binaries into call graphs and classifies them for malware.",
    fullDescription:
      "A graph-neural-network malware detection system that converts PE binaries into NetworkX directed graphs through static analysis and API-call extraction. GCN and GAT architectures classify the resulting graphs, supported by a GUI, CLI, and auditable accuracy, precision, recall, and F1 evaluation metrics.",
    problem: "Signature-based malware detection struggles against obfuscated or novel binaries.",
    solution:
      "Static analysis extracts API-call graphs from PE binaries; GCN and GAT graph-neural-network architectures classify structural behavior rather than static signatures.",
    outcome: "A reproducible, auditable classification pipeline with tracked accuracy, precision, recall and F1.",
    category: ["security", "ai"],
    technologies: ["PyTorch", "PyTorch Geometric", "pefile", "NetworkX", "GCN", "GAT"],
    status: "Active",
    impact: "Graph-based classification with full evaluation-metric auditability",
    media: {
      poster: "/assets/projects/gnn-malware-poster.jpg"
    },
    links: { repository: "https://github.com/jas0nt0dd/gnn-malware-detection-" },
    featured: true
  },
  {
    id: "mlops-incident",
    slug: "mlops-incident-response-environment",
    title: "MLOps Incident Response Environment",
    shortDescription:
      "An OpenEnv environment built for the Meta × Hugging Face Hackathon where LLM agents diagnose production incidents.",
    fullDescription:
      "A production-grade OpenEnv environment created for the Meta × Hugging Face Hackathon. LLM agents act as on-call ML engineers who diagnose production incidents inside a simulated infrastructure. The environment includes four difficulty tiers, dense reinforcement-learning rewards, and a GRPO fine-tuning pipeline, reporting an average score of 0.9625 across the difficulty tiers.",
    problem: "Training agentic models to operate production ML systems needs a realistic, scoreable simulation.",
    solution:
      "A simulated infrastructure with four difficulty tiers and dense RL rewards, paired with a GRPO fine-tuning pipeline so agents improve at on-call incident diagnosis.",
    outcome: "0.9625 average score across all four difficulty tiers.",
    category: ["mlops", "ai"],
    technologies: ["FastAPI", "Docker", "Unsloth", "TRL", "GRPO", "Hugging Face Spaces"],
    status: "Active",
    impact: "0.9625 average score across four difficulty tiers",
    metrics: [{ label: "Avg. score", value: "0.9625" }, { label: "Difficulty tiers", value: "4" }],
    media: {
      video: "/assets/projects/mlops-incident.mp4",
      poster: "/assets/projects/mlops-incident-poster.jpg"
    },
    links: {
      repository: "https://github.com/jas0nt0dd/mlops-incident-env",
      live: "https://jason9150-mlops-incident-env.hf.space/"
    },
    featured: true
  },
  {
    id: "truck-parking",
    slug: "smart-truck-parking-management",
    title: "Smart Truck Parking Management System",
    shortDescription:
      "A full-stack parking-management platform handling gatekeeper workflows, billing and live admin dashboards.",
    fullDescription:
      "A full-stack parking-management platform for truck yards. FastAPI handles session state, billing calculations, and WhatsApp notifications, while the Next.js interface supports gatekeeper entry and exit workflows, live admin dashboards, payment status, and reporting.",
    problem: "Truck-yard gatekeepers need a fast, reliable way to log entries, exits and billing without paper logs.",
    solution:
      "A FastAPI backend manages session state, billing and WhatsApp notifications; a Next.js frontend drives gatekeeper workflows and a live admin dashboard.",
    outcome: "A deployed, in-use gatekeeper and admin platform with payment status and reporting.",
    category: ["fullstack", "ai"],
    technologies: ["FastAPI", "Next.js", "WhatsApp API", "PostgreSQL", "Admin Dashboards"],
    status: "Deployed",
    impact: "Live gatekeeper entry/exit workflow with billing and WhatsApp notifications",
    media: {
      video: "/assets/projects/truck-parking.mp4",
      poster: "/assets/projects/truck-parking-poster.jpg"
    },
    links: { live: "https://truck-parking-system.vercel.app/login" },
    featured: false
  },
  {
    id: "policylens",
    slug: "policylens-ai",
    title: "PolicyLens AI — Policy Bias Detection",
    shortDescription:
      "A civic-tech tool that scores a government-policy PDF for bias, SDG alignment and loopholes in under 90 seconds.",
    fullDescription:
      "A civic-tech application that accepts a government-policy PDF and produces a bias report, SDG score, loophole flags, and plain-English summary in under 90 seconds. It uses a three-model ensemble across five dimensions of bias and maps policy clauses to all 17 UN Sustainable Development Goals.",
    problem: "Reviewing government policy for bias and SDG alignment is slow and requires specialist reading.",
    solution:
      "A three-model ensemble scores five dimensions of bias while a mapping layer aligns policy clauses to all 17 UN SDGs, producing a plain-English summary.",
    outcome: "Finalist, AI Tool Dev Challenge 2.0 — full report generated in under 90 seconds.",
    category: ["ai"],
    technologies: ["FastAPI", "React", "Mistral 7B", "BERT", "IBM AIF360", "Docker"],
    status: "Finalist build",
    impact: "Finalist — AI Tool Dev Challenge 2.0",
    metrics: [{ label: "Report time", value: "< 90s" }, { label: "SDGs mapped", value: "17 / 17" }],
    media: { poster: "/assets/projects/policylens-poster.jpg" },
    links: { repository: "https://github.com/jas0nt0dd/policylens-ai" },
    featured: false
  },
  {
    id: "testcase-gen",
    slug: "ai-qa-test-case-generator",
    title: "AI-Powered Intelligent Test Case Generator",
    shortDescription:
      "A full-stack tool that crawls a site and generates QA test cases across 15 categories, exportable to CSV, XLSX and DOCX.",
    fullDescription:
      "A full-stack application that crawls a website, creates semantic page summaries, and uses AI to generate professional QA test cases across 15 categories. It supports export to CSV, XLSX, and DOCX.",
    problem: "Writing comprehensive QA test cases by hand for a live site is repetitive and easy to under-cover.",
    solution:
      "Playwright crawls the target site and builds semantic page summaries; an LLM generates structured test cases across 15 QA categories, exportable in multiple formats.",
    outcome: "Structured, exportable QA suites generated directly from a live URL.",
    category: ["ai", "fullstack"],
    technologies: ["Playwright", "FastAPI", "Groq", "Python", "CSV", "XLSX", "DOCX"],
    status: "Active",
    impact: "Test cases generated across 15 QA categories, exportable in 3 formats",
    media: {
      video: "/assets/projects/testcase-generator.mp4",
      poster: "/assets/projects/testcase-gen-poster.jpg"
    },
    links: {},
    featured: false
  },
  {
    id: "zkbot",
    slug: "zkbot-autonomous-cup-washing",
    title: "ZKBot — Autonomous Cup Washing Robot",
    shortDescription:
      "A real-time YOLO computer-vision pipeline integrated with a robotic arm for autonomous cup detection and washing.",
    fullDescription:
      "A real-time YOLO computer-vision pipeline integrated with a robotic arm for autonomous cup detection and washing. A custom YOLO model controls robotic actuators through serial communication for an automated cleaning workflow.",
    problem: "Repetitive cup-washing tasks benefit from vision-guided automation rather than fixed-path robotics.",
    solution:
      "A custom-trained YOLO model detects cup position in real time and drives a robotic arm's actuators over serial communication to execute the wash cycle.",
    outcome: "An autonomous detection-to-actuation loop running on real hardware.",
    category: ["computer-vision", "robotics"],
    technologies: ["YOLOv8", "OpenCV", "Arduino", "Python", "Serial Communication", "Robotic Arm Control"],
    status: "Active",
    impact: "Closed-loop vision-guided robotic automation",
    media: {
      video: "/assets/projects/zkbot.mp4",
      poster: "/assets/projects/zkbot-poster.jpg"
    },
    links: {
      repository: "https://github.com/robentialkinetics-kishtech/zkbot-autonomous-cup-washing-system-"
    },
    featured: true
  }
];

export const projectCategoryLabels: Record<string, string> = {
  ai: "AI / Agentic",
  security: "Cybersecurity",
  "computer-vision": "Computer Vision",
  robotics: "Robotics",
  fullstack: "Full-stack",
  mlops: "MLOps"
};
