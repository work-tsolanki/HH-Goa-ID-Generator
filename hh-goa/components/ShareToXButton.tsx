import { buildTweetText, buildTweetUrl, type TweetCardFacts } from "@/lib/tweet";
import { LinkButton } from "./Button";

/**
 * Goes straight to X's own compose flow via the tweet-intent link. There is
 * no browser mechanism that hands a file directly to one named third-party
 * app — the Web Share API's file-attach path always routes through the OS's
 * own share-sheet app picker first, which isn't "open X" so much as "open
 * whatever the user taps." A direct link is the only way to land in X
 * itself with one click; the image comes through via the share page's
 * og:image, which is already composed on a padded landscape canvas so the
 * full pass is visible instead of getting cropped by X's card renderer.
 */
export default function ShareToXButton({
  card,
  shareUrl,
  className,
}: {
  card: TweetCardFacts;
  shareUrl: string;
  className?: string;
}) {
  const tweetText = buildTweetText(card);
  const tweetUrl = buildTweetUrl(tweetText, shareUrl);

  return (
    <LinkButton
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      tone="pink"
      size="lg"
      className={className}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M18.2 2H21l-6.5 7.4L21.7 22H15l-4.6-6.3L4.9 22H2l7-8L2 2h6.8l4.3 5.9zM17 20.2h1.6L6.9 3.7H5.2z" />
      </svg>
      Share To X
    </LinkButton>
  );
}
