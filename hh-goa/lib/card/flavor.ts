export type Flavor = {
  badgeTitle: string; // shown in the yellow lightning-bolt pill, e.g. "AI ENGINEER"
  builderClass: string; // e.g. "Terminal Wizard"
  tagline: string; // e.g. "Building the Future"
};

type Rule = {
  keywords: string[];
  // Domain-flavored nouns, combined with a shared archetype suffix to form
  // the builder class, e.g. "Prompt" + "Whisperer" -> "Prompt Whisperer".
  classPrefixes: string[];
  // Domain-flavored objects, combined with a shared gerund verb to form the
  // tagline, e.g. "Shipping" + "Intelligence" -> "Shipping Intelligence".
  taglineObjects: string[];
};

// Shared across every category so the combinatorial space stays huge without
// needing a hand-written archetype list per domain — 13 categories x ~8
// prefixes each, crossed with these ~28 suffixes, is 2900+ builder-class
// combinations alone (previously 4 fixed phrases per category).
const CLASS_SUFFIXES = [
  "Whisperer",
  "Alchemist",
  "Wizard",
  "Sensei",
  "Nomad",
  "Artisan",
  "Architect",
  "Sorcerer",
  "Bard",
  "Ninja",
  "Sherpa",
  "Ranger",
  "Guardian",
  "Tamer",
  "Smuggler",
  "Pirate",
  "Druid",
  "Poet",
  "Custodian",
  "Renegade",
  "Wrangler",
  "Hero",
  "Bandit",
  "Tinkerer",
  "Prototyper",
  "Mercenary",
  "Oracle",
  "Conjurer",
];

const TAGLINE_VERBS = [
  "Shipping",
  "Building",
  "Debugging",
  "Deploying",
  "Automating",
  "Prototyping",
  "Refactoring",
  "Compiling",
  "Crafting",
  "Polishing",
  "Breaking",
  "Fixing",
  "Chasing",
  "Scaling",
  "Optimizing",
  "Bootstrapping",
  "Architecting",
  "Sketching",
  "Wrangling",
  "Taming",
  "Hacking",
  "Committing To",
];

