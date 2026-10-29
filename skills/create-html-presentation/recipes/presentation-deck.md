# Talk, lesson or keynote deck

Read [the shared base](_common.md) first; this recipe adds to it.

## Must

- One self-contained static HTML file, built on the starter's `main.share-presentation` and `section.share-slide` structure. No scripts, navigation buttons or slide controls.
- Every slide fits its 16:9 frame at 1280px wide. If a slide's content doesn't fit, cut words or split the slide; never let it grow taller.
- About 30 words of body text per slide; slide titles about 8 to 12 words. If the user names a slide count, keep to it and say in your reply what didn't fit.
- Use only facts, numbers, examples, names and stories from the user's material; calculations from them are fine. Add no background facts, statistics, studies, quotes or anecdotes of your own, even true ones; if the talk needs one, ask the requester in your reply.
- The speaker's words don't go on the slides. If you write speaker notes, put them in your reply, and hold them to the same rule: nothing the material doesn't support.
- Never leave "TBD", "[name]", "source: supplied notes", presenter instructions such as "click to reveal", or remarks about how you built the deck on a slide.
- Before handing over, render the deck with `check.mjs`, look at every slide, fix what is wrong and check again (see "Check it, fix it, check again").

Create a deck that helps a speaker change what an audience understands, believes or can do by the end of a talk, lesson or keynote. Decide that change first and let every slide earn its place against it. Every slide title is a claim in a full sentence, so the titles read in order tell the whole story; the body under it is the evidence for that claim, such as a diagram, a worked example, a number drawn to scale or one short statement set large, not a list of bullets. For a lesson, follow the material's own sequence and include every step, case and item it lists: the problem, the idea, one example solved in stages, each stage on the slide, the mistake people actually make, shown as a mistake, and a check or practice question, with the answer on a later slide than the question. For a persuasive talk or keynote, show where things are, what could change, the evidence for it, the objection or cost the material names stated fairly, and a single ask to close. For a talk built from a post, paper or doc, keep its argument and turn it into a spoken story: a few claims the audience will remember, each with its evidence. Pitch it to the audience the user names: plain words and an everyday comparison for non-experts, labelled as a comparison, and the mechanism and its limits for experts. Put labels on the diagram itself, next to what they name, not in a legend or a separate list. For a talk over about 10 minutes, signal the structure with a short agenda or a running marker of where you are. Keep each slide to one idea, and move detail the speaker won't show to the reply. If the user asks for a tone, such as formal, punchy or fun, keep the facts and change only the wording and the style preset. Write like a direct person: plain verbs and specific nouns, no marketing tone or hype words, no stacked adjectives, and no lists padded to three items. Keep it clean but never bare: a diagram or chart drawn as inline SVG with a viewBox and drawn to scale, a lead line beside the evidence (`.split`), two columns (`.cols`), a short sequence (`.steps`), a label-and-statement grid (`.facts`) or one short statement set large (`.big`). Wrap each chart in a `.chart` container, as the starter does. Use large type, one accent colour, and balanced titles with no single-word last line. Avoid the AI-default look: a big centred title with a thin subtitle as the only idea, rows of identical cards or big-number tiles, icons, gradients, emoji, decorative images and centred text. The audience has not seen your notes: never mention "the notes" or "supplied" material, and name a source only as the user named it. Keep the starter's look unless the user gives a brand, style or template. Show the draft for review; publishing needs separate approval.

## Layout for this deck

Every slide has a fixed frame: the padding, the footer line with the slide number and, on every slide after the cover, the title at the top in the same place. Everything under the title goes in one `.stage`, which places it as one block a little above the middle of the space between the title and the footer. Add `stage-top` to a dense slide, such as a worked example with several steps, that reads better starting right under the title. Never stretch or space content out to fill the slide. On the cover, the stage holds everything.

This layout is the default; if the user asks for a different one or gives a template, follow theirs.

## Before you hand it over

- Do the slide titles, each a full-sentence claim of at most two lines, tell the whole story in order?
- For a lesson: is every step, case and item from the material there, with the example solved in stages, the common mistake shown as a mistake, and the practice answer after the question?
- For a persuasive talk: are the evidence, the objection stated fairly and a single closing ask all there?
- Is every fact, number, example, name and story on the slides and in your speaker notes from the material, with no background facts or anecdotes added?
- Is it pitched to the named audience, with comparisons labelled as comparisons and labels on the diagrams?
- Is there no slide over about 30 words of body text, and no script, placeholder, presenter instruction or "source: supplied notes" on a slide?
- Did `check.mjs` report no problems (or only ones you looked at and accepted), and did you look at every screenshot? If you could not render, say so.

## Optional share/artifacts publishing

Publishing is optional and needs the user's separate approval. With a connected share/artifacts client, publish an approved deck with `publish_presentation` and choose who can see it as described in [the publishing notes](../references/share-artifacts.md). The share/artifacts viewer keeps this recipe's static inline SVG charts (shapes, paths, text, gradients, clip paths and markers).
