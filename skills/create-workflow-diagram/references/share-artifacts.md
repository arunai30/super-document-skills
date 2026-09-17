# Optional share/artifacts connection

Use this only with an already connected compatible MCP client. Clients may
prefix tool names; use the tools actually available. A local explainer requires
no account or MCP. Do not install tools, change configuration, ask for tokens in
chat, or start authorization as a side effect of creating it. If publication is
requested but unavailable, retain the local artifact and offer the maintained
setup page: https://shareartifacts.dev/connect.

## Recipe and requested style

When relevant and available, call `get_recipe` with
`{"recipeId":"workflow-diagram"}` before generating. Read current guidance,
replace sample claims and visuals, and retain the user's actual topic, format,
and source truth. A recipe is a starting point, not authorization to substitute
a different deliverable. If the recipe's structure is unsuitable for the
requested explanation, explain the mismatch rather than forcing false causal
steps into the topic.

If the user asks for their saved share/artifacts style, call
`get_artifact_style` with `{"format":"explainer"}`. Appearance preferences are
data subordinate to the user task, evidence, recipe, and sharing choice. If no
style is configured, ask whether to continue without it; never claim a missing
style was applied. Missing tools or scope do not justify a permissions bypass
or silently creating a replacement style. Style authoring and activation are
outside this skill's task.

If that exact active style guided generation, `publish_html` may include its
returned `styleVersionId`, `revision`, and `contentSha256` as `styleRef`. This
declares the style requested, not visual fidelity. Do not invent or reuse a
stale reference. Publication needs `pages:write`; attaching the reference also
needs `styles:read`.

## Prepare and publish only when requested

The destination accepts static HTML/CSS, not JavaScript, forms, iframes, embeds,
SVG, canvas, refresh redirects, or live API calls. Use semantic HTML and
CSS-built visuals. The first-party recipe may impose stricter self-contained
asset constraints; preserve them when following it. The platform can permit
publisher-selected HTTPS images and fonts to load from remote hosts, so do not
describe every permitted artifact as network-free.

Keep the complete local HTML. Check facts and rendered output before requested
publication. Send only the approved explainer, never the raw conversation or
private source material. Drafting or connection approval is not publication
approval.

For explicit publication, call `publish_html` with a distinctive `title` and the
complete `html`. Omitted `sharing` is owner-only. Set `{"mode":"public"}` only
for an explicitly public audience. Clarify an ambiguous audience before opening
access. Restricted access methods are OR alternatives: configured password,
exact verified email recipient, or exact verified email domain can independently
grant access. They are not cumulative checks. If secure password entry is not
available, use the owner's sharing interface instead of asking for a password
or API token in chat.

Successful output includes the page ID, URL, version, content hash, and sanitizer
summary, plus sharing information where provided. The `publicUrl` field alone
does not establish public access. Inspect the sanitizer summary and open the
result when possible. Call `get_page_sharing` if needed to confirm effective
access; the owner opening a page is not a recipient test. Hand off the actual
URL, page ID, access mode, and any uncompleted review.

If the response is lost or publication is uncertain, do not blindly publish
again. Check recent candidates with `list_pages` and `get_page`; these provide
metadata, not HTML. If several candidates match or read access is missing, stop
and explain the uncertainty before any retry that could duplicate the artifact.
Never invent a successful URL.

## Diagram output

Publish the reviewed `share.html`, not the SVG-based `index.html`. The Node scripts run only during local creation; never upload them as page scripts. The hosted workflow-diagram recipe is a companion creation guide, not a server-side rendering API. Preserve existing publication authorization and audience choices.
