# Roadmap review deck

Read [the shared base](_common.md) first; this recipe adds to it.

## Must

- One self-contained static HTML file, built on the starter's `main.share-presentation` and `section.share-slide` structure. No scripts, navigation buttons or slide controls.
- Every slide fits its 16:9 frame at 1280px wide. If a slide's content doesn't fit, cut words or split the slide; never let it grow taller.
- About 40 words of body text per slide; slide titles about 8 to 10 words.
- Usually 5 to 8 slides. If the user names a slide count, keep to it and say in your reply what didn't fit.
- Use only facts and numbers from the user's material; calculations from them are fine, and check every calculation in the material too.
- Put a date, estimate, quarter, owner or order on the roadmap only where the material gives it or it follows directly from the material's own numbers. Add no next steps, checkpoints, contingency rules or success targets of your own.
- Report only the asks the material contains. When the reader must choose, set out each option with the same facts and give no recommendation unless the requester gave one.
- Sort every gap in the notes. A choice only the reader can make goes on the slide as a full-sentence question with its reason. A fact the requester knows goes to the requester as a question in your reply, never to the reader. Never leave "TBD", "[date]", "proposed" tags or "source: supplied notes" on a slide.
- Before handing over, render the deck with `check.mjs`, look at every slide, fix what is wrong and check again (see "Check it, fix it, check again").

Create a roadmap deck that gets a leader to agree what gets built, in what order, and what that pushes out. It must work as a pre-read, without you presenting, and the reader will question the priorities. Slide 1 answers first: in a sentence each, what we will focus on, the goal it serves and what we need the reader to agree. Every slide title is a claim, so the titles read in order make the case; keep one idea per slide. Start from the goals: put every item under the goal or outcome it serves, and group the roadmap by goal, not by team or ticket; if an item serves no stated goal, say so. Show confidence falling with distance: near-term work as specific items, later work as themes or problems still being shaped, and a committed date (a contract, a regulation, a launch the material names) marked as a commitment. Use the format the reader asks for: quarters if they want a timeline, now/next/later if that suits them; the format never adds precision the material lacks, so an item the material doesn't date stays undated or sits in a wider band. Make the case for the order: beside each priority, the evidence the material gives for it (a customer count, a revenue figure, a deadline, a dependency, a share of complaints), stated at its real size; call something the biggest or the main driver only when the material says so. Keep the number of items small: about ten themes or fewer across the plan and a handful in the near term; fold long idea lists into themes and put what isn't happening on a short "not now" slide with the reason for each. When the material gives capacity and estimates, show what fits and what doesn't as a to-scale picture, and say what each choice delays. Show the tradeoffs on their own slides; keep the roadmap picture itself clean. If the requester is unsure of the order, don't manufacture conviction: say what the order rests on and what evidence would change it. End with the ask as the closing slide's title, with no second large line restating it: what the reader should agree, choose or approve, and by when if the material says.

When the deck is for customers or prospects (for example a roadmap sales will show), it is a different document. Keep only what customers may see: what shipped, what is being built and what is planned, at the confidence the material gives it. Leave out every internal detail: customer names, revenue, estimates, capacity, schedule slips, legal or partner negotiations, confidence notes written for staff, and anything the material says not to share. Omit an item the material calls uncertain, or mark it as being considered; don't promise it. When the material allows quarters, label each item with its quarter, as customers and sales will look for it; give no finer dates. Describe each item in the material's own terms without adding benefits, audiences or behaviour it doesn't state, and end with one plain line saying the plan may change; don't write legal terms of your own.

Write like a direct colleague: plain verbs and specific nouns, no marketing tone or hype words, no stacked adjectives, and no lists padded to three items. If the user asks for a tone, such as formal or punchy, keep the facts and the caution and change only the wording and the style preset. Keep it clean but never bare: a timeline or now/next/later grid drawn as inline SVG or a table, a chart beside its takeaway (`.split`), two columns (`.cols`), a short sequence (`.steps`), a label-and-statement grid (`.facts`) or one short statement set large (`.big`). A slide that is only a title and a few lines of plain text looks unfinished. Use large type, one accent colour, charts drawn as inline SVG with a viewBox and drawn to scale, labels on the marks instead of legends, and balanced titles with no single-word last line. Wrap each chart in a `.chart` container, as the starter does. In charts, use `.mark` for the items the slide is about, `.mark-other` for the rest and `.label` or `.label-on` for text. Don't colour items green, amber or red unless the material gives their status. Avoid the AI-default look: rows of identical cards or big-number tiles, icons, gradients, emoji, decorative images and centred text. Nothing meant for you, such as chart coordinates or notes on how you placed items, appears on a slide. The reader has not seen your notes: never mention "the notes" or "supplied" material, and name a source only as the user named it. Keep the starter's look unless the user gives a brand, style or template. Show the draft for review; publishing needs separate approval.

## Layout for this deck

Every slide has a fixed frame: the padding, the footer line with the slide number and, on every slide after the cover, the title at the top in the same place, so a reader flipping through finds each claim where they expect it. Everything under the title goes in one `.stage`, which places it as one block a little above the middle of the space between the title and the footer, so a slide with less on it still looks balanced and stays close to its title. Add `stage-top` to a dense slide, such as a full timeline, that reads better starting right under the title. Never stretch or space content out to fill the slide. On the cover, the stage holds everything.

This layout is the default; if the user asks for a different one or gives a template, follow theirs.

## Before you hand it over

- Reading only slide 1, does a leader know what we will focus on, why, and what they must agree (or, for customers, where the product is going)?
- Does every item sit under a goal, with near-term work specific and later work shown as less certain?
- Is every date, estimate, quarter, owner, next step and recommendation on the slides in the material, and every calculation checked?
- Is the evidence for each priority stated at its real size, with nothing called "biggest" that the material doesn't call that?
- Are tradeoffs, what each choice delays and the "not now" list on their own slides, with the roadmap picture clean?
- When the reader must choose, are the options laid out the same way, with no recommendation the requester didn't make?
- For a customer-facing deck: no names, revenue, estimates, slips, internal confidence notes or uncertain promises, no added benefits, and one line saying the plan may change?
- Is each chart an SVG drawn to scale with labels on the marks, and no slide over about 40 words of body text?
- Is there no "TBD", placeholder, mention of "the notes", "proposed" tag, hype or marketing tone?
- Did `check.mjs` report no problems (or only ones you looked at and accepted), and did you look at every screenshot? If you could not render, say so.

## Optional share/artifacts publishing

Publishing is optional and needs the user's separate approval. With a connected share/artifacts client, publish an approved deck with `publish_presentation` and choose who can see it as described in [the publishing notes](../references/share-artifacts.md). Build the deck from this recipe, not from the `presentation-deck` recipe those notes mention. The share/artifacts viewer keeps this recipe's static inline SVG charts (shapes, paths, text, gradients, clip paths and markers).
