# Super Document Skills

Turn notes, research, and results into documents people can understand and use.

Four content-first [Agent Skills](https://agentskills.io/specification) help
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

See the [example outputs and their source notes](examples/README.md). They show
what the skills can produce, not a required aesthetic or guaranteed outcome.

## Install

For Codex, run the [skills CLI](https://skills.sh/docs/cli) from your project:

```sh
npx skills add arunai30/super-document-skills --agent codex --skill '*' --copy
```

This installs all four skills into the project. To choose one, replace `'*'`
with `create-visual-report`, `create-visual-explainer`, or
`create-html-presentation`, or `create-workflow-diagram`. Review an existing copy before replacing it.
A clean project installation of the original three folders has been verified; this
checks installation, not hosted publishing or every agent client's behavior.

For manual installation, use an agent client that supports Agent Skills. You can download the repository
using GitHub’s **Code → Download ZIP**, or clone it:

```sh
git clone https://github.com/arunai30/super-document-skills.git
```

1. Choose one of the four folders inside `skills/`.
2. Follow your client’s documented skill import or local installation flow.
   Import the **whole folder**, including all bundled scripts, assets, references, `SKILL.md`, and `LICENSE`.
   Keep the folder name unchanged. If that skill already exists, review it
   before replacing anything.
3. Confirm that the skill appears in your client’s skill selector or discovery
   list. A clone alone does not install or activate it. Restart or reload your
   client only if its instructions require that.

Each skill is independent. You do not need to install all four, run a custom
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

Open the HTML file in a browser to review it. The skills call for real visual
checks on desktop and narrow screens, plus every slide in print for decks.
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

## Repeatable workflow diagrams

The new diagram skill bundles a dependency-free Node.js renderer (Node 20+), two
example models and editorial/blueprint themes. It separates semantic content,
computed geometry and appearance. Its supported shape is a 3–7-node main path
with a small supporting row, not arbitrary architecture graphs. Desktop examples
and independent review informed the recipe; deterministic tests do not establish
reader comprehension or universal layout support. The exact published experiment
is documented in the [diagram-series blog](https://shareartifacts.dev/view/p_nKulpbRmNy4DcXHK5XaEJw).

## License

[MIT](LICENSE). Each skill includes its own copy of the license so the notice
travels with it when you install or redistribute that folder.
