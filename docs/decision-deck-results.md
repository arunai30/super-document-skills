# Decision deck: how it was tested

The decision-deck recipe in [create-html-presentation](../skills/create-html-presentation/SKILL.md) was released
only after it beat Claude and Codex working on their own, on requests it was never tuned on.

## The test

- **Agents:** Claude Code with Claude Opus 5.5, and Codex with GPT-6.1 Sol. Each made every deck twice on its own and twice with the skill.
- **Requests:** six product decisions written like real asks, with notes:
  - build SSO or bulk export first
  - shut down a tablet app
  - an onboarding checklist or a product tour
  - three pricing options
  - an API sunset from a pasted meeting doc
  - build or buy search

  The last three were held out: the skill was never tuned on them.
- **Reviewer:** a blind model reviewer that read every slide image of two decks for the same request without knowing which used the skill. It answered a fixed checklist for each deck and picked the one it would send.
- **Checklist:** built from what people complain about in AI-made decks (Reddit, Hacker News and published surveys):
  - invented facts
  - no clear position
  - the AI template look
  - broken layout
  - too long
  - working notes left on slides

## Results (24 decks each way)

| What the reviewer found | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| **Would send as it is** | 3 of 12 | **9 of 12** | 3 of 12 | **8 of 12** |
| States something that isn't in the notes | 8 | 3 | 8 | 2 |
| Too long for what was asked | 5 | 2 | 9 | 0 |
| Broken layout | 5 | 0 | 6 | 0 |
| Working notes left on a slide | 3 | 1 | 8 | 5 |
| Looks like a template or AI default | 8 | 0 | 0 | 0 |
| Looks better of the pair | 3 of 12 | 9 of 12 | 7 of 12 | 5 of 12 |

Coverage of what each decision depends on, checked against a fixed list per request that the skill never sees:
95% for Claude and 93% for Codex with the skill.

## What's in the skill, and why

Each piece fixes one kind of problem. The agent is free everywhere else.

| Piece | Fixes | Evidence |
| --- | --- | --- |
| Router (`SKILL.md`) | One general method for every deck | 12 of 12 decision requests and 4 of 4 talk requests went to the right recipe, on both agents |
| Argument rules (`recipes/pm-decision-deck.md`) | Invented numbers, no position, unfair options, "TBD" left for the reader | Invented: 16 decks → 5. "Proposed" labels: 15 of 24 → 0. Codex coverage 85% → 93% after "every option gets the same numbers" |
| Starter layout in CSS (`assets/starter.html`) | Lopsided slides, titles that jump between slides | Lopsided slides 54 of 166 → 0; title drift within a deck up to 22 points → 0 |
| Style settings | The AI template look | Template-looking decks 8 → 0; agents still draw their own charts |
| Checker (`scripts/check.mjs`) | Overflow, unlabeled bars, one-word lines, decks nobody looked at | Broken layouts 11 → 0 |
| Your instructions win | A skill overriding what you asked for | Every default says to follow your layout, template or slide count |

## What didn't work

- **Layout rules in prose.** Claude followed an optional "compose freely" layout on 22 of 93 slides; Codex on 0 of 72. Defaults moved into the starter CSS reached both.
- **A locked chart kit.** Restricting agents to fixed bars and a timeline lost 10 of 12 comparisons. Judges missed the custom diagrams.
- **Examples close to a test request.** One example that resembled a request was copied by both agents and cost both comparisons on it. Examples in the skill now come from domains no test request uses.

## What's next

- Codex with the skill is sent 9 of 12 times when the reviewer picks between the pair, and looks better in 5 of 12. Its looks are next.
- Statements the reviewer couldn't trace to the notes are down from 16 decks to 5.

Every release goes through the same test against the agents on their own.
