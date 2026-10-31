# Super Document Skills

**Turn rough notes into visual reports, presentations, and decision briefs.**

Six free, open-source skills for AI agents. Bring your notes and tell your agent
who the document is for. Get a local HTML document you can open, edit, and share.
No account or publishing connection required.

[See the examples](examples/README.md) · [Install](#install) · [Try a complete sample](examples/try-it.md)

[![Launch video: "Coding is solved. Agent decks still suck." 47 seconds of real Claude decks with and without the skill, then a blind reviewer's verdict.](examples/previews/launch-video.png)](https://x.com/arunsingh_I/status/2116591407502700823)

## New: decision decks you'd actually send

Not happy with the decks Claude or Codex make? I gave both agents the same 12 product decisions. A blind
reviewer read every slide and said whether they'd send each deck as it is.

| | Claude Opus 5.5 | Codex (GPT-6.1 Sol) |
| --- | --- | --- |
| On its own: would send | 3 of 12 | 3 of 12 |
| **With this skill: would send** | **9 of 12** | **8 of 12** |

[![Same pricing request to Claude Opus 5.5. On its own, slide 1 has no answer and slide 2 is four identical number tiles; the reviewer wouldn't send it. With the skill, slide 1 gives the recommendation and the ask and slide 2 is one chart that makes the point; the reviewer would send it.](examples/previews/decision-deck-before-after.png)](docs/decision-deck-results.md)

Across all 24 decks, the skill took invented statements from 16 decks to 5, broken layouts from 11 to 0, and
template-looking decks from 8 to 0. It isn't a longer prompt. It's six small pieces, each fixing one thing
agents get wrong, and the agent stays free everywhere else:

- **A router** picks the method for the job: an executive decision gets the decision recipe, a talk or lesson gets the general one.
- **Argument rules**: the answer and the ask on slide 1, every option (including waiting) with the same numbers, only facts from your notes.
- **A starter layout in CSS**: a fixed frame with the title at the top and a balanced body, like a well-built web page. Lopsided slides went from 54 of 166 to 0.
- **Style as a few settings**, so the agent still draws its own charts for your decision.
- **A checker** that screenshots every slide in your Chrome so the agent fixes its own overflow, stray labels and empty space.
- **Your instructions win**: ask for your brand, your template or your own layout and the agent follows you.

[![The same pricing decision in six styles, each asked for in one line: a forest-green brand with serif titles, a dark keynote, a magazine feature, a poster layout with no title bar, a navy strategy-consulting deck, and a bright coral and sunflower deck.](examples/previews/decision-deck-styles.png)](docs/decision-deck-results.md)

```sh
# Claude Code
npx skills add arunai30/super-document-skills --agent claude-code --skill create-html-presentation --copy
# Codex
npx skills add arunai30/super-document-skills --agent codex --skill create-html-presentation --copy
```

Then give your agent your notes and the decision you need. [How it was tested, with every number](docs/decision-deck-results.md).

## New: talks and lessons that say only what you gave them

Teaching a class, giving a meetup talk, opening a conference? I gave Claude and Codex the same 12 talk and lesson
requests, three of them requests the skill was never tuned on. A blind reviewer read every slide and said whether
they'd send each deck as it is.

| | Claude Opus 5.5 | Codex (GPT-6.1 Sol) |
| --- | --- | --- |
| On its own: would send | 2 of 12 | 4 of 12 |
| **With this skill: would send** | **12 of 12** | **12 of 12** |

What the talk recipe fixes:

- **No facts you didn't give.** On its own, a moon-phases lesson gained "0–3 eclipses a year" and a "blood moon". With the skill, every fact, number and story comes from your notes; on held-out talks, facts presented as real but not in the notes went from 39 to 0 (Claude) and 9 to 1 (Codex).
- **Slides that support you, not your script.** About 30 words a slide; speaker notes go in the reply. No timers, "click to reveal" or placeholders left on a slide.
- **Titles that make the point.** Each title is a full sentence, so the titles alone tell the talk; under it, a labelled diagram, a worked example or one number.
- **Lessons that keep every step.** The example worked in stages, the common mistake shown as a mistake, and the practice answer after the question.
- **No AI look.** No emoji titles, rows of identical cards or gradients.
- **The same deck for another audience.** Ask for an engineering or sales version and the skill keeps the facts, changes the emphasis and the ask, and adds no plans of its own.

[![Same 8th grade moon-phases lesson request to Claude Opus 5.5. On its own, the slides add facts the teacher didn't give (27.3 days, 0–3 eclipses a year, a 5° tilt) with emoji and a timer on every slide; the reviewer wouldn't send it. With the skill, the core idea is drawn in three labelled stages and every phase the teacher listed appears in order; the reviewer would send it.](examples/previews/talk-before-after.png)](docs/talk-deck-results.md)

Install it with the same commands as the decision deck above; the skill picks the talk recipe for anything that
isn't a product decision, update or roadmap. [How it was tested, with every number](docs/talk-deck-results.md).

## New: start from the doc you already wrote

Already wrote the memo? Give your agent the doc and ask for the deck. The skill keeps your conclusion, your
reasoning and your caveats, and adds nothing the doc doesn't say. Before this change, every test deck made from a
finished memo added decision criteria and conditions the memo never stated; after it, a blind reviewer picked the
new deck 8 times out of 8 and would send all 8 as they are. [How it was tested](docs/doc-to-deck-results.md).

## New: roadmap decks your leadership can agree to

A roadmap deck has one job: get leadership to agree what gets built, in what order, and what that pushes out. I
gave Claude and Codex the same 12 roadmap requests, three of them requests the skill was never tuned on. A blind
reviewer read every slide and said whether they'd send each deck as it is.

| | Claude Opus 5.5 | Codex (GPT-6.1 Sol) |
| --- | --- | --- |
| On its own: would send | 0 of 12 | 2 of 12 |
| **With this skill: would send** | **12 of 12** | **11 of 12** |

What the roadmap recipe fixes:

- **No plans you didn't make.** On their own, every deck added owners, deadlines, checkpoints or "decision needed today". With the skill, dates, estimates and next steps come only from your notes.
- **No recommendation you didn't give.** When the reader has to choose, the options are set out alike.
- **Evidence at its real size.** No "biggest churn driver" for a reason 31% of exit surveys gave.
- **Honest timelines.** Quarters or now / next / later, whichever your leader wants, with confidence falling with distance and real commitments marked.
- **Tradeoffs in the open.** What each order delays and a short "not now" list, on their own slides.
- **Customer roadmaps that are safe to send.** No customer names, revenue, estimates or slips; uncertain items not promised; quarters labelled; no added marketing claims.

[![Same CEO roadmap request to Claude Opus 5.5. On its own, the timeline adds a slip risk the notes don't give and the comparison slide adds risks that tilt a neutral choice; the reviewer wouldn't send it. With the skill, one timeline shows both orders and the shared work, and the closing slide asks a neutral question built only from the notes; the reviewer would send it.](examples/previews/roadmap-before-after.png)](docs/roadmap-results.md)

Install it with the same commands as the decision deck above; the skill picks the roadmap recipe when you ask for
a roadmap. [How it was tested, with every number](docs/roadmap-results.md).

## New: product updates that don't make things up

Your VP reads your update to see where things stand and what you need. I gave Claude and Codex the same 12 product
updates, three of them requests the skill was never tuned on. A blind reviewer read every slide and said whether
they'd send each deck as it is.

| | Claude Opus 5.5 | Codex (GPT-6.1 Sol) |
| --- | --- | --- |
| On its own: would send | 0 of 12 | 2 of 12 |
| **With this skill: would send** | **12 of 12** | **11 of 12** |

[![Same CEO growth update to Claude Opus 5.5. On its own, slide 1 is three number tiles with no ask, and slide 3 says why subscriptions jumped although the notes say nobody knows yet; the reviewer wouldn't send it. With the skill, slide 1 gives where things stand and the ask, and slide 2 says the cause is unknown, names both possible causes and charts actual against target; the reviewer would send it.](examples/previews/product-update-before-after.png)](docs/product-update-results.md)

On their own, both agents explained numbers the notes couldn't explain and added owners, deadlines and
recommendations nobody made. With the skill, the reviewer flagged invented statements in 0 of 24 decks, against 16
of 24 without it. The recipe puts the state and the ask on slide 1, shows every result against its target, says
"we don't know yet" when that's true, and spends the slides on what missed or moved.

Install it with the same commands as the decision deck above; the skill picks the update recipe when you ask for a regular update.
[How it was tested, with every number](docs/product-update-results.md).

## Six skills for the documents you make

[![Cedar Studio decision brief: a conditional recommendation, a pending decision, and a complete side-by-side cost and delivery comparison.](examples/previews/client-decision-brief.png)](https://shareartifacts.dev/examples/client-decision-brief)

*A complete fictional client brief: recommendation, tradeoffs, and the decision needed. [Open the live example](https://shareartifacts.dev/examples/client-decision-brief).*

## Start with the job you need done

| I need to… | Start here | What the skill helps you do |
| --- | --- | --- |
| Turn project notes into a weekly update | [Project-management artifacts](skills/create-project-management-artifact/SKILL.md) | Surface progress, blockers, risks, and the decision needed |
| Make a complex idea understandable | [Visual explainer](skills/create-visual-explainer/SKILL.md) | Carry one concrete example through a meaningful visual |
| Help a client choose between options | [Client decision brief](skills/create-client-decision-brief/SKILL.md) | Compare costs and tradeoffs, then make a conditional recommendation |
| Turn research or results into a decision | [Visual report](skills/create-visual-report/SKILL.md) | Connect evidence, uncertainty, and a useful next step |
| Give a talk or lesson, update leadership, agree a roadmap, or get a product decision approved | [HTML presentation](skills/create-html-presentation/SKILL.md) | Build a story across a paced, browser-readable deck; tested recipes turn your notes into a talk or lesson, a decision deck, a product update against goals, or a roadmap leadership can agree to |
| Show how a request moves through a system | [Workflow diagram](skills/create-workflow-diagram/SKILL.md) | Lay out a short main path with supporting and feedback paths |

## See what your notes can become

These examples use fictional inputs. They demonstrate possible results, not a
required visual style. Follow each example to its input, exact request, and output.

| From this… | To this… | Explore |
| --- | --- | --- |
| Cohort counts and a stakeholder claim | A growth brief that checks the claim and compares the options | [Report walkthrough](examples/README.md#turn-results-into-a-decision) |
| Six rules about seat reservations | A visual explanation of why two people can see the last seat | [Explainer walkthrough](examples/README.md#make-a-complex-idea-click) |
| Pilot results and incomplete feedback | A five-slide case for a bounded next step | [Presentation walkthrough](examples/README.md#build-a-story-for-a-decision) |

[![Slide 2: a visual comparison of median first-task times, with the limits of the evidence visible.](examples/previews/onboarding-pilot-deck.png)](examples/README.md#build-a-story-for-a-decision)

*HTML presentations: a complete evidence slide, rather than just the title.*

[![Blueprint workflow diagram with an order path, supporting systems, and a confirmation return path.](examples/diagrams/checkout.webp)](examples/README.md#show-how-a-system-works)

*Workflow diagrams: named steps and labeled connections in a blueprint style.*

[Explore all six visual examples](examples/README.md), including report charts,
a worked timeline, and a weekly update. Styles are examples, not fixed templates.

## Install

For Codex, run this from your project to install the visual explainer used in
[the complete starter example](examples/try-it.md):

```sh
npx skills add arunai30/super-document-skills --agent codex --skill create-visual-explainer --copy
```

Or install all six:

```sh
npx skills add arunai30/super-document-skills --agent codex --skill '*' --copy
```

Review an existing copy before replacing it. Confirm the skill appears in your
client's skill selector or discovery list before using it.

**Using another agent?** These are portable [Agent Skills](https://agentskills.io/specification).
Use your client's supported import flow to import a complete folder from
[skills](skills), including its assets, references, and license. Client support
varies; see [manual installation and compatibility notes](docs/usage-and-validation.md#install).
A clone or ZIP download alone does not activate the skills.

## Try it with everything supplied

Start with [Why can two customers see the last seat?](examples/try-it.md)
The sample includes the complete prompt and source material, a reference output,
and a short checklist for reviewing your result.

For your own work, give the installed skill four things:

> Use create-visual-report to turn the attached pilot notes into a decision brief
> for our operations lead. Help them decide whether to extend the pilot. Compare
> the options, show the evidence and unknowns, and use a warm editorial style.
> Create a local HTML file; do not publish it.

**Your material · Your reader · The decision or takeaway · Your visual direction.**

The default output is local HTML. Several skills can honor a requested different
format when suitable tools are available; the presentation skill specifically
creates HTML decks. Open the result in a browser and review its facts and appearance
before sharing. See [format and review guidance](docs/usage-and-validation.md#use).

## Why use a skill?

Each skill gives your agent a repeatable method for choosing the story, preserving
the evidence, designing useful visuals, and checking the result. You can change
the visual direction without having to rewrite that method for every document.
The [source notes and outputs](examples/README.md) make that method inspectable.

## Want a shareable link?

After reviewing your document, you can optionally publish it with
[share/artifacts](https://shareartifacts.dev) through an already-connected compatible
MCP client. Publishing is a separate action you request; new publications default
to owner-only access. You keep the local file whether or not you publish.
[Connection instructions](https://shareartifacts.dev/connect) · [Publishing details](docs/usage-and-validation.md#optional-publishing-with-shareartifacts)

## Guides

Step-by-step write-ups on [share/artifacts](https://shareartifacts.dev/blog), with real before and after decks:

- [Presentations from Claude Code and Codex](https://shareartifacts.dev/blog/presentation-with-claude-code-or-codex)
- [Product update and decision decks with AI](https://shareartifacts.dev/blog/product-decision-and-update-decks-with-ai)
- [Product roadmap presentation with AI](https://shareartifacts.dev/blog/roadmap-presentation-with-ai)
- [Turn a document into slides with Claude](https://shareartifacts.dev/blog/document-to-slide-deck-with-claude)
- [Lesson slides with Claude, step by step](https://shareartifacts.dev/blog/lesson-slides-with-claude)
- [Why AI slides make up facts, and the fix](https://shareartifacts.dev/blog/ai-slides-make-up-facts)

## Documentation and contributing

- [Usage, compatibility, and validation](docs/usage-and-validation.md)
- [Diagram vision and supported scope](docs/diagram-vision.md)
- [Client decision brief guide](examples/client-decision-brief/README.md)
- [Report a problem or request a document type](https://github.com/arunai30/super-document-skills/issues)

When reporting a result, include the skill, agent client, intended reader, and what
was unclear. Use redacted or fictional source material when sharing an example.
Maintainers can run `node --test tests/*.test.mjs` with Node.js 24 or newer.

## License

[MIT](LICENSE). Each skill includes its own license copy.
