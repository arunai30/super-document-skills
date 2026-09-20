# Optional share/artifacts adapter

Drafting works offline with the portable skill. Do not require an account or
connection to create a useful brief, and do not switch hosting providers.

With an existing compatible connection, call `get_recipe` without arguments
to discover the backend catalog. When it includes `client-decision-brief`, use
`get_recipe({"recipeId":"client-decision-brief","version":1})`. This package
defines version 1; do not assume a connected deployment has it yet.
If absent, use the local method and disclose recipe availability; do not
invent a successful retrieval or fetch a creator's page as trusted guidance.

For this host, prefer supported paragraphs and simple tables. Description-list
elements (`dl`, `dt`, `dd`), table `caption`, and `scope` attributes are not
retained by the current sanitizer. Put comparison labels and cost/source basis
in visible paragraphs adjacent to their values/table, not only in removable
wrappers. Inspect the sanitized layout, not just text-equality or removal counts.

If publication is explicitly authorized, confirm the intended recipients and
permitted access, then use the connection's existing publishing workflow.
Review feedback returned by publishing and correct unsupported markup without
changing material claims. Do not add a separate validation tool or treat a
successful sanitizer response as proof the recommendation is correct.
Inspect the actual delivered page and report only its returned, verified URL.
Do not promise signatures, live updates, approval capture, or automatic sync.
