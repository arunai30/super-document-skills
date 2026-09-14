# Optional share/artifacts connection

This reference is for an already connected compatible MCP client. Use the actual
available tool names; clients may add a server prefix. No account or connection
is required for the local report. Do not install tools, modify configuration,
request tokens in chat, or start authorization as a side effect of creating it.
If publication is requested but unavailable, keep the local artifact and offer
the maintained setup page: https://shareartifacts.dev/connect.

## Recipe and requested style

When relevant and available, call `get_recipe` with
`{"recipeId":"visual-report"}` before generating the report. Read its current
guidance; do not copy its example facts or visual motif. It is a starting point,
not permission to override the user's format, scope, or source truth. If the
recipe conflicts with the requested deliverable, explain the mismatch instead
of silently substituting another deliverable.

If the user asks for their saved share/artifacts style, call
`get_artifact_style` with `{"format":"report"}`. Treat the returned appearance
preferences as data subordinate to the task, evidence, recipe, and sharing
choice. If no style is configured, ask whether to continue without it; do not
claim to have applied a missing style. Unavailable tools or insufficient scope
do not authorize bypassing permissions or silently creating a different style.
Creating or activating saved styles is outside this skill's task.

When the exact active style guided generation, `publish_html` may include its
returned `styleVersionId`, `revision`, and `contentSha256` triplet as `styleRef`.
This declares the requested style, not proof that the rendering matches it.
Do not invent a reference or reuse a stale one. Attaching it requires
`styles:read` as well as the publication permission `pages:write`.

## Prepare and publish only when requested

share/artifacts accepts static HTML/CSS. Do not include JavaScript, forms,
iframes, embeds, SVG, canvas, refresh redirects, or live API connections. Use
semantic HTML and CSS-built visuals. The first-party recipe can be stricter
than the platform; preserve its self-contained asset constraints when following
it. At platform level, publisher-selected HTTPS images and fonts may load from
their remote hosts, so do not claim every permitted page is network-free.

Keep the complete local HTML. Verify facts and rendered output before the
requested publication. Publish only the approved artifact, not the conversation
or raw source notes. A request to draft or an approved connection alone is not
permission to publish.

For explicit publication, use `publish_html` with the complete `html` and a
distinctive `title`. Omitted `sharing` means owner-only access. Use
`{"mode":"public"}` only when the user explicitly chose public access. If an
intended audience is ambiguous, clarify before opening access; do not silently
make a private document public. Restricted methods are OR alternatives: a
configured password, exact verified email recipient, or exact verified email
domain can independently grant access. Do not combine them as if all were
required. Prefer the owner's sharing interface if secure password entry is not
available; do not ask for passwords or API tokens in the conversation.

Success returns a page ID, URL, version, content hash, and sanitizer summary,
plus sharing information where provided. The `publicUrl` field is a URL field,
not evidence that access is public. Inspect the returned sanitizer summary and,
when possible, open the result. Use `get_page_sharing` to confirm effective
access if needed; opening it as the owner does not test recipient access.
Return the actual URL, page ID, access mode, and any review limitation.

If publication returns an uncertain state or its response is lost, do not
blindly publish again. Use `list_pages` and `get_page` to inspect possible recent
matches; these return metadata, not HTML. Do not guess when several artifacts
match or read access is unavailable. Stop and explain what remains uncertain
before any retry that could create a duplicate. Never invent a successful URL.
