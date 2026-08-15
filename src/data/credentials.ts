import type { Award, EducationEntry, Certification } from "@/types";

export const awards: (Award & { color?: string })[] = [
  {
    id: "eureka-bughunt",
    title: "1st Place - Eureka Bug Bounty",
    organization: "IIT BHU Varanasi",
    description: "First place in the Eureka Bug Bounty competition.",
    color: "#C4172B"
  },
  {
    id: "aws-campus",
    title: "Top 20 - AWS Campus Hackathon",
    organization: "IIT Kanpur / Techkriti '26",
    color: "#FF9900"
  },
  {
    id: "ai-tool-dev",
    title: "Finalist - AI Tool Dev Challenge 2.0",
    organization: "with PolicyLens AI",
    description: "Finalist placement with the PolicyLens AI civic-tech submission.",
    color: "#6366F1"
  },
  {
    id: "vista-codefest",
    title: "Top 30 - Vista Codefest '26",
    organization: "Computer Vision track - Kaggle / IIT BHU",
    color: "#06B6D4"
  },
  {
    id: "enigma-codefest",
    title: "Top 30 - Enigma Codefest '26",
    organization: "ML & Algorithmic track - Kaggle / IIT BHU",
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
    degree: "B.Tech - Artificial Intelligence and Data Science",
    institution: "Kathir College of Engineering",
    period: "2023 - 2027",
    detail: "CGPA: 7.8"
  }
];

// Add the certificate image files under public/assets/certificates/ using the
// paths below. Verification URLs can be added to `url` when available.
export const certifications: Certification[] = [
  {
    id: "aws-simulearn-generative-ai",
    title: "AWS SimuLearn: Generative AI Practitioner",
    issuer: "Amazon Web Services",
    description: "Generative AI practitioner simulation.",
    image: "/assets/certificates/aws-simulearn-generative-ai.jpg",
    verified: false
  },
  {
    id: "amazon-redshift",
    title: "Amazon Redshift",
    issuer: "Amazon Web Services",
    description: "Data warehousing and analytics learning credential.",
    image: "/assets/certificates/amazon-redshift.jpg",
    verified: false
  },
  {
    id: "udemy-prompt-engineering",
    title: "Prompt Engineering",
    issuer: "Udemy",
    description: "Prompt design and applied LLM workflows.",
    image: "/assets/certificates/udemy-prompt-engineering.jpg",
    verified: false
  },
  {
    id: "amypo-data-science-workshop",
    title: "Data Science Workshop",
    issuer: "Amypo Technologies",
    description: "Practical data science workshop credential.",
    image: "/assets/certificates/amypo-data-science-workshop.jpg",
    verified: false
  },
  {
    id: "meta-openenv-finalist",
    title: "OpenEnv Hackathon Finalist",
    issuer: "Meta OpenEnv Hackathon",
    description: "Finalist recognition in the OpenEnv hackathon.",
    image: "/assets/certificates/meta-openenv-finalist.jpg",
    verified: false
  },
  {
    id: "linkedin-six-sigma-green-belt",
    title: "Six Sigma Green Belt",
    issuer: "LinkedIn Learning",
    description: "Process improvement and quality methodology credential.",
    image: "/assets/certificates/linkedin-six-sigma-green-belt.jpg",
    verified: false
  }
];
