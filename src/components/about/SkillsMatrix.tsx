import { useMemo, useState, type CSSProperties } from "react";
import { Reveal, SectionLabel, Tag } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { skillGroups, languages, tools } from "@/data/skills";
import styles from "./SkillsMatrix.module.css";

export function SkillsMatrix() {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <div className="container">
        <Reveal>
          <SectionLabel index="//02" label="Capability Matrix" />
        </Reveal>
        <Reveal delay={1}>
          <h2 id="skills-heading" className={styles.heading}>
            Eight modules. One operator.
          </h2>
          <p className={styles.subhead}>
            Click a module to expand its full toolset. Interest-stage technologies are marked distinctly from
            hands-on tools.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <CapabilityOrbit />
        </Reveal>

        <Reveal>
          <div className={styles.footerRow}>
            <div>
              <p className={`${styles.footerLabel} mono`}>LANGUAGES</p>
              <div className={styles.chipRow}>
                {languages.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className={`${styles.footerLabel} mono`}>TOOLS</p>
              <div className={styles.chipRow}>
                {tools.map((t) => (
                  <Tag key={t} muted>
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CapabilityOrbit() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeGroup = activeId ? skillGroups.find((group) => group.id === activeId) : undefined;
  const orbitGroups = useMemo(
    () => [
      { id: "inner", radius: "var(--orbit-inner)", speed: 22, modules: skillGroups.slice(0, 3) },
      { id: "mid", radius: "var(--orbit-mid)", speed: 34, modules: skillGroups.slice(3, 6) },
      { id: "outer", radius: "var(--orbit-outer)", speed: 48, modules: skillGroups.slice(6, 8) }
    ],
    []
  );

  return (
    <div className={`${styles.solarSystem} ${activeGroup ? styles.solarSystemExpanded : ""}`}>
      <div className={styles.orbitStage} aria-label="Capability modules solar system">
        <div className={styles.orbitTilt}>
          <div className={styles.core} aria-hidden="true">
            <div className={styles.coreGlow} />
            <Icon name="cpu" size={34} />
            <span className={`${styles.coreLabel} mono`}>CORE</span>
          </div>

          {orbitGroups.map((orbit) => (
            <div key={orbit.id} className={styles.orbitLayer}>
              <div className={styles.orbitRing} style={{ width: `calc(${orbit.radius} * 2)`, height: `calc(${orbit.radius} * 2)` }} />
              {orbit.modules.map((group, index) => {
                const delay = -(orbit.speed / orbit.modules.length) * index;
                const moduleNumber = skillGroups.findIndex((item) => item.id === group.id) + 1;
                const isActive = activeId === group.id;

                return (
                  <div
                    key={group.id}
                    className={styles.orbitNodePath}
                    style={
                      {
                        "--orbit-radius": orbit.radius,
                        "--orbit-speed": `${orbit.speed}s`,
                        animationDelay: `${delay}s`
                      } as CSSProperties
                    }
                  >
                    <button
                      type="button"
                      className={`${styles.orbitNode} ${isActive ? styles.orbitNodeActive : ""}`}
                      aria-pressed={isActive}
                      aria-label={`Open ${group.eyebrow}: ${group.label}`}
                      onClick={() => setActiveId(group.id)}
                      style={
                        {
                          "--orbit-speed": `${orbit.speed}s`,
                          animationDelay: `${delay}s`
                        } as CSSProperties
                      }
                      data-cursor="interactive"
                    >
                      <span className="mono">MODULE {String(moduleNumber).padStart(2, "0")}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {activeGroup && (
        <div className={styles.modulePanel}>
          <SkillModule group={activeGroup} />
        </div>
      )}
    </div>
  );
}

function SkillModule({ group }: { group: (typeof skillGroups)[number] }) {
  const moduleNumber = skillGroups.findIndex((item) => item.id === group.id) + 1;

  return (
    <div className={`${styles.module} ${styles.moduleOpen}`}>
      <div className={styles.moduleTrigger}>
        <span className={`${styles.moduleEyebrow} mono`}>MODULE {String(moduleNumber).padStart(2, "0")}</span>
        <Icon name="signal" size={16} className={styles.moduleChevron} />
      </div>
      <h3 className={styles.moduleLabel}>{group.label}</h3>
      <p className={styles.moduleDescription}>{group.description}</p>
      <ul className={styles.skillList}>
        {group.skills.map((skill) => (
          <li key={skill.name} className={styles.skillItem}>
            <ToolLogo name={skill.name} interest={skill.interest} />
            <span>{skill.name}</span>
            {skill.interest && <span className={styles.skillInterestLabel}>interest</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ToolLogoAsset = {
  kind: "icon" | "badge";
  src: string;
};

function skillIcon(slug: string): ToolLogoAsset {
  return {
    kind: "icon",
    src: `https://skillicons.dev/icons?i=${slug}&theme=dark`
  };
}

function shieldBadge(label: string, color = "10141B", logoColor = "white", logo?: string): ToolLogoAsset {
  const logoQuery = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=${encodeURIComponent(logoColor)}` : "";
  return {
    kind: "badge",
    src: `https://img.shields.io/badge/${encodeURIComponent(label.replace(/\s+/g, "_"))}-${color}?style=for-the-badge${logoQuery}`
  };
}

function ToolLogo({ name, interest }: { name: string; interest?: boolean }) {
  const logo = getToolLogo(name);

  return (
    <span
      className={`${styles.toolLogo} ${logo.kind === "badge" ? styles.toolLogoBadge : ""} ${interest ? styles.toolLogoInterest : ""}`}
      aria-hidden="true"
    >
      <img src={logo.src} alt="" loading="lazy" />
    </span>
  );
}

function getToolLogo(name: string) {
  const normalized = name.toLowerCase();
  const match = toolLogoRules.find(([key]) => normalized.includes(key));

  if (match) return match[1];

  const legacy = toolLogoMap.find(([key]) => normalized.includes(key));
  if (legacy) return shieldBadge(name, legacy[1].color.replace("#", ""));

  return shieldBadge(name, "232A35", "EDebe6");
}

const toolLogoRules: Array<[string, ToolLogoAsset]> = [
  ["langchain", shieldBadge("LangChain", "1C3C3C", "white", "langchain")],
  ["langgraph", shieldBadge("LangGraph", "00B4D8")],
  ["hugging face", shieldBadge("HuggingFace", "FFD21E", "black", "huggingface")],
  ["rag", shieldBadge("RAG", "7928CA")],
  ["vector", shieldBadge("Vector_DB", "6E40C9")],
  ["prompt", shieldBadge("Prompting", "FF4B4B")],
  ["lora", shieldBadge("LoRA", "00FFF5", "black")],
  ["fine-tuning", shieldBadge("Fine_Tuning", "00FFF5", "black")],
  ["pytorch", skillIcon("pytorch")],
  ["tensorflow", skillIcon("tensorflow")],
  ["scikit", skillIcon("sklearn")],
  ["xgboost", shieldBadge("XGBoost", "3FAE6A")],
  ["cnn", shieldBadge("CNN", "61DAFB", "black")],
  ["transformers", shieldBadge("Transformers", "FFD21E", "black", "huggingface")],
  ["reinforcement", shieldBadge("RL", "6E40C9")],
  ["feature", shieldBadge("Features", "00B4D8")],
  ["yolo", shieldBadge("YOLOv8", "00FFAA", "black")],
  ["opencv", skillIcon("opencv")],
  ["object detection", shieldBadge("Detection", "00FFAA", "black")],
  ["dataset", shieldBadge("Dataset", "3178C6")],
  ["roboflow", shieldBadge("Roboflow", "7C3AED")],
  ["nmap", shieldBadge("Nmap", "3B82F6")],
  ["gobuster", shieldBadge("Gobuster", "F97316")],
  ["nikto", shieldBadge("Nikto", "EF4444")],
  ["malware", shieldBadge("Malware", "C4172B")],
  ["graph neural", shieldBadge("GNN", "6E40C9")],
  ["security", shieldBadge("Security", "FF4B4B")],
  ["arduino", skillIcon("arduino")],
  ["sensor", shieldBadge("Sensors", "22C55E")],
  ["serial", shieldBadge("Serial_IO", "EAB308", "black")],
  ["robotic", shieldBadge("Robotics", "64748B")],
  ["embedded", shieldBadge("Embedded", "F97316")],
  ["fastapi", skillIcon("fastapi")],
  ["rest", shieldBadge("REST_API", "38BDF8", "black")],
  ["next.js", skillIcon("nextjs")],
  ["react", skillIcon("react")],
  ["flask", skillIcon("flask")],
  ["streamlit", shieldBadge("Streamlit", "FF4B4B", "white", "streamlit")],
  ["gradio", shieldBadge("Gradio", "FF6B6B")],
  ["postgresql", skillIcon("postgres")],
  ["mysql", skillIcon("mysql")],
  ["openenv", shieldBadge("OpenEnv", "3FAE6A")],
  ["docker", skillIcon("docker")],
  ["github actions", skillIcon("githubactions")],
  ["ci/cd", shieldBadge("CI/CD", "C4172B")],
  ["vercel", skillIcon("vercel")],
  ["kubernetes", skillIcon("kubernetes")],
  ["pandas", shieldBadge("Pandas", "150458", "white", "pandas")],
  ["numpy", shieldBadge("NumPy", "4DABCF", "black", "numpy")],
  ["matplotlib", shieldBadge("Matplotlib", "11557C")],
  ["seaborn", shieldBadge("Seaborn", "4C72B0")],
  ["aws", skillIcon("aws")],
  ["sagemaker", shieldBadge("SageMaker", "FF9900", "black", "amazonaws")],
  ["azure", skillIcon("azure")],
  ["chromadb", shieldBadge("ChromaDB", "6E40C9")]
];

const toolLogoMap: Array<[string, { text: string; color: string }]> = [
  ["langchain", { text: "LC", color: "#41c88a" }],
  ["langgraph", { text: "LG", color: "#41c88a" }],
  ["hugging face", { text: "HF", color: "#ffcc4d" }],
  ["rag", { text: "RAG", color: "#c4172b" }],
  ["vector", { text: "DB", color: "#8b5cf6" }],
  ["prompt", { text: "P>", color: "#ff3b4e" }],
  ["lora", { text: "Lo", color: "#38bdf8" }],
  ["fine-tuning", { text: "FT", color: "#38bdf8" }],
  ["pytorch", { text: "PT", color: "#ee4c2c" }],
  ["tensorflow", { text: "TF", color: "#ff8f00" }],
  ["scikit", { text: "SK", color: "#f7931e" }],
  ["xgboost", { text: "XG", color: "#3fae6a" }],
  ["cnn", { text: "CV", color: "#61dafb" }],
  ["transformers", { text: "TR", color: "#ffcc4d" }],
  ["reinforcement", { text: "RL", color: "#a855f7" }],
  ["feature", { text: "FX", color: "#2dd4bf" }],
  ["yolo", { text: "YO", color: "#00ffff" }],
  ["opencv", { text: "CV", color: "#5c3ee8" }],
  ["object detection", { text: "OD", color: "#00ffff" }],
  ["dataset", { text: "DS", color: "#38bdf8" }],
  ["roboflow", { text: "RF", color: "#7c3aed" }],
  ["nmap", { text: "NM", color: "#3b82f6" }],
  ["gobuster", { text: "GB", color: "#f97316" }],
  ["nikto", { text: "NK", color: "#ef4444" }],
  ["malware", { text: "MW", color: "#c4172b" }],
  ["graph neural", { text: "GNN", color: "#8b5cf6" }],
  ["security", { text: "SEC", color: "#ff3b4e" }],
  ["arduino", { text: "AR", color: "#00979d" }],
  ["sensor", { text: "SN", color: "#22c55e" }],
  ["serial", { text: "IO", color: "#eab308" }],
  ["robotic", { text: "RB", color: "#94a3b8" }],
  ["embedded", { text: "EM", color: "#f97316" }],
  ["fastapi", { text: "FA", color: "#009688" }],
  ["rest", { text: "API", color: "#38bdf8" }],
  ["next.js", { text: "N", color: "#ffffff" }],
  ["react", { text: "R", color: "#61dafb" }],
  ["flask", { text: "Fl", color: "#ffffff" }],
  ["streamlit", { text: "St", color: "#ff4b4b" }],
  ["gradio", { text: "Gr", color: "#ff7c00" }],
  ["postgresql", { text: "PG", color: "#336791" }],
  ["mysql", { text: "MY", color: "#00758f" }],
  ["openenv", { text: "OE", color: "#3fae6a" }],
  ["docker", { text: "D", color: "#2496ed" }],
  ["github actions", { text: "GA", color: "#ffffff" }],
  ["ci/cd", { text: "CI", color: "#c4172b" }],
  ["vercel", { text: "▲", color: "#ffffff" }],
  ["kubernetes", { text: "K8", color: "#326ce5" }],
  ["pandas", { text: "Pd", color: "#150458" }],
  ["numpy", { text: "Np", color: "#4dabcf" }],
  ["matplotlib", { text: "Mp", color: "#11557c" }],
  ["seaborn", { text: "Sb", color: "#4c72b0" }],
  ["aws", { text: "AWS", color: "#ff9900" }],
  ["sagemaker", { text: "SM", color: "#ff9900" }],
  ["azure", { text: "Az", color: "#0078d4" }],
  ["chromadb", { text: "Ch", color: "#facc15" }]
];
