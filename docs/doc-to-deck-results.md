# Starting from your doc: how it was tested

Product managers do their thinking in a doc and then retype it into slides, and "something always gets flattened"
(r/ProductManagement). The shared base of [create-html-presentation](../skills/create-html-presentation/SKILL.md)
now has a section for decks made from a finished document: keep the doc's conclusion, order of reasoning,
evidence and caveats, keep the "because" in the titles, and add nothing the doc doesn't contain.

## What went wrong before

Given a finished decision memo, the decision recipe still asked for things the memo didn't have: ranked decision
criteria, a reversibility note, what would change the recommendation. Claude and Codex wrote those themselves in
every test deck ("We weigh savings first, then customer impact", "If Team accounts often query older logs, B …
may be worth it"). The new rule says that when you start from a document, a section the recipe asks for that the
document doesn't supply is left out, and the agent asks you about it in its reply instead.

## The test

- **Agents:** Claude Code with Claude Opus 5.5, and Codex with GPT-6.1 Sol, each with the skill before and after the change, two runs per request.
- **Requests:** a decision memo to turn into a VP deck, a long monthly status doc to turn into an update deck, and a formal memo for an executive committee (held out: the change was never tuned on it).
- **Reviewer:** the same blind model reviewer as the other results, comparing the before and after decks for the same request without knowing which was which.

## Results

| On the two memo requests (8 pairs) | Skill before | Skill after |
| --- | --- | --- |
| **Would send as it is** | 0 of 8 | **8 of 8** |
| Picked as the one to send | 0 of 8 | 8 of 8 |
| Looks better of the pair | 0 of 8 | 8 of 8 |
| States something that isn't in the memo | 8 of 8 | 0 of 8 |

A separate checker read each deck's text against the memo. On the held-out memo, lines it couldn't trace to the
memo (plans, criteria, conditions) fell from 14 to 5 for Claude and from 11 to 2 for Codex, while coverage of what
the memo says rose slightly. The status-doc request was already handled well before the change and stayed so.

The six product-decision requests behind [the decision deck results](decision-deck-results.md) were re-run with the
change: coverage was unchanged and invented statements fell.

## What's next

- Recutting a deck for another audience (the same decision for an engineering kickoff, an update for a sales call)
  mostly goes to the general presentation recipe, which is being rebuilt on the same base. The guidance for it is
  in the shared base already; it will be tested there.
