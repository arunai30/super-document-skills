# Preview sources and framing

Captured September 21, 2026 in Chromium with a 1280 CSS-pixel-wide viewport and
2× device scale. No HTML content, CSS, figures, or labels were changed for capture.
The crops keep complete sections, chart scales, caveats, and sequence outcomes.

| Preview | Source | Selection (CSS pixels: x, y, width, height) |
| --- | --- | --- |
| Growth brief | [HTML](../growth-decision-brief.html) | 76, 629, 1128, 866: rate charts and claim check |
| Seat explainer | [HTML](../seat-count-explainer.html) | 96, 956, 1088, 968: complete four-event timeline |
| Onboarding deck | [HTML](../onboarding-pilot-deck.html) | Complete slide 2, 1280 × 720 |
| Client brief | [HTML](../client-decision-brief/example.html) | 100, 0, 1080, 962: complete document |
| Decision deck before/after | Release-test decks for the pricing request, Claude Opus 5.5 on its own and with the skill | Complete slides 1 and 2 of each deck at 1280 × 720, unedited; [results](../../docs/decision-deck-results.md) |
| Product update before/after | Release-test decks for the CEO growth-update request (held out from tuning), Claude Opus 5.5 on its own (slides 1 and 3) and with the skill (slides 1 and 2) | Complete slides at 1280 × 720, unedited; [results](../../docs/product-update-results.md) |
| Decision deck styles | Decks made with the skill for the pricing request plus one style line each (Claude Opus 5.5 and Codex) | One unedited slide per deck at 1280 × 720 |
| Weekly report | [Live example](https://shareartifacts.dev/examples/weekly-status-report) | 108, 440, 1064, 786: decision request and sprint comparison |

The first four sources are unchanged from library revision
[ec81928](https://github.com/arunai30/super-document-skills/commit/ec81928c0d97847c5145d64b040b5fef04e51661).
The weekly report was rendered from the first-party `weeklyReportHtml` fixture
in `apps/web/src/lib/artifact-example-weekly-report-html.ts` at share-htmls
revision `16dcd7b`. It is a curated example, not an independent skill-test result.
The live site may change later.

The [checkout blueprint](../diagrams/checkout.webp) is the existing image from
library revision ec81928, reused unchanged. See the [diagram vision](../../docs/diagram-vision.md).

All scenarios are fictional. These screenshots demonstrate available design
approaches, not real customer outcomes or a promise of identical generated output.
