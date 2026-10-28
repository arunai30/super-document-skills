import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const folder = fileURLToPath(new URL("../skills/create-html-presentation/", import.meta.url));
const read = (file) => readFile(path.join(folder, file), "utf8");
const links = (text) => [...text.matchAll(/\]\(([^)#]+)\)/g)].map(([, target]) => target).filter((target) => !/^https?:\/\//.test(target));

test("the presentation router names every recipe it bundles, and each recipe's links stay inside the skill", async () => {
  const router = await read("SKILL.md");
  const recipes = links(router).filter((target) => target.startsWith("recipes/"));
  assert.deepEqual([...new Set(recipes)].sort(), ["recipes/_common.md", "recipes/pm-decision-deck.md", "recipes/presentation-deck.md", "recipes/product-update-deck.md", "recipes/roadmap-review-deck.md"]);
  const root = await realpath(folder);
  for (const recipe of recipes) {
    for (const target of links(await read(recipe))) {
      const resolved = await realpath(path.resolve(folder, path.dirname(recipe), target));
      assert.ok(resolved.startsWith(`${root}${path.sep}`), `${recipe} links outside the skill: ${target}`);
    }
  }
});

test("the decision-deck starter keeps the presentation contract and the frame-and-stage layout", async () => {
  const starter = await read("assets/starter.html");
  assert.equal(starter.match(/<main class="share-presentation[ "]/g).length, 1);
  const slides = [...starter.matchAll(/<section class="share-slide" id="slide-(\d+)" aria-labelledby="(s\d+)">/g)];
  assert.deepEqual(slides.map(([, n]) => Number(n)), slides.map((_, i) => i + 1));
  for (const [, , heading] of slides) assert.match(starter, new RegExp(`<h[12] id="${heading}">`));
  assert.equal(starter.match(/<div class="stage[ "]/g).length, slides.length);
  assert.doesNotMatch(starter, /<script|<iframe|<form|https?:\/\//i);
});

test("the bundled checker parses and has no install-time dependencies", async () => {
  execFileSync(process.execPath, ["--check", path.join(folder, "scripts/check.mjs")]);
  for (const [, specifier] of (await read("scripts/check.mjs")).matchAll(/^import .* from "([^"]+)"/gm)) assert.match(specifier, /^node:/);
});
