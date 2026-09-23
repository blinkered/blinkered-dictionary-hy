# Blinkered dictionary: Armenian

The Armenian word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Armenian.

**10,540 of 19,341 candidates proved, 54.5%**, across 5 independent
families, 4 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Armenian, and why those
ATTESTATIONS.tsv   the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
searched.tsv       publishers fetched directly: per page, which candidates it held and how often
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Armenian list, which lives in
[`blinkered-attestation/candidates/hy`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/hy).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Armenian

**The families.** Armenian Wikipedia (which also ordered the candidates), three Leipzig packages
(two million sentences of web crawls of Armenia from 2013 and 2017 and a small 2011 news crawl,
one family), Tatoeba, the Internet Archive's Armenian shelf, and `granish.org`, a literary portal
fetched directly. There is no Armenian Gutenberg shelf and no Armenian translation on eBible.
Armenian Wikisource was left out: it is the same Wikimedia family as the Wikipedia, so it could
only corroborate, and on a nearly full disk it bought nothing the rule counts.

**Clean for a structural reason.** English and Russian cannot be spelled in Armenian script, so
not one shipped word is in the English list, and a bilingual site is as good as a monolingual
one. The validator here was hy.wiktionary page titles, which is the mistake that filled other
lists with English; the script is what makes it harmless. The shelf is still thin: 5 of the 34
Archive texts read cleared the legibility floor, the rest being other languages or bad OCR.

**Where the drop list points.** 6,054 of the 6,613 words one family short are attested by
Leipzig and Wikipedia and nothing else: ԱԲԲԱՅՈՒԹՅՈՒՆ, ԱԲՈՐԻԳԵՆՆԵՐ. They need one more modern
voice. The harvest had reached only one of its four publishers when this was built, so more of
them (Azatutyun, Aravot, Hetq) is the obvious next step.

**Tiles.** Every one of the 38 tiles spells some shipped word; Է (53) and Ֆ (96) are the rarest.
The ligature և is not a tile and folds to the letters it is made of.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list. It has to be re-measured before this list reaches the game, and
`status.json` says `"ships": "pending"` until somebody decides otherwise. Nobody has yet played
the boards this list deals.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `CC-BY-SA-4.0` | `dropped.tsv`, which is **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms, here `CC-BY-SA-4.0`.
