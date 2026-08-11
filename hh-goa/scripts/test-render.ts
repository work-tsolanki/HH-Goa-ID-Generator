import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { generateCard } from "../lib/card/render";

async function main() {
  const photo = readFileSync(path.join(process.cwd(), "..", "..", "Inspiration 1.png"));

  const scenarios = [
    { file: "test-noURL.png", name: "Priya Nair", stackRole: "Frontend Engineer", socialUrl: "" },
    { file: "test-garbageURL.png", name: "Riley Costa", stackRole: "DevOps", socialUrl: "not a url" },
    { file: "test-withURL.png", name: "Jordan Fernandes", stackRole: "AI Engineer", socialUrl: "x.com/jordanbuilds" },
  ];

  for (const s of scenarios) {
    const start = Date.now();
    const result = await generateCard({
      photo,
      name: s.name,
      stackRole: s.stackRole,
      socialUrl: s.socialUrl,
      shareUrl: "https://hhgoa.app/share/test123",
    });
    writeFileSync(path.join(process.cwd(), s.file), result.png);
    console.log(s.file, "rendered in", Date.now() - start, "ms —", result.builderCode, result.builderClass);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
