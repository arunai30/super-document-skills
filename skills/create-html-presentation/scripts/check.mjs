#!/usr/bin/env node
// Renders a slide deck in headless Chrome and lists layout and wording problems, slide by slide.
// Usage: node check.mjs deck.html
// Saves a 1280px screenshot of every slide to _check/slide-NN.png next to the deck; look at each one.
// Needs Node 22+ and Google Chrome or Chromium (set CHROME_PATH if it isn't found). No npm packages.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error("Usage: node check.mjs deck.html");
  process.exit(2);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ];
  // Browsers that Playwright or Puppeteer already downloaded.
  for (const cache of [join(process.env.HOME || "", "Library/Caches/ms-playwright"), join(process.env.HOME || "", ".cache/ms-playwright")]) {
    if (!existsSync(cache)) continue;
    for (const dir of readdirSync(cache).filter((d) => d.startsWith("chromium")).sort().reverse()) {
      candidates.push(
        join(cache, dir, "chrome-mac/Chromium.app/Contents/MacOS/Chromium"),
        join(cache, dir, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
        join(cache, dir, "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
        join(cache, dir, "chrome-linux/chrome"),
        join(cache, dir, "chrome-linux64/chrome"),
      );
    }
  }
  return candidates.find((p) => p && existsSync(p));
}

const chromePath = findChrome();
if (!chromePath) {
  console.log("NO BROWSER: Chrome or Chromium was not found, so the deck was not rendered. Check it by reading the HTML against the checklist, and tell the user the visual check was not done.");
  process.exit(3);
}

const profile = mkdtempSync(join(tmpdir(), "deck-check-"));
const chrome = spawn(chromePath, [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run",
  "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

const wsUrl = await new Promise((done, fail) => {
  let buffer = "";
  const timer = setTimeout(() => fail(new Error("Chrome did not start within 20 seconds")), 20000);
  chrome.stderr.on("data", (chunk) => {
    buffer += chunk;
    const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) { clearTimeout(timer); done(match[1]); }
  });
  chrome.on("exit", () => fail(new Error("Chrome exited before it was ready")));
}).catch((error) => {
  console.log(`NO BROWSER: ${error.message}, so the deck was not rendered. Check it by reading the HTML against the checklist, and tell the user the visual check was not done.`);
  process.exit(3);
});

// Minimal Chrome DevTools Protocol client over the built-in WebSocket.
const socket = new WebSocket(wsUrl);
await new Promise((done) => socket.addEventListener("open", done, { once: true }));
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { done, fail } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? fail(new Error(message.error.message)) : done(message.result);
  }
});
const send = (method, params = {}, sessionId) => new Promise((done, fail) => {
  const id = ++nextId;
  pending.set(id, { done, fail });
  socket.send(JSON.stringify({ id, method, params, sessionId }));
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (method, params) => send(method, params, sessionId);
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

async function open(width) {
  await page("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await page("Page.navigate", { url: pathToFileURL(resolve(file)).href });
  await wait(700);
}
async function evaluate(fn, arg) {
  const { result, exceptionDetails } = await page("Runtime.evaluate", {
    expression: `(${fn})(${JSON.stringify(arg)})`, returnByValue: true, awaitPromise: true,
  });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
}

// Runs inside the page. Returns the problems found on each slide at this width.
function inspect({ width }) {
  const NOTE = /\bTBD\b|\bTBC\b|\bTK\b|placeholder|replace with|swap in|lorem ipsum|:\s*open\b|\b(still|remains?) open\b|\bto (be )?confirm(ed)?\b|\bneeds? confirm|\bnot (yet )?(set|known|decided|agreed|assigned)\b|\bunspecified\b|\bunconfirmed\b|\bstill missing\b|\bto be (agreed|decided|set|determined)\b|\bremains? to be\b|\b(in|from) (the|these|our|supplied|your) notes\b|\bthe notes (don.t|do not|say)\b|\bfor my manager\b|\bsupplied\b|\bnote to self\b|\bplease confirm\b|(^|[.:;]\s*)confirm\b|\bneeds? (customer |further |more )?(validation|validating|assessment|review|modell?ing|engineering rates|rates)\b|\bassign (review )?owners?\b/i;
  const slides = [...document.querySelectorAll("section.share-slide")];
  const out = { slides: slides.length, scripts: document.querySelectorAll("script").length, pageScroll: false, problems: [] };
  const add = (i, text) => out.problems.push({ slide: i + 1, text });
  const short = (s) => { s = s.replace(/\s+/g, " ").trim(); return s.length > 50 ? s.slice(0, 50) + "…" : s; };
  const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const inside = (a, b) => a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
  out.pageScroll = document.documentElement.scrollWidth > window.innerWidth + 2;

  const mains = document.querySelectorAll("main");
  if (width >= 1000 && mains.length !== 1) out.problems.push({ slide: 0, text: `the deck has ${mains.length} main elements; keep exactly one main.share-presentation` });
  const main = document.querySelector("main.share-presentation");
  if (width >= 1000 && main && ![...main.classList].some((c) => c.startsWith("style-"))) out.problems.push({ slide: 0, text: "main has no style class; add style-default or another preset" });
  const wordSet = (t) => new Set(t.toLowerCase().match(/[a-z0-9$%]+/g) || []);

  slides.forEach((slide, i) => {
    const s = slide.getBoundingClientRect();
    // A second large line under the title reads as a doubled headline; on the closing slide the title is the ask.
    const h2 = slide.querySelector("h2");
    if (width >= 1000 && h2) {
      const titleSize = parseFloat(getComputedStyle(h2).fontSize);
      for (const el of slide.querySelectorAll("p,div,h3,h4,blockquote")) {
        if (el.closest(".chart,table,svg") || !el.textContent.trim() || parseFloat(getComputedStyle(el).fontSize) < titleSize * 0.75) continue;
        const a = wordSet(h2.textContent), b = wordSet(el.textContent);
        const shared = [...b].filter((w) => a.has(w) && w.length > 3).length;
        if (i === slides.length - 1 || shared >= Math.min(3, b.size / 2)) { add(i, `a second headline sits under the title ("${short(el.textContent)}"); make the title say it and remove the extra line`); break; }
      }
    }
    const cs = getComputedStyle(slide);
    if (slide.scrollHeight > slide.clientHeight + 2 || slide.scrollWidth > slide.clientWidth + 2) add(i, "content overflows the slide");
    if (width >= 1000 && s.height > s.width * 9 / 16 + 3) add(i, `slide is taller than 16:9 (${Math.round(s.height)}px for ${Math.round(s.width)}px wide); cut words or split it`);

    // Anything drawn outside the slide.
    for (const el of slide.querySelectorAll("h1,h2,h3,p,li,td,th,dt,dd,svg,table,img")) {
      // Charts inside a sideways-scrolling container are meant to scroll on phones.
      const scroller = el.closest(".chart") || [...slide.querySelectorAll("*")].find((a) => a.contains(el) && ["auto", "scroll"].includes(getComputedStyle(a).overflowX));
      const r = (scroller || el).getBoundingClientRect();
      if (r.width && (r.right > s.right + 1 || r.bottom > s.bottom + 1)) { add(i, `"${short(el.textContent)}" runs past the slide edge`); break; }
    }

    if (width < 1000) return; // The checks below are for the desktop layout.

    // Titles: more than two lines, or wrapped although they would fit on one line.
    const title = slide.querySelector("h2") || slide.querySelector("h1");
    if (title) {
      const ts = getComputedStyle(title);
      const lh = parseFloat(ts.lineHeight) || parseFloat(ts.fontSize) * 1.2;
      const range = document.createRange(); range.selectNodeContents(title);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      const lines = new Set(rects.map((r) => Math.round(r.top / (lh * 0.6)))).size;
      // A title in a column (for example .split) is meant to wrap; one across the slide should stay on one or two lines.
      const content = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const inColumn = title.parentElement.getBoundingClientRect().width < content * 0.8;
      if (lines > (inColumn ? 3 : 2)) add(i, `title runs to ${lines} lines; shorten it`);
      if (lines > 1 && title.tagName === "H2" && !inColumn) {
        const probe = title.cloneNode(true);
        probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;max-width:none;width:auto";
        title.parentElement.appendChild(probe);
        const natural = probe.getBoundingClientRect().width;
        probe.remove();
        if (natural <= content) add(i, "title wraps although it would fit on one line; remove its width limit");
      }
    }

    // Table headers and short labels that wrap onto a second line.
    for (const el of slide.querySelectorAll("th, dt")) {
      if (!el.textContent.trim()) continue;
      // Count the rendered lines of the label's text, not the cell height (cells stretch to their row).
      const range = document.createRange(); range.selectNodeContents(el);
      const tops = new Set([...range.getClientRects()].filter((b) => b.width > 1).map((b) => Math.round(b.top / 4)));
      if (tops.size > 1) add(i, `label "${short(el.textContent)}" wraps onto two lines; shorten it or widen its column`);
    }

    // Boxed HTML elements whose text spills out.
    for (const el of slide.querySelectorAll("*")) {
      if (el.closest("svg") || !el.textContent.trim()) continue;
      const es = getComputedStyle(el);
      const boxed = es.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(es.borderTopWidth) > 0;
      if (boxed && el.clientWidth > 0 && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)) add(i, `text spills out of its box: "${short(el.textContent)}"`);
    }

    // Charts: labels cut off by the chart edge, crossing the edge of a bar, overlapping each other, or too small to read.
    for (const svg of slide.querySelectorAll("svg")) {
      const box = svg.getBoundingClientRect();
      const texts = [...svg.querySelectorAll("text")].filter((t) => t.textContent.trim());
      const marks = [...svg.querySelectorAll("rect, circle, ellipse, polygon")].map((m) => m.getBoundingClientRect())
        .filter((m) => m.width > 2 && m.height > 2 && !(m.width >= box.width * 0.95 && m.height >= box.height * 0.95));
      const rects = texts.map((t) => t.getBoundingClientRect());
      texts.forEach((t, k) => {
        const r = rects[k];
        if (!inside(r, box)) add(i, `chart label "${short(t.textContent)}" is cut off at the chart edge`);
        if (marks.some((m) => overlap(r, m) && !inside(r, m) && !inside(m, r))) add(i, `chart label "${short(t.textContent)}" crosses the edge of a bar or shape; move it inside or beside the mark`);
        for (let j = k + 1; j < texts.length; j += 1) if (overlap(r, rects[j])) add(i, `chart labels "${short(t.textContent)}" and "${short(texts[j].textContent)}" overlap`);
        const px = r.height / 1.2;
        if (px < 11) add(i, `chart label "${short(t.textContent)}" renders at about ${Math.round(px)}px; make chart text larger`);
      });
    }

    // A bar or shape with no label on or beside it: the reader can't tell what it stands for.
    for (const svg of slide.querySelectorAll("svg")) {
      const box = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll("text")].filter((t) => t.textContent.trim()).map((t) => t.getBoundingClientRect());
      for (const m of svg.querySelectorAll("rect, circle, ellipse, polygon, path")) {
        const r = m.getBoundingClientRect(), fill = getComputedStyle(m).fill;
        if (r.width < 6 || r.height < 6 || fill === "none" || (r.width >= box.width * 0.9 && r.height >= box.height * 0.6)) continue;
        const near = { left: r.left - 28, right: r.right + 28, top: r.top - 14, bottom: r.bottom + 14 };
        if (!labels.some((l) => overlap(l, near))) { add(i, "a bar or shape in a chart has no label on or beside it; label it or remove it"); break; }
      }
    }

    // A single word left alone on the last line of a title or a short statement (up to three lines), where it shows.
    for (const el of slide.querySelectorAll("h1, h2, h3, p, li, dd, td, blockquote")) {
      if (el.closest("svg")) continue;
      const tops = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        for (const m of n.textContent.matchAll(/\S+/g)) {
          const range = document.createRange(); range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
          const b = range.getBoundingClientRect(); if (b.width > 0) tops.push(b.top);
        }
      }
      if (tops.length < 4) continue;
      const lh = parseFloat(getComputedStyle(el).fontSize) * 0.6;
      const last = Math.max(...tops), onLast = tops.filter((t) => Math.abs(t - last) < lh).length;
      const lines = new Set(tops.map((t) => Math.round(t / lh))).size;
      if (onLast === 1 && tops.some((t) => last - t >= lh) && lines <= 3) { add(i, `"${short(el.textContent)}" leaves one word alone on its last line; reword it or let the box run wider`); }
    }

    // Space: content not in a stage, a block sitting off-balance or a stage-top slide with the lower part empty, or nothing in the right half.
    const stage = slide.querySelector(":scope > .stage");
    if (!stage) add(i, i === 0 ? "put the cover's content inside one <div class=\"stage\">, as the starter does" : "put everything under the title inside one <div class=\"stage\">, as the starter does, so it sits balanced under the title");
    else if (i > 0 && !(slide.firstElementChild?.matches("h2") && stage.previousElementSibling === slide.firstElementChild)) add(i, "keep the title as the slide's first element, above the .stage, so it sits in the same place on every slide (unless the user asked for a different layout)");
    if (i > 0) {
      const left = s.left + parseFloat(cs.paddingLeft), right = s.right - parseFloat(cs.paddingRight);
      const top = s.top + parseFloat(cs.paddingTop), bottom = s.bottom - parseFloat(cs.paddingBottom);
      let lowest = top, highest = bottom, rightmost = left;
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
      const boxes = [];
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim() || n.parentElement.closest("svg")) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        boxes.push(...range.getClientRects());
      }
      slide.querySelectorAll("svg, table, img").forEach((el) => boxes.push(el.getBoundingClientRect()));
      for (const b of boxes) { if (b.width < 1 || b.height < 1) continue; lowest = Math.max(lowest, b.bottom); highest = Math.min(highest, b.top); rightmost = Math.max(rightmost, b.right); }
      // Coverage on a 32 x 18 grid over the usable area: a cell counts when a text line, chart or table touches it.
      const cells = new Set();
      for (const b of boxes) {
        if (b.width < 1 || b.height < 1) continue;
        const x0 = Math.max(0, Math.floor(((b.left - left) / (right - left)) * 32)), x1 = Math.min(31, Math.floor(((b.right - left - 1) / (right - left)) * 32));
        const y0 = Math.max(0, Math.floor(((b.top - top) / (bottom - top)) * 18)), y1 = Math.min(17, Math.floor(((b.bottom - top - 1) / (bottom - top)) * 18));
        for (let x = x0; x <= x1; x += 1) for (let y = y0; y <= y1; y += 1) cells.add(x * 100 + y);
      }
      const fill = cells.size / (32 * 18);
      if (fill < 0.35) add(i, `the slide looks sparse (content covers ${Math.round(fill * 100)}% of the space); add the chart or grid the claim needs, set the key line large, or merge the slide`);
      let sTop = top, sBottom = bottom, sLow = lowest, sHigh = highest;
      if (stage) {
        const r = stage.getBoundingClientRect(), scs = getComputedStyle(stage);
        sTop = r.top + parseFloat(scs.paddingTop); sBottom = r.bottom;
        const inside = boxes.filter((b) => b.width >= 1 && b.height >= 1 && b.top >= r.top - 1 && b.bottom <= r.bottom + 1);
        if (inside.length) { sLow = Math.max(...inside.map((b) => b.bottom)); sHigh = Math.min(...inside.map((b) => b.top)); }
      }
      const emptyBelow = (sBottom - sLow) / (bottom - top), emptyAbove = (sHigh - sTop) / (bottom - top);
      if (stage && stage.classList.contains("stage-top")) {
        if (emptyBelow > 0.35) add(i, `the bottom ${Math.round(emptyBelow * 100)}% of the slide is empty; drop stage-top so the stage centres the body, enlarge the chart or set the key line large`);
      } else if (Math.abs(emptyAbove - (emptyAbove + emptyBelow) / 3) > 0.12) add(i, `the content sits ${emptyAbove > (emptyAbove + emptyBelow) / 3 ? "low" : "high"} (${Math.round(emptyAbove * 100)}% empty above, ${Math.round(emptyBelow * 100)}% below); keep the body as one block in the .stage so it sits a little above the middle, without fixed margins or spacers`);
      if ((rightmost - left) / (right - left) < 0.55) add(i, "the right half of the slide is empty; use the full width");
    }

    // Wording: too many words, or text that reads like a working note.
    const text = slide.innerText;
    const clone = slide.cloneNode(true);
    clone.querySelectorAll("svg, h1, h2").forEach((el) => el.remove());
    const words = (clone.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%$-]*/gu) || []).length;
    if (i > 0 && words > 70) add(i, `${words} words of body text outside charts; aim for about 40`);
    for (const line of text.split("\n")) {
      const m = line.match(NOTE);
      if (m) add(i, `"${short(line)}" reads like a working note ("${m[0]}"); ask the reader a full-sentence question with its reason, move a fact the requester knows to your reply, or cut it`);
    }
  });
  return out;
}

