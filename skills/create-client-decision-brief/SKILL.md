---
name: create-client-decision-brief
license: MIT
description: Create a client-facing brief for a pending choice from consultant notes, options, quotes, and evidence. Use when a client needs to assess a recommendation and authorize a next step; not for recording an already-made decision or replacing a contract or approval workflow.
---

# Create a client decision brief

Help a client understand a pending choice, its tradeoff, and what they are being
asked to authorize. No account, connection, or product-specific tool is needed.
Preserve an explicitly requested email, Word, PDF, slide, or other format.
Otherwise produce a readable, self-contained static HTML brief.

Read [the decision method](references/method.md) before drafting. It is the
canonical method used by the first-party `client-decision-brief` recipe.
Read [evidence and limits](references/evidence.md) when explaining or revising
the method; its structure is not a guarantee of a correct decision.

For HTML, [brief.html](assets/brief.html) is an optional structural starter,
not a fixed layout or a source of case facts. Replace bracketed instructions,
remove unused sections, and adapt the number of options to the actual choice.
Honor supplied visual preferences. Use aligned comparisons to expose a real
tradeoff rather than repeating prose across decorative cards.

Keep real text, semantic headings, language/title/viewport metadata, embedded
CSS, accessible contrast, and a clear narrow-screen reading order. Use static
HTML without JavaScript, forms, SVG, canvas, frames, remote assets, live calls,
or automatic refresh. Normal audience-safe source links are fine. Important
conditions must remain visible without opening a disclosure. Include useful
print styling; the page must not imply it captures a signature or approval.

Inspect the rendered result on desktop and a narrow screen, including 320px
where practical, plus print when useful for the recipient. Check long labels,
comparison mappings, keyboard navigation, and the actual sanitized result when
available. Fix defects and re-render. Disclose checks that could not be run.
For another requested format, review that format instead of forcing HTML.

Return the draft and the few unresolved questions that materially change the
decision. Read [the optional sharing adapter](references/share-artifacts.md)
only when recipe retrieval or publishing through share/artifacts is relevant.
Creating the brief does not authorize sending, publishing, changing access,
committing files, or making the client's decision.
