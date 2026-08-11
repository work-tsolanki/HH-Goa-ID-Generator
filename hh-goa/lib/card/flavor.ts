export type Flavor = {
  badgeTitle: string; // shown in the yellow lightning-bolt pill, e.g. "AI ENGINEER"
  builderClass: string; // e.g. "Terminal Wizard"
  tagline: string; // e.g. "Building the Future"
};

type Rule = {
  keywords: string[];
  classes: string[];
  taglines: string[];
};

// Deterministic keyword -> flavor mapping. No external calls: same input always
// produces the same output, picked by a stable hash so results still feel varied
// across different exact phrasings within a category.
const RULES: Rule[] = [
  {
    keywords: ["ai", "ml", "machine learning", "llm", "genai", "deep learning", "neural"],
    classes: ["Prompt Whisperer", "Neural Alchemist", "Model Tamer", "Gradient Wizard"],
    taglines: ["Training the Future", "Shipping Intelligence", "Teaching Machines to Think", "Fine-Tuning Reality"],
  },
  {
    keywords: ["frontend", "front-end", "react", "vue", "svelte", "next.js", "nextjs", "ui engineer", "css"],
    classes: ["Pixel Sorcerer", "Component Whisperer", "Layout Alchemist", "Interface Bard"],
    taglines: ["Shipping Smooth UI", "Pixel-Perfect & Proud", "Rendering the Vibe", "Crafting Every Click"],
  },
  {
    keywords: ["backend", "back-end", "api", "node", "server", "database", "sql", "golang", "django"],
    classes: ["Terminal Wizard", "API Sherpa", "Query Whisperer", "Server Sensei"],
    taglines: ["Building the Future", "Keeping Servers Happy", "Scaling Quietly", "Shipping the Backbone"],
  },
  {
    keywords: ["fullstack", "full-stack", "full stack", "swe", "software engineer", "developer", "engineer"],
    classes: ["Full-Stack Nomad", "Code Alchemist", "Ship-It Specialist", "Stack Ranger"],
    taglines: ["Building the Future", "Shipping End to End", "From Idea to Deploy", "Committing to Chaos"],
  },
  {
    keywords: ["mobile", "ios", "android", "flutter", "react native", "swift", "kotlin"],
    classes: ["Pocket Architect", "App Whisperer", "Native Nomad", "Thumb-Zone Tactician"],
    taglines: ["Shipping to Every Pocket", "Building on the Go", "Native & Proud", "Tapping Into Tomorrow"],
  },
  {
    keywords: ["data", "analytics", "scientist", "analyst", "etl", "pipeline"],
    classes: ["Data Whisperer", "Insight Smuggler", "Pipeline Pirate", "Chart Sorcerer"],
    taglines: ["Finding Signal in Noise", "Shipping Insights", "Turning Rows into Stories", "Building the Future"],
  },
  {
    keywords: ["devops", "sre", "infra", "cloud", "platform", "kubernetes", "docker"],
    classes: ["Uptime Guardian", "Cloud Whisperer", "Infra Alchemist", "Deploy Druid"],
    taglines: ["Keeping the Lights On", "Shipping at 3am", "Automating Everything", "Building the Future"],
  },
  {
    keywords: ["design", "designer", "ux", "ui/ux", "product design", "figma"],
    classes: ["Pixel Perfectionist", "Vibe Architect", "Interface Poet", "Craft Custodian"],
    taglines: ["Designing the Future", "Sweating Every Pixel", "Making It Feel Right", "Shipping Delight"],
  },
  {
    keywords: ["blockchain", "web3", "crypto", "solidity", "smart contract"],
    classes: ["Chain Whisperer", "Block Alchemist", "Ledger Nomad", "Gas Fee Gambler"],
    taglines: ["Building on Chain", "Shipping Trustlessly", "Decentralizing Everything", "Building the Future"],
  },
  {
    keywords: ["security", "hacker", "pentest", "infosec", "cyber"],
    classes: ["Threat Whisperer", "Exploit Artisan", "Firewall Sensei", "Vuln Hunter"],
    taglines: ["Breaking Things Responsibly", "Shipping Securely", "Finding the Cracks", "Building the Future"],
  },
  {
    keywords: ["game", "unity", "unreal", "gamedev"],
    classes: ["Pixel Ringmaster", "World Builder", "Frame-Rate Fanatic", "Level Alchemist"],
    taglines: ["Shipping Playable Worlds", "Building the Future", "Chasing 60 FPS", "Making It Fun"],
  },
  {
    keywords: ["product", "pm", "founder", "entrepreneur", "cofounder", "co-founder"],
    classes: ["Roadmap Renegade", "Vision Wrangler", "Scope Whisperer", "Zero-to-One Nomad"],
    taglines: ["Building the Future", "Shipping the Vision", "Turning Ideas Into Reality", "Finding Product-Market Fit"],
  },
  {
    keywords: ["student", "learner", "beginner"],
    classes: ["Curious Builder", "Rookie Rockstar", "First-Commit Hero", "Sandbox Nomad"],
    taglines: ["Learning by Shipping", "Building the Future", "First Line, First Win", "Debugging Life"],
  },
];

const FALLBACK_CLASSES = [
  "Terminal Wizard",
  "Code Nomad",
  "Ship-It Specialist",
  "Sunset Debugger",
  "Beach Byte Bandit",
  "Palm Tree Prototyper",
  "Wanderlust Engineer",
  "Tide Pool Tinkerer",
];

const FALLBACK_TAGLINES = [
  "Building the Future",
  "Shipping in Paradise",
  "Committing to Good Vibes",
  "From Sand to Ship",
  "Debugging by the Beach",
  "Turning Coffee into Code",
  "Making Waves",
  "Building Something Great",
];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

export function getFlavor(rawStackOrRole: string): Flavor {
  const input = (rawStackOrRole || "Builder").trim();
  const normalized = input.toLowerCase();
  const seed = hashString(normalized);

  const badgeTitle = input.length > 24 ? `${input.slice(0, 22).trimEnd()}…` : input;

  const matched = RULES.find((rule) => rule.keywords.some((kw) => normalized.includes(kw)));

  const builderClass = matched
    ? pick(matched.classes, seed, 1)
    : pick(FALLBACK_CLASSES, seed, 1);

  const tagline = matched ? pick(matched.taglines, seed, 7) : pick(FALLBACK_TAGLINES, seed, 7);

  return {
    badgeTitle: badgeTitle.toUpperCase(),
    builderClass,
    tagline,
  };
}
