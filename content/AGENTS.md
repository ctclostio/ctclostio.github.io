# Blog writing instructions for AI agents

These instructions apply whenever an AI agent drafts, rewrites, or edits a blog
post in this repository, including titles, descriptions, excerpts, and outlines.
They govern the writing, not the site's interface copy or implementation.
An explicit direction from Clayton for a particular post takes precedence.

This is an agent instruction file, not a post. Keep it in `content/AGENTS.md`,
outside `content/blog/` and `public/`. Do not import it into application code,
render it on the site, quote it in articles, or include it in feeds or assets.

## Voice

Write in a plainspoken, forceful, curiosity-driven voice with very little social
padding. Address a capable reader who wants to understand the work.

- Lead with the problem, discovery, change, or claim. Make the first paragraph
  earn its place. Skip greetings, apologies, scene-setting filler, and promises
  about what the article is going to cover.
- Use familiar words, concrete nouns, and active verbs. Say what happened,
  what caused it, and what you did about it. Prefer a precise sentence to an
  impressive-sounding one.
- Be forceful through clarity and evidence. State conclusions directly. Keep
  uncertainty where it belongs: "I suspect" for an untested explanation,
  "the test showed" for an observed result. Never turn a guess into a fact.
- Let curiosity come from the work: a surprising result, a stubborn failure,
  a mechanism worth understanding, or a specific experiment worth trying.
  Follow the question far enough to give the reader something useful.
- Use first-person singular when describing Clayton's work. Keep the voice
  candid and grounded. Do not invent an audience-facing "we" or speak for
  other developers.
- Give sentences room to vary. Use short sentences for emphasis, not as a
  mechanical rhythm. Keep paragraphs focused and connected.
- Allow dry humor and a little whimsy when the subject supplies them. Don't
  decorate every paragraph with workshop, rabbit-hole, or cosmic metaphors.
  The underlying work should remain clear.

## What to leave out

- Social padding: "I'm excited to share," "I hope you enjoy," "thanks for
  joining me," and similar introductions or farewells.
- Inflated claims: "revolutionary," "game-changing," "seamless," "powerful,"
  or "robust" without a specific, demonstrated meaning.
- Canned framing: "in today's world," "let's dive in," "it's worth noting,"
  "the key takeaway," and summaries that merely repeat the article.
- Artificial drama, clickbait, mock arguments, strings of rhetorical
  questions, and repeated "not X, but Y" constructions.
- Needless softening: "just," "perhaps," "a little bit," or "I think" when
  the evidence already supports a direct statement. Preserve qualifiers
  that express a real limit or uncertainty.
- Self-congratulation, sales copy, and claims that a routine change is a
  major breakthrough. A small useful fix is enough to write about.

## Ground the writing in the work

Use Clayton's notes, the repository, commits, test results, and observed behavior
to establish what happened. Never invent elapsed time, personal experiences,
motivations, frustration, benchmarks, user feedback, quotations, or success.
Examples in this guide are fictional demonstrations of tone, not project facts.

Distinguish completed work, current limitations, and ideas for later. Explain
technical details when they help a reader understand or reproduce the result.
Use code, commands, screenshots, or links where they support a concrete point.
Define unfamiliar terms when necessary; avoid reciting the stack as a substitute
for explaining a decision.

Choose the shape that fits the entry. A short observation can stay short. A
technical investigation may need the question, the experiment, the result,
and the remaining uncertainty. Do not force every post through identical
headings. End when the useful material ends, or with a specific unresolved
question or next experiment. No compulsory inspirational send-off.

## Tone examples

Instead of:

> I'm excited to share a small but powerful improvement that makes working
> with large PDFs more seamless.

Write:

> The PDF was too large to upload. I added a size limit to the splitter so
> each output file fits.

Instead of:

> This fascinating challenge sent me on a journey to explore camera behavior.

Write:

> The camera drifted after a full orbit. I logged its position each frame
> to find where the error started.

Instead of:

> Ultimately, this was a valuable learning experience, and I'm excited to
> keep improving the system.

Write:

> The drift is gone at normal speed. I still need to test it at 100 times
> the simulation rate.

## Before handing over a draft

Read it once for empty sentences and once for unsupported claims. Cut the
padding. Verify the specifics. Check that the title and description make the
same honest promise as the article. Preserve this voice during revisions;
do not polish it into generic corporate prose.

Use `BLOGGING.md` for metadata, Markdown, images, draft status, and publishing.
Do not rewrite existing posts merely because this guide was added.
