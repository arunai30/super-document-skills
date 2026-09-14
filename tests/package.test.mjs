import assert from "node:assert/strict";
import { readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const skillNames = ["create-html-presentation", "create-visual-explainer", "create-visual-report"];

test("three complete, independently copyable skill packages", async () => {
  assert.deepEqual((await readdir(path.join(root, "skills"))).sort(), skillNames);
  for (const name of skillNames) {
    const folder = await realpath(path.join(root, "skills", name));
    const entry = await readFile(path.join(folder, "SKILL.md"), "utf8");
    const header = entry.split("---")[1];
    assert.match(header, new RegExp(`^name: ${name}$`, "m"));
    assert.match(header, /^description: .+/m);
    assert.ok(entry.length < 15_000, `${name} entrypoint should stay focused`);
    const files = [path.join(folder, "SKILL.md"), path.join(folder, "references", "share-artifacts.md")];
    let referenceCount = 0;
    for (const file of files) {
      const content = await readFile(file, "utf8");
      for (const [, target] of content.matchAll(/\]\(([^)]+)\)/g)) {
        if (/^https?:\/\//.test(target) || target.startsWith("#")) continue;
        const resolved = await realpath(path.resolve(path.dirname(file), target));
        assert.ok(resolved.startsWith(`${folder}${path.sep}`), `${name} depends on a file outside its own folder`);
        referenceCount++;
      }
    }
    assert.ok(referenceCount > 0, `${name} must route to its included publication reference`);
  }
});

test("forward-test fixtures cover every skill and keep outputs local", async () => {
  const fixtures = JSON.parse(await readFile(path.join(root, "tests", "scenarios.json"), "utf8"));
  assert.deepEqual([...new Set(fixtures.content.map((item) => item.skill))].sort(), skillNames);
  assert.equal(fixtures.sideEffects, "local-artifacts-and-mocked-tool-calls-only");
  assert.ok(fixtures.publication.length >= 2);
  for (const fixture of fixtures.content) {
    assert.ok(fixture.request && fixture.sources.length > 0);
  }
});
