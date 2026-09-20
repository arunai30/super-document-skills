// Offline compatibility check. Import registration definitions, never connect
// to a server or invoke an operation that reads/writes user data.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const checkout = process.argv[2];
if (!checkout) {
  console.error("Usage: node tests/check-mcp-contract.mjs /absolute/path/to/product-checkout");
  process.exit(1);
}
const modulePath = path.resolve(checkout, "packages/mcp-server/dist/server.js");
try { await access(modulePath); } catch {
  console.error("Build the selected checkout's MCP package first; dist/server.js was not found.");
  process.exit(1);
}
const { registerShareHtmlTools, registerSharingTools, registerArtifactStyleTools } = await import(pathToFileURL(modulePath).href);
const definitions = new Map();
const capture = { registerTool(name, definition) { definitions.set(name, definition); } };
registerShareHtmlTools(capture, {});
registerSharingTools(capture, {});
registerArtifactStyleTools(capture, {});

const expectedInputs = {
  get_recipe: ["recipeId", "version"],
  get_artifact_style: ["format"],
  publish_html: ["title", "html", "sharing", "styleRef"],
  publish_presentation: ["title", "html", "presentation", "sharing"],
  list_pages: ["query", "status", "limit", "cursor"],
  get_page: ["pageId"],
  get_page_sharing: ["pageId"],
};
const fingerprint = [];
for (const [name, fields] of Object.entries(expectedInputs)) {
  const schema = definitions.get(name)?.inputSchema;
  assert.ok(schema, `${name} is unavailable`);
  assert.deepEqual(Object.keys(schema.shape).sort(), fields.sort(), `${name} arguments changed; review its skill references`);
  fingerprint.push([name, schema.toJSONSchema()]);
}
const parse = (name, input) => definitions.get(name).inputSchema.safeParse(input);
for (const recipeId of ["visual-report", "infographic-explainer", "presentation-deck"]) assert.ok(parse("get_recipe", { recipeId }).success);
assert.ok(parse("get_recipe", { recipeId: "client-decision-brief", version: 1 }).success);
for (const format of ["report", "explainer"]) assert.ok(parse("get_artifact_style", { format }).success);
assert.equal(parse("get_artifact_style", { format: "presentation" }).success, false);
const html = "<!doctype html><html><head><title>Local fixture</title></head><body><main>Local fixture only</main></body></html>";
assert.ok(parse("publish_html", { html, sharing: { mode: "private" } }).success);
assert.ok(parse("publish_html", { html, sharing: { mode: "public" } }).success);
assert.ok(parse("publish_html", { html, sharing: { mode: "restricted", methods: { recipients: ["reader@example.org"] } } }).success);
const deck = parse("publish_presentation", { html });
assert.ok(deck.success);
assert.deepEqual(deck.data.presentation, { schemaVersion: 1, aspectRatio: "16:9" });
assert.equal(parse("publish_presentation", { html, styleRef: {} }).success, false);
assert.equal(parse("publish_html", { html, sharing: { mode: "restricted", methods: { password: { action: "keep" } } } }).success, false);
console.log("Optional MCP input contract passed (registration/schema validation only; no publishing).");
console.log(`Input-contract SHA256: ${createHash("sha256").update(JSON.stringify(fingerprint)).digest("hex")}`);
