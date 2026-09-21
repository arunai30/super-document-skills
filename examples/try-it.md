# Try it: why can two customers see the last seat?

Make a visual explanation for a support team, using the complete fictional example
below. You do not need to prepare notes or connect a publishing service.

## 1. Install the explainer skill

Run this in your project:

```sh
npx skills add arunai30/super-document-skills --agent codex --skill create-visual-explainer --copy
```

Review any existing copy before replacing it. Confirm the skill appears in your
client. For another client, use the [manual installation instructions](../docs/usage-and-validation.md#install).
If the agent cannot find the skill, check that the whole folder was imported and
follow your client's reload instructions before trying again.

## 2. Paste this into your agent

```text
Use create-visual-explainer to create a visual HTML explanation for nontechnical
support teammates: Why can two customers both see the last seat, but only one
can buy it?

Create a local file named last-seat-explainer.html. Use a clear timeline and a
warm editorial style. Keep it readable on a phone. Label the scenario fictional.
Use only the source material below. Do not connect to a service or publish.

Source: fictional seat-reservation design note.
- The browse card can show a cached seat count for up to 30 seconds. Looking at
  it does not reserve anything.
- At checkout, the server checks current inventory and reserves one seat in a
  single transaction. It creates a 10-minute hold only if a seat is available.
- Successful payment during a valid hold converts the held seat to a sold seat.
- Failed payment releases the hold; an expired hold also returns the seat to
  available inventory.
- A later checkout attempt cannot take a seat that is already held or sold.
- Support should distinguish a browsing estimate from a confirmed reservation.
  The design note does not quantify how often stale counts occur.

Illustrative timeline: one seat remains. Ari opens the card at 0 seconds. Bea
sees the cached count at 8 seconds. Ari starts checkout and gets the hold at
12 seconds. Bea tries checkout at 15 seconds and cannot reserve that seat.
Do not imply Bea was charged.

End with a short explanation support can give a customer. Review the HTML at
desktop and narrow widths if browser tools are available; otherwise tell me
which visual checks I need to do myself.
```

## 3. Open and check your result

Open `last-seat-explainer.html` in a browser. You should be able to explain the
sequence by following the visual. Check that:

- Browsing and holding a seat are visibly different steps.
- Ari gets the hold at 12 seconds; Bea cannot reserve that seat at 15 seconds.
- The 30-second cache window and 10-minute hold are not confused.
- The page does not claim Bea was charged or invent how often this happens.
- Text and the timeline remain readable on a narrow screen.

[![Reference output explaining browsing versus reservation.](previews/seat-count-explainer.png)](previews/seat-count-explainer.png)

This is a reference output from an earlier run with the same scenario, not a
pixel-for-pixel target or the output of this exact revised prompt.
[View the full reference HTML source](seat-count-explainer.html), or download the
file and open it locally. GitHub displays HTML as source.

## Make it yours

Replace the source material with your own process, choose its intended reader,
and name the misunderstanding you want to resolve. Keep actual system rules
separate from illustrative examples.

[Explore other examples](README.md) · [Back to the library](../README.md)
