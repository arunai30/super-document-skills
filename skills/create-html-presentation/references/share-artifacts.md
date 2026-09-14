# Optional share/artifacts connection

Use the actual tools available in an already connected compatible MCP client;
clients may prefix their names. The local deck requires no connection. Do not
install tools, alter configuration, request tokens in chat, or start
authorization as a side effect of creating content. If publication is requested
but unavailable, retain the local deck and offer the maintained setup page:
https://shareartifacts.dev/connect.

## Read the presentation recipe

When connected and preparing a share/artifacts deck, call `get_recipe` with
`{"recipeId":"presentation-deck"}` before authoring. Read its current structure
and guidance; replace its sample story and visual motif with the user's actual
content. Do not copy unsupported claims from the starter. Preserve the user's
format and scope; explain a mismatch instead of silently replacing the requested
deliverable.

Retain the exact `main.share-presentation`, sequential `section.share-slide`
IDs, and slide-local unique heading relationships described in the skill.
The platform validates structure after sanitization; invalid decks are not
published. Its viewer supplies presentation controls, so do not add your own.

Use HTML/CSS only: no JavaScript, forms, iframes, embeds, SVG, canvas, refresh
redirects, or live API calls. The first-party presentation recipe requires
self-contained output without external assets; preserve that stricter constraint
when following it. At platform level, permitted publisher-selected HTTPS images
and fonts may load remotely, so do not claim all accepted pages are network-free.

Keep the user's requested visual direction. There is no saved-style format named
`presentation`: `get_artifact_style` supports only `report`, `dashboard`, and
`explainer`. Do not fetch an unrelated format and call it a saved deck style.
`publish_presentation` has no `styleRef` input. Styling a deck from supplied
preferences is valid; claiming unsupported stored-style provenance is not.

## Publish only the approved deck

Retain the complete source HTML and review every slide as described in the
skill. If rendering tools are unavailable, disclose that visual QA was not
completed. A requested publication may proceed with that disclosure; do not
misrepresent visual QA as a server-enforced gate or claim unseen slides passed.

Creating a draft or approving a connection is not permission to publish.
On an explicit publication request, send only the approved deck—not the
conversation or raw private notes—to `publish_presentation` with `title`,
complete `html`, and `presentation` containing `schemaVersion: 1` and
`aspectRatio: "16:9"` or `"4:3"`. Omitted presentation options default to
version 1 and 16:9. Do not use `publish_html` as a silent workaround for failed
presentation validation or an unsupported ratio.

Omitted `sharing` means owner-only access. Use `{"mode":"public"}` only when
the user explicitly chooses public access. Clarify an ambiguous audience before
opening access. Restricted methods are OR alternatives: a configured password,
exact verified recipient, or exact verified email domain can independently
grant access. They are not cumulative checks. If secure password entry is not
available, use the owner's sharing interface rather than asking for a password
or API token in chat.

A successful result includes a page ID, canonical presentation viewer URL,
version, content hash, and sanitizer summary, plus sharing information where
provided. Use the returned URL; do not build a guessed URL. The `publicUrl`
field does not mean access is public. Inspect the sanitizer summary and open
the canonical viewer when possible. Confirm effective access using
`get_page_sharing` when needed; owner access is not a recipient test.
Return the actual URL, page ID, audience, and any remaining review limitation.

If publication is uncertain or its response is lost, do not blindly repeat it.
Use `list_pages` and `get_page` to inspect recent candidates; those tools return
metadata, not source HTML. If candidates remain ambiguous or read permission is
missing, stop and explain the uncertainty before a retry that could duplicate
the deck. Never invent a successful result.
