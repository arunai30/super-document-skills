# Super Document Skills

Turn notes, research, and results into documents people can understand and use.

Five content-first [Agent Skills](https://agentskills.io/specification) help
your agent choose a clear story, preserve the evidence, design meaningful
visuals, and review the actual result. They leave room for your style instead
of prescribing one template. No account or publishing connection is required.

## Choose a skill

| Skill | Use it when you need to… | Example request |
| --- | --- | --- |
| [create-visual-report](skills/create-visual-report/SKILL.md) | Explain findings, compare options, or support a decision | “Turn these project notes into a decision brief. Show the tradeoffs, evidence, and open questions.” |
| [create-visual-explainer](skills/create-visual-explainer/SKILL.md) | Make an idea, process, or system understandable | “Explain this process to our support team. Carry a worked example through a clear visual.” |
| [create-html-presentation](skills/create-html-presentation/SKILL.md) | Build a paced argument, update, or lesson | “Make a read-alone HTML deck from these findings. Build toward the decision we need.” |
| [create-workflow-diagram](skills/create-workflow-diagram/SKILL.md) | Explain one request or event path with computed diagram layout | “Show our webhook receiver, acknowledgement and retry paths. Use blueprint style.” |
| [create-project-management-artifact](skills/create-project-management-artifact/SKILL.md) | Communicate project scope, progress, risks, dependencies, or decisions | “Turn these notes into a weekly update: wins, what's coming, current blockers, and risks ahead. Lead with the decision needed.” |

See the [example outputs and their source notes](examples/README.md). They show
what the skills can produce, not a required aesthetic or guaranteed outcome.

## Install

For Codex, run the [skills CLI](https://skills.sh/docs/cli) from your project:

```sh
npx skills add arunai30/super-document-skills --agent codex --skill '*' --copy
```

This installs all five skills into the project. To choose one, replace `'*'`
with `create-visual-report`, `create-visual-explainer`,
`create-html-presentation`, `create-workflow-diagram`, or `create-project-management-artifact`. Review an existing copy before replacing it.
A clean project installation of the original three folders has been verified; this
checks installation, not hosted publishing or every agent client's behavior.

For manual installation, use an agent client that supports Agent Skills. You can download the repository
using GitHub’s **Code → Download ZIP**, or clone it:

```sh
git clone https://github.com/arunai30/super-document-skills.git
```

1. Choose one of the five folders inside `skills/`.
2. Follow your client’s documented skill import or local installation flow.
   Import the **whole folder**, including all bundled assets and references, `SKILL.md`, and `LICENSE`.
   Keep the folder name unchanged. If that skill already exists, review it
   before replacing anything.
3. Confirm that the skill appears in your client’s skill selector or discovery
   list. A clone alone does not install or activate it. Restart or reload your
   client only if its instructions require that.

Each skill is independent. You do not need to install all five, run a custom
installer, add credentials, or connect share/artifacts. Client support and
installation locations vary; this release does not claim testing in every client.

If your agent can install skills from GitHub, you can ask it:

> Install `create-visual-report` from
> `https://github.com/arunai30/super-document-skills/tree/main/skills/create-visual-report`.
> Review the skill before installing it, and ask before replacing an existing copy.

## Use

Select the installed skill and supply your source material, intended reader,
desired outcome, and any visual direction. For example:

> Use create-visual-report to make a decision brief for our operations lead from
> these pilot notes. Compare the options, preserve the denominators, and keep
> uncertainty beside the claims. Use a warm editorial style. Create a local
> HTML file; do not publish it.

The default output is a local static HTML artifact. Reports and explainers
preserve an explicitly requested different format when suitable tools are
available. The presentation skill is for HTML decks; it does not replace a
request for PowerPoint or Google Slides. For those formats, use appropriate
format-specific tools or skills.

Open the HTML file in a browser to review it. Reports, explainers, and decks call for visual checks on desktop and narrow
screens, plus every slide in print for decks. Workflow diagrams default to desktop review.
If rendering tools are unavailable, the agent should identify that limitation
instead of claiming visual verification. Review the facts and appearance before
sharing the result.

## Optional publishing with share/artifacts

Content creation comes first. Publishing is a separate action that requires
your explicit request and an already-connected compatible MCP client.

The included references describe first-party recipes, requested saved styles
where supported, and publishing through [share/artifacts](https://shareartifacts.dev).
New publications default to owner-only access. The skills do not set up an
account, collect credentials in chat, change saved styles, or make a local draft
public as a side effect. If publishing is unavailable, you still keep the local
artifact.

See [connection instructions](https://shareartifacts.dev/connect) and the
[MCP tool reference](https://shareartifacts.dev/mcp). No live account connection
or hosted-publishing compatibility is implied by installing a skill.

## Validation

With Node.js 24 or newer, run the dependency-free package and release checks:

```sh
node --test tests/*.test.mjs
```

Maintainers with a built share/artifacts product checkout can also check the
optional MCP arguments against its actual registration schemas:

```sh
node tests/check-mcp-contract.mjs /absolute/path/to/product-checkout
```

That optional check needs the checkout’s built `packages/mcp-server/dist/server.js`.
It does not install dependencies, connect to a service, or publish anything.
It checks input schemas, not live connectivity or all output behavior.

The original three entrypoints passed the standard skill validator during preparation.
Independent forward tests produced the included report, explainer, and five-slide
deck from synthetic source notes. Desktop/mobile pixels and every printed deck
slide were inspected. Missing, denied, and uncertain publishing were tested as
decision simulations, not real network writes. These are exercised examples,
not a quality benchmark or a claim of universal client compatibility.

## Project-management artifacts

The project-management skill covers project briefs, weekly updates, milestone
and dependency plans, risk/issue briefs, and decision records. It chooses the
structure by the reader's task, preserves requested formats such as email, and
distinguishes evidence, proposals, commitments, and unknowns. Weekly updates
can use the familiar 2×2: wins, what's coming, current blockers, and risks ahead.

A [fictional weekly example](skills/create-project-management-artifact/assets/weekly-update-example.html)
is bundled as a visual reference, not a source of project facts. The focused
`create-weekly-update` skill is optional if already installed; the bundled
patterns work without it. This package does not include a publishing adapter.

Three independent text-only forward tests covered a short sponsor email,
contradictory milestone dates, and a meeting with no approved decision. The
email test used the optional installed weekly skill; standalone fallback and
new HTML generation were not tested in that pass. The bundled HTML example
was previously reviewed at desktop and narrow widths.

## Repeatable workflow diagrams

The diagram skill now includes a self-contained HTML/CSS template and a small
connector grammar. Your agent writes the HTML directly; CSS calculates positions
and paths in the browser. Creation needs no Node, Python, generator, package
installation, external JavaScript library, account, or generation service.
The `npx` command above is one optional installation method, not a creation
requirement; clients that import skill folders can use the ZIP/manual route.

Example: “Use create-workflow-diagram to show our webhook receiver, durable
acceptance, and worker retry path. Use blueprint style. Create an HTML file.”

The supported shape is a 3–7-node main path with a small supporting row and at
most two distinct feedback paths. Prefer 3–5 nodes on ordinary desktops. Dense
graphs, shared feedback endpoints, and precise concurrency need another view.
Modern CSS container units are required to display the layout. Browser tools
help review pixels but are optional for creation; an agent without them must
say the result has not been visually reviewed.

The customer client must load the complete skill folder and support HTML file
or artifact output. Installation and rendering are not verified across every
agent client. The original Node-based experiment remains documented in the
[diagram-series blog](https://shareartifacts.dev/view/p_nKulpbRmNy4DcXHK5XaEJw);
it describes the earlier experiment, not the current authoring requirement.
Two independent file-only agent tests produced upload and order diagrams from
one prompt each without generation code. Desktop review covered the outputs;
follow-up checks corrected support ordering and added nonvisual descriptions.
These examples do not establish compatibility with every client. Repository
validation uses Node for maintainer checks only.

## License

[MIT](LICENSE). Each skill includes its own copy of the license so the notice
travels with it when you install or redistribute that folder.
