import assert from "node:assert/strict";
import { readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const names = ["create-html-presentation", "create-visual-explainer", "create-visual-report", "create-workflow-diagram"];
const allowedFiles = [
  ".github/workflows/validate.yml", ".gitignore", "LICENSE", "README.md",
  "examples/README.md", "examples/source-inputs.md",
  "examples/growth-decision-brief.html", "examples/seat-count-explainer.html",
  "examples/onboarding-pilot-deck.html", "tests/package.test.mjs",
  "tests/release.test.mjs", "tests/check-mcp-contract.mjs", "tests/scenarios.json",
  ...names.flatMap((name) => ["SKILL.md", "LICENSE", "references/share-artifacts.md"].map((file) => `skills/${name}/${file}`)),
  "tests/workflow-diagram.test.mjs",
  ...["generate.mjs","layout.mjs","render.mjs","export-static.mjs","check.mjs","theme.mjs"].map(file=>`skills/create-workflow-diagram/scripts/${file}`),
  "skills/create-workflow-diagram/references/model.html",
  "skills/create-workflow-diagram/assets/url.json",
  "skills/create-workflow-diagram/assets/webhook.json",
].sort();

async function filesWithin(folder, relative = "") {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (!relative && entry.name === ".git") continue;
    assert.equal(entry.isSymbolicLink(), false, `Do not publish a symlink: ${entry.name}`);
    const file = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path.join(folder, entry.name), file));
    else files.push(file);
  }
  return files.sort();
}

test("public release contains only the four approved packages and selected support files", async () => {
  assert.deepEqual(await filesWithin(root), allowedFiles);
});

test("each independently copied skill carries the full MIT notice", async () => {
  const license = await readFile(path.join(root, "LICENSE"), "utf8");
  assert.match(license, /^MIT License\n/);
  assert.match(license, /Copyright \(c\) 2026 arunai30/);
  for (const name of names) {
    assert.equal(await readFile(path.join(root, "skills", name, "LICENSE"), "utf8"), license);
    assert.match(await readFile(path.join(root, "skills", name, "SKILL.md"), "utf8"), /^license: MIT$/m);
  }
});

test("public documentation links resolve inside the checkout", async () => {
  const actualRoot = await realpath(root);
  for (const file of (await filesWithin(root)).filter((name) => name.endsWith(".md"))) {
    const text = await readFile(path.join(root, file), "utf8");
    for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:\/\//.test(target) || target.startsWith("#")) continue;
      const resolved = await realpath(path.resolve(root, path.dirname(file), target));
      assert.ok(resolved.startsWith(`${actualRoot}${path.sep}`), `${file}: link escapes the release`);
    }
  }
});

test("public text contains no personal filesystem paths or common credential values", async () => {
  for (const file of await filesWithin(root)) {
    const text = await readFile(path.join(root, file), "utf8");
    assert.doesNotMatch(text, /(?:\/Users\/|\/home\/|\/private\/tmp\/|file:\/\/\/)/, file);
    assert.doesNotMatch(text, /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/, file);
  }
});
