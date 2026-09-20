import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, readdir, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const skill = path.join(root, "skills/create-client-decision-brief");

// Reviewed v1 resources shared by the portable skill and backend recipe.
// A deliberate revision must recheck parity and use a new released recipe version.
const fingerprints = {
  "references/method.md": "6a2465e56f490a9f0aaf26e9efaf7d3aea96e94aee0d5da12ed25e09cd4079a4",
  "assets/brief.html": "c408186a3a44093035621437c64f4df0caa935acda528e4b2064c131e91dfa88",
};

test("client brief preserves the reviewed v1 method and starter", async () => {
  for (const [file, expected] of Object.entries(fingerprints)) {
    const actual = createHash("sha256").update(await readFile(path.join(skill, file))).digest("hex");
    assert.equal(actual, expected, `${file} drifted from the reviewed v1`);
  }
});

test("Cedar example and source bundle match the reviewed teaching case", async () => {
  const examples = {
    "example.html": "5cc5cc63550fdd992c0ebaabdfbf13bf0e20ad168efe75a01a7ef781482ef2f2",
    "source-notes.txt": "fc689e3f102075fdc78d63e71a23432e986a39234d82219c15cb84315703f33b",
  };
  for (const [file, expected] of Object.entries(examples)) {
    const actual = createHash("sha256").update(await readFile(path.join(root, "examples/client-decision-brief", file))).digest("hex");
    assert.equal(actual, expected, `${file} drifted from the reviewed teaching case`);
  }
});

test("client brief can be copied independently with all local resources", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "client-brief-skill-"));
  try {
    const installed = path.join(scratch, "create-client-decision-brief");
    await cp(skill, installed, { recursive: true });
    const installedRoot = await realpath(installed);
    const walk = async (folder) => {
      for (const entry of await readdir(folder, { withFileTypes: true })) {
        assert.equal(entry.isSymbolicLink(), false);
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) { await walk(file); continue; }
        if (!file.endsWith(".md")) continue;
        for (const [, target] of (await readFile(file, "utf8")).matchAll(/\]\(([^)]+)\)/g)) {
          if (/^https?:\/\//.test(target) || target.startsWith("#")) continue;
          const resolved = await realpath(path.resolve(path.dirname(file), target));
          assert.ok(resolved.startsWith(`${installedRoot}${path.sep}`), "Installed skill requires a file outside its folder");
        }
      }
    };
    await walk(installed);
    for (const file of ["SKILL.md", "LICENSE", "agents/openai.yaml", "references/method.md", "references/evidence.md", "references/share-artifacts.md", "assets/brief.html"]) {
      assert.deepEqual(await readFile(path.join(installed, file)), await readFile(path.join(skill, file)));
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