const problems = [];
await open(1280);
const desk = await evaluate(inspect, { width: 1280 });
if (!desk.slides) problems.push("no section.share-slide elements found");
if (desk.scripts) problems.push(`the deck contains ${desk.scripts} script element(s); remove them`);
for (const p of desk.problems) problems.push(`slide ${p.slide}: ${p.text}`);

// Screenshots of every slide at 1280px.
const shots = join(dirname(resolve(file)), "_check");
rmSync(shots, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
const boxes = await evaluate(() => [...document.querySelectorAll("section.share-slide")].map((s) => {
  const r = s.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
}));
const names = [];
for (const [k, b] of boxes.entries()) {
  const { data } = await page("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  const name = `slide-${String(k + 1).padStart(2, "0")}.png`;
  writeFileSync(join(shots, name), Buffer.from(data, "base64"));
  names.push(name);
}

await open(390);
const phone = await evaluate(inspect, { width: 390 });
if (phone.pageScroll) problems.push("phone (390px): the page scrolls sideways");
for (const p of phone.problems) problems.push(`phone (390px), slide ${p.slide}: ${p.text}`);

socket.close();
const exited = new Promise((done) => chrome.once("exit", done));
chrome.kill();
await Promise.race([exited, wait(3000)]);
try { rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* temp folder; the OS clears it */ }

const unique = [...new Set(problems)];
console.log(`${desk.slides} slides checked at 1280px and 390px.`);
console.log(unique.length ? `${unique.length} problem(s):\n- ${unique.join("\n- ")}` : "No problems found by the script.");
console.log(`Screenshots: ${shots}/ (${names.join(", ")}). Open and look at every one: the script cannot judge everything.`);
process.exit(unique.length ? 1 : 0);
