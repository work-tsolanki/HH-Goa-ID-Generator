export type TweetCardFacts = {
  name: string;
  badgeTitle: string;
  builderClass: string;
  builderCode: string;
};

/**
 * Share copy for X — lowercase, conversational tone. Every value is real
 * data pulled from the generated card, nothing invented.
 */
export function buildTweetText({ name, badgeTitle, builderClass }: TweetCardFacts): string {
  return [
    `apparently i'm a "${builderClass}" now`,
    `${name} · ${badgeTitle} · goa 2026`,
    "",
    "28–31 oct. build in goa, ship from paradise.",
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
