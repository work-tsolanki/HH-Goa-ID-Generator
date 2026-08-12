export type TweetCardFacts = {
  name: string;
  badgeTitle: string;
  builderClass: string;
  builderCode: string;
};

/**
 * Share copy for X. Lines mirror the announcement-post shape builders
 * actually use for these pass generators (emoji header, identity line,
 * flavor line, ID line, CTA, hashtags) — every value is real data pulled
 * from the generated card, nothing invented.
 */
export function buildTweetText({ name, badgeTitle, builderClass, builderCode }: TweetCardFacts): string {
  return [
    "🌴 Just built my Hacker House Goa 2026 builder pass!",
    "",
    `👤 ${name} · ${badgeTitle}`,
    `💻 ${builderClass}`,
    `🪪 ${builderCode}`,
    "",
    "See you 28–31 Oct in Goa 🇮🇳",
    "Build your own pass 👇",
    "",
    "#FrameInGoa #HackerHouseGoa @247pmstudio",
  ].join("\n");
}

/**
 * The `url` param is what X unfurls into the tweet's attached image card —
 * it must point at the card's own /share/[id] page, whose <meta> tags
 * carry the og:image / twitter:image pointing at the generated PNG. X
 * fetches that when the tweet is posted, so the pass image shows up
 * attached automatically without any manual upload step.
 */
export function buildTweetUrl(text: string, shareUrl: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}
