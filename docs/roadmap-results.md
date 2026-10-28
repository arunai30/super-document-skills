# Roadmap deck: how it was tested

The roadmap recipe in [create-html-presentation](../skills/create-html-presentation/SKILL.md) is for the deck a
product manager uses to get leadership to agree what gets built, in what order, and what that pushes out. It also
makes the customer-facing version sales can show prospects. It was released after it beat Claude and Codex
working on their own, including on requests it was never tuned on.

## What it solves

What Claude and Codex got wrong on their own, in 24 roadmap decks made before the recipe existed, and what the
recipe does instead:

- **Plans nobody made.** Every one of the 24 decks added owners, checkpoints, deadlines ("Decision needed
  today") or rules like "if any estimate slips, Workday is the item that moves". The recipe puts a date, estimate,
  owner or next step on a slide only when your notes give it.
- **Recommendations you didn't make.** Asked to let the reader choose, Codex recommended an option anyway. The
  recipe sets the options out alike and shows a lean only when you gave one.
- **Evidence inflated.** "The biggest churn driver" for a reason 31% of exit surveys gave. The recipe states each
  priority's evidence at its real size.
- **False precision.** The recipe uses the format your leader asks for (quarters or now / next / later), shows
  confidence falling with distance, and marks a contract or regulatory date as a commitment.
- **Tradeoffs hidden or cluttering the roadmap.** What each order delays and a short "not now" list get their own
  slides; the roadmap picture stays clean.
- **Customer roadmaps that leak or overpromise.** On their own, Claude dropped the quarters sales was allowed to
  share and added marketing claims and legal wording; Codex promised features the notes called uncertain. With the
  recipe: no customer names, revenue, estimates or slips, uncertain items not promised, quarters labelled, and
  each item described in your own terms.
- **Too many items.** Long idea lists fold into about ten themes or fewer.

## Where the method comes from

Marty Cagan's "The Alternative to Roadmaps" (outcomes over features; dates only as rare, firm commitments),
ProdPad's Now-Next-Later guide (dates only when "real, externally driven, or strategically important"), Aha!'s
guide to presenting roadmaps to executives, and r/ProductManagement threads on roadmap reviews. Where they
disagree, the recipe follows the reader: one thread's leadership "won't accept Now, Next, Later columns", and its
top reply was "Plan for one year. Commit to next quarter."

## The test

- **Agents:** Claude Code with Claude Opus 5.5, and Codex with GPT-6.1 Sol. Each made every deck twice on its own and twice with the skill.
- **Requests:** six roadmap asks written like real ones, with notes:
  - an H1 roadmap for a CPO who wants quarters, where the work is 12 engineer-weeks over capacity and one item has a contract date
  - a new PM turning 14 unsized ideas into now / next / later, in at most six slides
  - a customer-facing roadmap built from internal notes that hold things prospects must not see
  - a pasted annual plan for the exec team, formal, with a regulatory deadline and a dependency
  - a one-year timeline for a CEO choosing between two orders, five slides, punchy
  - a re-plan showing what moves if the team takes its biggest customer's request

  The last three were held out: the skill was never tuned on them.
- **Reviewer:** a blind model reviewer that read every slide image of two decks for the same request without knowing which used the skill, answered a fixed checklist for each and picked the one it would send.

## Results (24 decks each way)

| What the reviewer found | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| **Would send as it is** | 0 of 12 | **12 of 12** | 2 of 12 | **11 of 12** |
| Picked as the one to send | 0 of 12 | 12 of 12 | 2 of 12 | 10 of 12 |
| States something that isn't in the notes | 12 | 0 | 5 | 0 |
| Broken layout | 7 | 0 | 8 | 0 |
| Too long for what was asked | 9 | 0 | 5 | 0 |
| Looks like a template or AI default | 6 | 0 | 0 | 0 |
| Working notes left on a slide | 5 | 0 | 8 | 5 |
| Looks plain or sparse | 2 | 1 | 0 | 3 |
| Looks better of the pair | 3 of 12 | 9 of 12 | 6 of 12 | 6 of 12 |

On the three held-out requests, the reviewer picked the deck made with the skill 6 of 6 times for Claude and 5 of 6
for Codex.

A separate checker read every held-out deck's text against a fixed list of what the reader needs (the skill never
sees it). Coverage was the same with or without the skill (Claude 60 of 60, Codex 56 of 60). What changed is
what the agents added:

| Lines the checker found that the notes don't support (held-out, 6 decks each) | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| Invented dates, estimates, owners, next steps or recommendations | 20 | 1 | 25 | 16 |
| Other invented claims | 33 | 8 | 16 | 12 |

Routing: 12 of 12 roadmap requests went to this recipe on Claude and 10 of 12 on Codex; Codex sent the re-plan
framed as "approve or decline" to the [decision deck](decision-deck-results.md) both times, and both of those
decks were ones the reviewer would send. Decision, update and talk requests still went to their own recipes.

## What's next

- Codex with the skill still adds some plans of its own on held-out requests (16 lines, down from 25) and looks
  better in 6 of 12 pairs. Those are next.
- A re-plan framed as "approve or decline" sits between the roadmap and decision recipes; the router will get a
  clearer rule, tested on new requests.
- The principles come from Cagan, ProdPad, Aha! and practitioner threads; we're checking them with working product
  managers.

Every release goes through the same test against the agents on their own.
