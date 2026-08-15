import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "genai-prototypes",
    code: "MOD-01",
    title: "GenAI & LLM Prototypes",
    problem: "You have a workflow that could be accelerated by an LLM but no working prototype to test the idea against real use.",
    delivery: [
      "Scoped LLM prototype using LangChain / LangGraph agent patterns",
      "RAG pipeline design with a vector database and embeddings",
      "Prompt design, evaluation, and responsible-AI checks"
    ],
    suitedFor: "Founders and teams validating an AI feature before committing engineering resources.",
    outcome: "A working prototype you can demo, test with real users, and use to scope a production build.",
    tags: ["LangGraph", "RAG", "Vector DB"]
  },
  {
    id: "workflow-automation",
    code: "MOD-02",
    title: "AI-Powered Workflow Automation",
    problem: "Manual, repetitive operational work is consuming hours that could run unattended.",
    delivery: [
      "Automation pipeline design connecting your existing tools and data",
      "Agentic orchestration for multi-step tasks",
      "Notification and reporting integrations (e.g. WhatsApp, email)"
    ],
    suitedFor: "Operations teams and small businesses with a defined, repeatable manual process.",
    outcome: "A running automation with clear handoff points for anything that still needs human review.",
    tags: ["FastAPI", "Automation", "Integrations"]
  },
  {
    id: "computer-vision",
    code: "MOD-03",
    title: "Computer Vision Systems",
    problem: "You need real-time detection or classification from a camera feed, not just an offline model.",
    delivery: [
      "Custom dataset collection and training guidance (YOLOv8 / Roboflow)",
      "Real-time inference pipeline with OpenCV",
      "Hardware or robotic-arm integration where applicable"
    ],
    suitedFor: "Teams building physical or camera-driven automation, from inspection to robotics.",
    outcome: "A trained model connected to a working real-time detection pipeline.",
    tags: ["YOLOv8", "OpenCV", "Roboflow"]
  },
  {
    id: "security-tooling",
    code: "MOD-04",
    title: "Cybersecurity Tooling & Security Automation",
    problem: "Recon and vulnerability-scanning steps are being run manually, tool by tool.",
    delivery: [
      "Orchestrated scanning pipelines chaining tools like Nmap, Gobuster and Nikto",
      "AI-assisted triage of findings",
      "Graph-based malware / binary analysis where relevant"
    ],
    suitedFor: "Security teams and researchers who want reconnaissance and triage to run with less manual effort.",
    outcome: "A repeatable scanning-and-triage pipeline instead of a manual multi-tool checklist.",
    tags: ["Nmap", "GNN", "Automation"]
  },
  {
    id: "robotics-hardware",
    code: "MOD-05",
    title: "Robotics & Hardware-Connected Intelligence",
    problem: "You have hardware — sensors, actuators, a robotic arm — but no intelligence layer connecting it to perception.",
    delivery: [
      "Sensor and actuator integration with Arduino / embedded systems",
      "Serial-communication control logic",
      "Vision-to-actuation pipelines for automated physical tasks"
    ],
    suitedFor: "Hardware teams and robotics projects that need a perception-to-actuation bridge.",
    outcome: "A working closed loop from sensor input to physical action.",
    tags: ["Arduino", "Serial", "Actuation"]
  },
  {
    id: "fullstack-ai",
    code: "MOD-06",
    title: "Full-stack AI Products",
    problem: "You need a real, deployable product around an AI capability — not just a model in a notebook.",
    delivery: [
      "FastAPI / Next.js or React application architecture",
      "Database-backed session state, dashboards and reporting",
      "Deployment-ready builds on Vercel or comparable platforms"
    ],
    suitedFor: "Founders and small teams shipping an AI-driven product end to end.",
    outcome: "A deployed application, not a standalone script.",
    tags: ["FastAPI", "Next.js", "PostgreSQL"]
  },
  {
    id: "mlops-environments",
    code: "MOD-07",
    title: "MLOps Environments & Deployment-Ready Experiments",
    problem: "Reinforcement-learning or fine-tuning experiments exist but aren't structured for repeatable, scoreable runs.",
    delivery: [
      "OpenEnv-compatible RL environment design with tiered difficulty",
      "Reward-shaping and evaluation scaffolding",
      "Fine-tuning pipelines (e.g. GRPO) with tracked metrics"
    ],
    suitedFor: "Research teams building or evaluating agentic models against realistic simulated tasks.",
    outcome: "A reproducible environment with dense rewards and tracked evaluation scores.",
    tags: ["OpenEnv", "GRPO", "Docker"]
  },
  {
    id: "research-prototypes",
    code: "MOD-08",
    title: "Technical Research Prototypes & Proof-of-Concepts",
    problem: "An idea needs a credible working proof-of-concept before it can be pitched, published or funded.",
    delivery: [
      "Rapid prototype scoped to the core technical claim",
      "Evaluation methodology with tracked metrics",
      "Clear documentation of architecture, problem, solution and outcome"
    ],
    suitedFor: "Researchers, hackathon teams and early-stage builders needing a demonstrable proof-of-concept.",
    outcome: "A working prototype with the evidence needed to move to the next stage.",
    tags: ["Prototyping", "Evaluation", "Docs"]
  },
  {
    id: "qa-automation",
    code: "MOD-09",
    title: "QA Automation & Intelligent Testing Workflows",
    problem: "Test-case coverage for a live site or app is inconsistent and time-consuming to write by hand.",
    delivery: [
      "Automated site crawling and semantic page summarization (Playwright)",
      "AI-generated structured test cases across multiple QA categories",
      "Export to CSV, XLSX or DOCX for your existing QA workflow"
    ],
    suitedFor: "Teams that need broader, faster QA test-case coverage for an existing site or app.",
    outcome: "A structured, exportable test-case suite generated directly from a live URL.",
    tags: ["Playwright", "QA", "Groq"]
  }
];
