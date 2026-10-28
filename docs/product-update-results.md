# Product update deck: how it was tested

The product-update recipe in [create-html-presentation](../skills/create-html-presentation/SKILL.md) is for the
regular update a product manager gives leadership: where things stand against the goals, what changed, and
what's needed from the reader. It was released after it beat Claude and Codex working on their own, including on
requests it was never tuned on.

## Why this deck

In our scan of about 130 r/ProductManagement posts about decks, this was the one product managers posted about
most. The two most upvoted were about how product work reaches leadership (331 and 332 upvotes), and one title
sums up the problem: "My 'solid'
status updates were the reason my VP never actually made a decision." Reviewers there check "whether the headline
matches the nuance in the data".

## The test

- **Agents:** Claude Code with Claude Opus 5.5, and Codex with GPT-6.1 Sol. Each made every deck twice on its own and twice with the skill.
- **Requests:** six product updates written like real asks, with notes:
  - a monthly update where the overall number rose while one part fell
  - a quarterly review rolled up from three teams, in at most six slides, with nothing to decide
  - a bi-weekly update with bad news, two options and the requester's lean
  - a pasted monthly status doc for exec staff, in a formal tone
  - a five-slide growth update for the CEO where nobody knows yet why a number jumped
  - a quarterly business review where growth hides a concentration risk

  The last three were held out: the skill was never tuned on them.
- **Reviewer:** a blind model reviewer that read every slide image of two decks for the same request without knowing which used the skill. It answered a fixed checklist for each deck and picked the one it would send.
- **Checklist:** built from what people complain about in AI-made decks:
  - invented facts or causes
  - the AI template look
  - broken layout
  - too long
  - working notes left on slides

## Results (24 decks each way)

| What the reviewer found | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| **Would send as it is** | 0 of 12 | **12 of 12** | 2 of 12 | **11 of 12** |
| Picked as the one to send | 1 of 12 | 11 of 12 | 2 of 12 | 10 of 12 |
| States something that isn't in the notes | 11 | 0 | 5 | 0 |
| Too long for what was asked | 5 | 0 | 6 | 0 |
| Broken layout | 5 | 0 | 4 | 1 |
| Working notes left on a slide | 4 | 0 | 9 | 1 |
| Looks like a template or AI default | 3 | 0 | 0 | 0 |
| Looks plain or sparse | 1 | 2 | 0 | 3 |
| Looks better of the pair | 5 of 12 | 7 of 12 | 5 of 12 | 7 of 12 |

On the three held-out requests, the reviewer picked the deck made with the skill 6 of 6 times for Claude and 5 of 6
for Codex.

A separate check read every deck's text against a fixed list per request of what the reader needs (the skill never
sees it). On the held-out requests, every deck covered everything, with or without the skill. The difference is
what the agents added. In the same 12 held-out decks:

| Lines a checker found that the notes don't support | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| Invented statements (plans, owners, deadlines, recommendations) | 18 | 0 | 20 | 0 |
| Invented causes ("the October beat came from more people coming in") | 13 | 0 | 3 | 1 |

## What the recipe asks for, and why

| Rule | Fixes | Evidence |
| --- | --- | --- |
| Slide 1 says how we're doing against the goal and what's needed from the reader | Updates that end in "cool." | r/ProductManagement 1syqq6u |
| A cause only when the notes give one; an unknown cause is called unknown | Plausible explanations made up for why a number moved | On their own, the agents invented causes in 10 of 24 decks |
| Only the asks, plans, owners and dates in the notes; options set out alike, no recommendation the requester didn't make | Added deadlines, owners, 90-day plans and recommendations | Asked to "decide whether we build", 3 of 4 solo decks recommended building |
| Results against target and the previous period; a total that rises while a part falls is said on the same slide | Headlines that read greener than the detail | Amazon's weekly business review; watermelon reporting |
| Misses and surprises get the slides; on-track results share one scorecard | Long decks that repeat every number | Densest slide on the tuning requests: up to 235 words on their own, at most 139 with the skill |
| Several teams make one update, not a slide per team | Pasted team slides | r/ProductManagement 1qqt3kr |

The router sends a regular update to this recipe and a one-off product decision to the
[decision deck](decision-deck-results.md): 24 of 24 update requests, 12 of 12 decision requests and 2 of 2 talk
requests went to the right recipe on both agents.

## What's next

- The reviewer called some skill decks sparse (5 of 24, against 1 of 24 on their own): a short table or a single
  chart with space around it. Fuller slides that stay faithful are next.
- The principles come from research and practitioner posts; we're checking them with working product managers.

Every release goes through the same test against the agents on their own.
