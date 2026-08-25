// Validates data/questions.json against the app's data contract before a
// build: every entry has non-empty options, a known category, and no exact
// duplicates. Categories must stay in sync with CATEGORY_ORDER in
// src/lib/theme.ts and the CategoryName union in src/lib/types.ts.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const questions = JSON.parse(
  readFileSync(path.join(root, "data", "questions.json"), "utf8")
);

const CATEGORIES = new Set([
  "Deep Thoughts",
  "Family",
  "Friends",
  "Dating",
  "Occupation",
  "Dreams",
  "Recreation",
  "Less of Two Evils",
]);

const errors = [];
if (!Array.isArray(questions) || questions.length === 0) {
  errors.push("questions.json must be a non-empty array");
}

const seen = new Set();
for (const [i, q] of questions.entries()) {
  if (typeof q.option1 !== "string" || q.option1.trim() === "") {
    errors.push(`#${i}: missing/empty option1`);
  }
  if (typeof q.option2 !== "string" || q.option2.trim() === "") {
    errors.push(`#${i}: missing/empty option2`);
  }
  if (!CATEGORIES.has(q.category)) {
    errors.push(`#${i}: unknown category ${JSON.stringify(q.category)}`);
  }
  if (q.option1 === q.option2) {
    errors.push(`#${i}: option1 and option2 are identical`);
  }
  const key = `${q.option1}|${q.option2}`;
  if (seen.has(key)) {
    errors.push(`#${i}: duplicate question (${key.slice(0, 80)})`);
  }
  seen.add(key);
}

if (errors.length > 0) {
  console.error(`questions.json failed validation — ${errors.length} issue(s):`);
  for (const e of errors.slice(0, 25)) console.error(`  - ${e}`);
  if (errors.length > 25) console.error(`  … and ${errors.length - 25} more`);
  process.exit(1);
}

console.log(
  `questions.json OK — ${questions.length} questions across ${CATEGORIES.size} categories.`
);