// Deterministic keyword -> flavor mapping. No external calls: same input always
// produces the same output, picked by a stable hash so results still feel varied
// across different exact phrasings within a category.
const RULES: Rule[] = [
  {
    keywords: ["ai", "ml", "machine learning", "llm", "genai", "deep learning", "neural"],
    classPrefixes: ["Prompt", "Neural", "Gradient", "Model", "Token", "Latent", "Embedding", "Inference"],
    taglineObjects: [
      "Intelligence",
      "the Future",
      "Sentience",
      "the Next Model",
      "Machine Minds",
      "the Singularity",
      "Synthetic Thought",
      "Tomorrow's Brains",
    ],
  },
  {
    keywords: ["frontend", "front-end", "react", "vue", "svelte", "next.js", "nextjs", "ui engineer", "css"],
    classPrefixes: ["Pixel", "Component", "Layout", "Interface", "Render", "Viewport", "Grid", "State"],
    taglineObjects: [
      "Every Pixel",
      "the Vibe",
      "Smooth UI",
      "Buttery Interfaces",
      "the User Experience",
      "Clean Interfaces",
      "Delightful Screens",
      "the Frontend",
    ],
  },
  {
    keywords: ["backend", "back-end", "api", "node", "server", "database", "sql", "golang", "django"],
    classPrefixes: ["Terminal", "API", "Query", "Server", "Schema", "Endpoint", "Cache", "Socket"],
    taglineObjects: [
      "the Backbone",
      "Uptime",
      "the API",
      "Server Sanity",
      "the Infrastructure",
      "Reliable Systems",
      "the Data Layer",
      "Scalable Systems",
    ],
  },
  {
    keywords: ["fullstack", "full-stack", "full stack", "swe", "software engineer", "developer", "engineer"],
    classPrefixes: ["Stack", "Full-Stack", "Ship-It", "Deploy", "Commit", "Sprint", "Build", "Release"],
    taglineObjects: [
      "End to End",
      "the Whole Stack",
      "Idea to Deploy",
      "the Full Pipeline",
      "Chaos",
      "the Product",
      "Both Ends",
      "the Entire App",
    ],
  },
  {
    keywords: ["mobile", "ios", "android", "flutter", "react native", "swift", "kotlin"],
    classPrefixes: ["Pocket", "App", "Native", "Thumb-Zone", "Widget", "Notification", "Gesture", "Sensor"],
    taglineObjects: [
      "Every Pocket",
      "the App Store",
      "Native Experiences",
      "On-the-Go Builds",
      "Thumb-First UX",
      "Every Device",
      "the Mobile Web",
      "Tomorrow's Apps",
    ],
  },
  {
    keywords: ["data", "analytics", "scientist", "analyst", "etl", "pipeline"],
    classPrefixes: ["Data", "Insight", "Pipeline", "Chart", "Metric", "Dataset", "Query", "Signal"],
    taglineObjects: [
      "Signal from Noise",
      "Insights",
      "the Numbers",
      "Clean Datasets",
      "Hidden Patterns",
      "the Pipeline",
      "Rows into Stories",
      "Tomorrow's Decisions",
    ],
  },
  {
    keywords: ["devops", "sre", "infra", "cloud", "platform", "kubernetes", "docker"],
    classPrefixes: ["Uptime", "Cloud", "Infra", "Deploy", "Container", "Cluster", "Pipeline", "Node"],
    taglineObjects: [
      "Uptime",
      "the Cloud",
      "Infrastructure",
      "Automated Deploys",
      "the Pipeline",
      "Reliability",
      "Zero Downtime",
      "the Platform",
    ],
  },
  {
    keywords: ["design", "designer", "ux", "ui/ux", "product design", "figma"],
    classPrefixes: ["Pixel", "Vibe", "Interface", "Craft", "Palette", "Layout", "Prototype", "Canvas"],
    taglineObjects: [
      "Delight",
      "the Vibe",
      "Pixel Perfection",
      "the User Journey",
      "Beautiful Interfaces",
      "the Design System",
      "Every Detail",
      "Craft",
    ],
  },
  {
    keywords: ["blockchain", "web3", "crypto", "solidity", "smart contract"],
    classPrefixes: ["Chain", "Block", "Ledger", "Gas Fee", "Wallet", "Contract", "Node", "Token"],
    taglineObjects: [
      "On Chain",
      "Trustless Systems",
      "the Ledger",
      "Decentralization",
      "Smart Contracts",
      "the Protocol",
      "Tomorrow's Money",
      "the Chain",
    ],
  },
  {
    keywords: ["security", "hacker", "pentest", "infosec", "cyber"],
    classPrefixes: ["Threat", "Exploit", "Firewall", "Vuln", "Payload", "Patch", "Cipher", "Breach"],
    taglineObjects: [
      "the Perimeter",
      "Vulnerabilities",
      "the Attack Surface",
      "Trust",
      "the Firewall",
      "Weak Links",
      "Safer Systems",
      "the Exploit",
    ],
  },
  {
    keywords: ["game", "unity", "unreal", "gamedev"],
    classPrefixes: ["Pixel", "World", "Frame-Rate", "Level", "Sprite", "Physics", "Combo", "Boss-Fight"],
    taglineObjects: [
      "Playable Worlds",
      "60 FPS",
      "the Level",
      "Fun",
      "Immersive Worlds",
      "the Game Loop",
      "Every Frame",
      "Tomorrow's Games",
    ],
  },
  {
    keywords: ["product", "pm", "founder", "entrepreneur", "cofounder", "co-founder"],
    classPrefixes: ["Roadmap", "Vision", "Scope", "Zero-to-One", "Backlog", "Metric", "Growth", "Launch"],
    taglineObjects: [
      "the Vision",
      "the Roadmap",
      "Product-Market Fit",
      "the Strategy",
      "Tomorrow's Product",
      "the Backlog",
      "Zero to One",
      "the Big Idea",
    ],
  },
  {
    keywords: ["student", "learner", "beginner"],
    classPrefixes: ["Curious", "Rookie", "First-Commit", "Sandbox", "Bug-Hunt", "Syntax", "Console", "Tutorial"],
    taglineObjects: [
      "Life",
      "the Basics",
      "First Commits",
      "Confidence",
      "the Fundamentals",
      "Tomorrow's Skills",
      "Every Bug",
      "the Learning Curve",
    ],
  },
];

const FALLBACK_CLASS_PREFIXES = [
  "Terminal",
  "Code",
  "Sunset",
  "Beach",
  "Palm-Tree",
  "Wanderlust",
  "Tide-Pool",
  "Hammock",
  "Coconut",
  "Monsoon",
];

const FALLBACK_TAGLINE_OBJECTS = [
  "the Future",
  "Good Vibes",
  "Something Great",
  "Paradise",
  "the Timeline",
  "Tomorrow",
  "Good Code",
  "the Vibe",
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

  const classPrefix = matched
    ? pick(matched.classPrefixes, seed, 1)
    : pick(FALLBACK_CLASS_PREFIXES, seed, 1);
  const builderClass = `${classPrefix} ${pick(CLASS_SUFFIXES, seed, 3)}`;

  const taglineObject = matched
    ? pick(matched.taglineObjects, seed, 13)
    : pick(FALLBACK_TAGLINE_OBJECTS, seed, 13);
  const tagline = `${pick(TAGLINE_VERBS, seed, 11)} ${taglineObject}`;

  return {
    badgeTitle: badgeTitle.toUpperCase(),
    builderClass,
    tagline,
  };
}
