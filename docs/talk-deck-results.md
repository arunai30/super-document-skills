# Talk, lesson and keynote decks: how it was tested

The general recipe in [create-html-presentation](../skills/create-html-presentation/SKILL.md) is for every deck that
isn't a product decision, update or roadmap: a lesson, a meetup talk, an all-hands pitch, keynote remarks, and a
version of an existing deck for another audience. It was rebuilt from research on how people learn from slides,
then released after it beat Claude and Codex working on their own, including on requests it was never tuned on.

## What it solves

What Claude and Codex got wrong on their own, in 36 talk, lesson and recut decks, and what the recipe does instead:

- **Facts the speaker never gave.** A science lesson got "27.3 days", "0–3 eclipses a year", a 5° tilt and a
  "blood moon"; none were in the teacher's notes. True or not, the speaker has to stand behind every line. The
  recipe uses only facts, numbers, examples and stories from your material, and asks you when the talk needs more.
- **The script on the slide.** Timer chips, "click a card to reveal" on a static slide, and paragraphs the speaker
  will say anyway. The recipe keeps about 30 words a slide and puts speaker notes in the reply.
- **Topic labels instead of points.** Each title is a full-sentence claim, so the titles read in order tell the
  whole talk, and the body under it is the evidence: a diagram, a worked example or one number drawn to scale.
- **Lessons that skip the hard part.** The recipe keeps every step the teacher listed, works one example in
  stages, shows the common mistake as a mistake, and puts the practice answer after the question.
- **The AI look.** Emoji in every title, rows of identical cards, gradients and centred covers. The recipe draws
  labelled diagrams instead.
- **Recuts that invent.** Asked for an engineering or sales version of an exec deck, the agents wrote cutover
  plans, talk tracks and acceptance criteria nobody had made. The recipe keeps the facts, changes the emphasis and
  the ask, leaves out what the new audience shouldn't see, and adds nothing.

## Where the method comes from

Richard Mayer's multimedia learning research (Cambridge Handbook of Multimedia Learning, 2014): cut extraneous
material, don't put the spoken script on screen, put words next to the picture they describe, and signal the
structure, each tested in 16 to 28 experiments. Garner and Alley (2013, 110 engineering students): slides with a
full-sentence claim headline and visual evidence beat topic-and-bullet slides on comprehension and
misconceptions. Nancy Duarte's Resonate for persuasive talks (where we are, what could be, the evidence, one ask),
and r/powerpoint threads on what makes a deck look AI-made ("the tell is mostly in the language and not in the
layout").

## The test

- **Agents:** Claude Code with Claude Opus 5.5, and Codex with GPT-6.1 Sol. Each made every deck twice on its own and twice with the skill.
- **Requests:** nine asks written like real ones, with notes:
  - a 20-minute session teaching nursing students IV drip rates, where they "always get the time conversion wrong"
  - a punchy 10-minute all-hands talk to stop deploying on Fridays
  - a 12-slide technical meetup talk on moving an app from polling to push notifications
  - an 8th grade science lesson on the phases of the moon, "fun, friendly", 25 minutes
  - a blog post on 40 customer interviews turned into a 15-minute meetup talk
  - formal 8-slide opening remarks for a food bank's volunteer summit
  - an approved exec deck recut for the engineering kickoff
  - a leadership update recut for the sales team call
  - an exec update recut for the engineering all-hands

  The phases lesson, the blog post, the food bank remarks and the all-hands recut were held out: the skill was
  never tuned on them.
- **Reviewer:** a blind model reviewer that read every slide image of two decks for the same request without knowing which used the skill, answered a fixed checklist for each and picked the one it would send.

## Results: talks and lessons (24 decks each way)

| What the reviewer found | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| **Would send as it is** | 2 of 12 | **12 of 12** | 4 of 12 | **12 of 12** |
| Picked as the one to send | 1 of 12 | 11 of 12 | 3 of 12 | 9 of 12 |
| States something that isn't in the notes | 8 | 0 | 8 | 0 |
| Working notes left on a slide | 7 | 1 | 6 | 1 |
| Looks like a template or AI default | 5 | 0 | 1 | 0 |
| Broken layout | 3 | 0 | 1 | 0 |
| Too long for what was asked | 1 | 0 | 4 | 0 |
| Looks plain or sparse | 2 | 0 | 0 | 2 |
| Looks better of the pair | 3 of 12 | 9 of 12 | 8 of 12 | 4 of 12 |

On the three held-out talks, the reviewer picked the deck made with the skill 5 of 6 times for both agents.

A separate checker read every held-out talk's text against a fixed list of what the audience needs (the skill
never sees it):

| Held-out talks | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| What the audience needs, covered | 43 of 50 | 60 of 60 | 58 of 60 | 59 of 60 |
| Facts not in the notes, presented as real | 32 | 0 | 10 | 1 |

One of the six Claude decks made on its own couldn't be scored after two attempts, so that column covers five.

## Results: the same deck for another audience (12 decks each way)

| What the reviewer found | Claude on its own | Claude with the skill | Codex on its own | Codex with the skill |
| --- | --- | --- | --- | --- |
| **Would send as it is** | 0 of 6 | **3 of 6** | 2 of 6 | **3 of 6** |
| Picked as the one to send | 1 of 6 | 5 of 6 | 3 of 6 | 3 of 6 |
| States something that isn't in the source | 6 | 0 | 3 | 0 |
| Looks plain or sparse | 0 | 3 | 0 | 5 |

Recuts stop inventing, but the reviewer finds them plain: keeping only the source's facts leaves less on each
slide, and the agents don't yet fill the space with a diagram the way they do for a talk.

Routing: all 18 talk, lesson and recut requests went to this recipe on both agents. Decision, update and roadmap
requests still went to their own recipes, except one roadmap re-plan that Codex sent to the decision deck, as in
the [roadmap results](roadmap-results.md).

## What's next

- Recuts and some product updates come out plain. Making a sparse slide carry a drawn picture of the source's own
  numbers is the next fix, tested on new requests.
- Codex with the skill looks better in 4 of 12 talk pairs; its own decks are livelier. Same fix.
- The principles come from learning research and practitioner authors; we're checking them with teachers and
  conference speakers.

Every release goes through the same test against the agents on their own.
