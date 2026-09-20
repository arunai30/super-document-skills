# Client decision briefs

Help a client make one pending choice with an inspectable recommendation,
comparable options, visible uncertainty, and an exact request. This skill is for
consultants, agencies, and project leads. It does not record approval, replace
a contract, or manufacture a winner when the evidence is insufficient.

## See the result

[View the live example](https://shareartifacts.dev/examples/client-decision-brief)
or open [example.html](example.html) locally alongside its
[fictional source notes](source-notes.txt). GitHub's file view shows HTML source;
download or clone the repository to render it. The
[artifact-first guide](https://shareartifacts.dev/guides/client-decision-brief)
explains the method and shows the example without requiring signup.

Cedar Studio has two plausible enquiry workflows. Notice the condition attached
to the recommendation, the matching cost and timing comparisons, the unmeasured
baseline, and the exclusions beside the budget. Choosing an option is still
pending. The case is fictional, not evidence of customer savings or conversion.
Its layout is one possible treatment, not a required style.

## Install and try

From your project, select only this skill with the library's existing CLI flow:

```sh
npx skills add arunai30/super-document-skills --agent codex --skill create-client-decision-brief --copy
```

For manual installation, import the complete
[skill folder](../../skills/create-client-decision-brief/), including its
references, starter, metadata, and MIT license. Review any existing copy before
replacing it. A repository clone alone does not install or activate a skill;
use your client's supported import flow and confirm discovery. Other clients'
installation paths and support vary.

To try without installation, give a file-reading agent the complete skill
folder and this request from the repository root:

```text
Read skills/create-client-decision-brief/SKILL.md and its required references.
Use examples/client-decision-brief/source-notes.txt to create a local HTML draft.
Keep the case clearly fictional. Do not send or publish it.
```

For your own work:

```text
Use $create-client-decision-brief to help [client] decide [specific choice].
Use the attached notes and quotes. The decision maker is [if known].
Our constraints and criteria are [provided facts or unresolved questions].
Create a draft in [HTML/email/Word/other requested format]. Do not send or publish.
```

## Bring the decision context

Start with the pending choice, intended reader, credible options, and authorized
source material. Include dated quotes, budget and delivery constraints, relevant
measurements, exclusions, recurring fees, client effort, the requested decision
date, and what approval permits when known. Missing facts remain unknown.
Do not include confidential background material the recipient cannot see.

The [method](../../skills/create-client-decision-brief/references/method.md)
analyses before recommending, then writes answer-first. It distinguishes hard
constraints from preferences, checks arithmetic and comparable scope, preserves
conflicting evidence, and explains what would change the recommendation. If the
evidence does not support a choice, it proposes bounded clarification instead.

Default output is a self-contained HTML reading document with embedded CSS.
An explicit request for email, Word, PDF, or another format takes precedence.
The [HTML starter](../../skills/create-client-decision-brief/assets/brief.html)
contains instructions, not case facts; adapt or replace its layout. Static HTML
does not capture approval, signatures, live data, or ongoing collaboration.
Keep those actions in the client's established process.

## Optional recipe and sharing

No share/artifacts account or MCP connection is required to create a brief.
With an existing compatible connection, discover the catalog with `get_recipe({})`,
then request `get_recipe({"recipeId":"client-decision-brief","version":1})`.
The [public backend recipe](https://shareartifacts.dev/api/v1/recipes/client-decision-brief?version=1)
was verified on September 20, 2026; another connected deployment may differ.
Its method and starter match the portable skill. The reviewed semantic SHA-256 is
`b99d7b21f476906c2c99c73dee7b380ced803f1bc51f53bcf8b97680954bb002`.

Publishing is a separate, explicitly authorized action. Follow the
[optional sharing adapter](../../skills/create-client-decision-brief/references/share-artifacts.md),
confirm recipients and access, inspect publishing feedback and the delivered
page, and report only a verified returned URL. Creating a draft does not permit
sending it, making it public, changing access, or authorizing the client's work.

## Evidence and verification

The [evidence notes](../../skills/create-client-decision-brief/references/evidence.md)
link the method's sources and distinguish practitioner guidance from design
judgment. These are summaries and links, not reproductions of those sources.

Before this library release, independent agents used the unchanged method on
fresh fictional inputs: an HTML museum workflow choice and a short email with
conflicting estimates, currencies, and a hostile instruction in a vendor note.
The first retained the conditional recommendation and separate purchasing
authority; the second preserved uncertainty without forcing a winner or
obeying the embedded instruction. The inputs are retained in
[the scenario fixtures](../../tests/scenarios.json). These are manual forward-test
cases, not tests automatically executed by the Node suite.

The Cedar example was checked against its source notes and inspected in Chromium
at desktop, 390px, 320px, and A4 print size. The live guide/example/creation flow,
public recipe, and MCP retrieval were also checked. No real client-comprehension
study, cross-client installation matrix, search ranking, conversion benefit,
authenticated OAuth retest, or live approval capture is claimed.

Maintainers can run `node --test tests/*.test.mjs` from the repository root.
Checks cover packaging, allowed release files, license notices, local links,
copyability, and fingerprints of the reviewed method, starter, and example.
They do not prove that every generated brief is correct or useful.

## License

[MIT](../../LICENSE), including a copy inside the standalone skill folder.
Referenced sources retain their own rights. The public package contains only
the portable skill and selected fictional teaching materials, not the application.
