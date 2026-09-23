/**
 * The collections that attest Armenian, and where each comes from.
 *
 * Armenian has a 19,341-word candidate list, ordered by Armenian Wikipedia and checked against
 * a hunspell dictionary. Wikipedia proposed the candidates, so it attests nearly all of them by
 * construction; every word still needs two families that had no say in the list. Against it: a
 * 600MB Wikipedia, three Leipzig web crawls of Armenia, Tatoeba and the
 * Internet Archive. There is no Armenian Gutenberg shelf and no Armenian translation on eBible.
 *
 * Armenian is clean for a structural reason: English and Russian cannot be spelled in its
 * script, so a page or a book in either contributes nothing rather than a plausible wrong answer,
 * and a bilingual site is as good as a monolingual one. The ligature և folds to the two letters
 * it is made of, as it does on the board.
 *
 * Armenian Wikisource is left out on purpose. It is the same Wikimedia family as the Wikipedia,
 * so it could only corroborate, and on a nearly full disk its 105MB bought nothing the rule counts.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly — the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
    harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'hy'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// Leipzig has no Armenian news package larger than 100,000 sentences, so the Armenian web crawls
// do the work, three years of them, with the one small news crawl; one family between them. The
// Leipzig Wikipedia packages are deliberately absent: they are Wikipedia text wearing a Leipzig
// label, so including one would corroborate `wiki:hy` while looking like another family.
const LEIPZIG = [
  'hye_newscrawl_2011_100K',
  'hye-am_web_2013_1M',
  'hye-am_web_2017_1M',
]

const ALL = [
  {
    id: 'wiki:hy',
    what: 'Armenian Wikipedia — modern encyclopedic prose, and the list that proposed the candidates',
    needs: `${CACHE}hywiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}hywiki.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg} — modern news and web text, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/hye/hye_sentences.tsv.bz2',
    what: 'Tatoeba Armenian — contemporary and conversational, and small',
    needs: `${CACHE}hye_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}hye_sentences.tsv`),
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Armenian books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-hy`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Armenian%22+OR+language%3A%22hye%22+OR+language%3A%22arm%22%29',
    documents: () => {
      const dir = `${CACHE}archive-hy`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Armenian publishers, for the harvest.
 *
 * The script does the language check a harvester cannot: an English or Russian page on these
 * sites matches no candidate. Granish, a literary portal, comes first for the register the news
 * never reaches. Armenpress, News.am and CivilNet refused a plain request when probed and are
 * left out; every one listed answered.
 */
export const DOMAINS = ['granish.org', 'azatutyun.am', 'aravot.am', 'hetq.am']

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
