import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    id: "genai",
    eyebrow: "MODULE / 01",
    label: "Generative AI & Agentic Systems",
    description: "LLM applications, agent planning, tool orchestration and retrieval pipelines.",
    skills: [
      { name: "LangChain" },
      { name: "LangGraph" },
      { name: "Hugging Face Transformers" },
      { name: "RAG Pipelines" },
      { name: "Vector Databases" },
      { name: "Prompt Engineering" },
      { name: "LoRA Fundamentals", interest: true },
      { name: "Fine-tuning Fundamentals", interest: true }
    ]
  },
  {
    id: "ml",
    eyebrow: "MODULE / 02",
    label: "Machine Learning & Deep Learning",
    description: "Model design, training and evaluation across classical ML and neural architectures.",
    skills: [
      { name: "PyTorch" },
      { name: "TensorFlow" },
      { name: "scikit-learn" },
      { name: "XGBoost" },
      { name: "CNNs" },
      { name: "Transformers" },
      { name: "Reinforcement Learning" },
      { name: "Feature Engineering" }
    ]
  },
  {
    id: "vision",
    eyebrow: "MODULE / 03",
    label: "Computer Vision",
    description: "Real-time detection systems trained and deployed against physical hardware.",
    skills: [
      { name: "YOLOv8" },
      { name: "OpenCV" },
      { name: "Real-time Object Detection" },
      { name: "Custom Dataset Training" },
      { name: "Roboflow" }
    ]
  },
  {
    id: "security",
    eyebrow: "MODULE / 04",
    label: "Cybersecurity & Offensive Tooling",
    description: "Autonomous reconnaissance, exploitation chaining, and graph-based malware classification.",
    skills: [
      { name: "Nmap" },
      { name: "Gobuster" },
      { name: "Nikto" },
      { name: "Static Malware Analysis" },
      { name: "Graph Neural Networks (GCN / GAT)" },
      { name: "Security Automation" }
    ]
  },
  {
    id: "robotics",
    eyebrow: "MODULE / 05",
    label: "Robotics & Embedded Integration",
    description: "Bridging perception models to actuators, sensors and serial-controlled hardware.",
    skills: [
      { name: "Arduino" },
      { name: "Sensor Integration" },
      { name: "Serial Communication" },
      { name: "Robotic-arm Control" },
      { name: "Embedded Automation" }
    ]
  },
  {
    id: "fullstack",
    eyebrow: "MODULE / 06",
    label: "Backend & Full-stack Systems",
    description: "Production-style services and interfaces that wrap AI and automation systems.",
    skills: [
      { name: "FastAPI" },
      { name: "REST APIs" },
      { name: "Next.js" },
      { name: "React" },
      { name: "Flask" },
      { name: "Streamlit" },
      { name: "Gradio" },
      { name: "PostgreSQL" },
      { name: "MySQL" }
    ]
  },
  {
    id: "mlops",
    eyebrow: "MODULE / 07",
    label: "MLOps, Containers & Deployment",
    description: "Reinforcement-learning environments, CI/CD and reproducible deployment paths.",
    skills: [
      { name: "OpenEnv-compatible RL Environments" },
      { name: "Docker Basics" },
      { name: "GitHub Actions" },
      { name: "CI/CD Basics" },
      { name: "Vercel" },
      { name: "Kubernetes", interest: true }
    ]
  },
  {
    id: "data-cloud",
    eyebrow: "MODULE / 08",
    label: "Data & Cloud",
    description: "Analysis, experimentation and infrastructure supporting the above systems.",
    skills: [
      { name: "Pandas" },
      { name: "NumPy" },
      { name: "Matplotlib" },
      { name: "Seaborn" },
      { name: "AWS EC2 / S3 / Lambda", interest: true },
      { name: "SageMaker Basics", interest: true },
      { name: "Azure", interest: true },
      { name: "ChromaDB Basics" }
    ]
  }
];

export const languages = ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"];

export const tools = ["Git", "GitHub", "Jupyter Notebook", "Google Colab", "VS Code", "Linux CLI"];
