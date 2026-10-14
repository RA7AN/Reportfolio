import { getTweet } from 'react-tweet/api';

// Feeds the react-tweet cards in the "posts worth keeping" section. Proxies
// Twitter's syndication API server-side (react-tweet derives the request
// token), so the browser only ever talks to same-origin /api/tweet. Tweets
// are static once posted, so cache responses for an hour.
export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tweet = await getTweet(id);
  return Response.json({ data: tweet ?? null });
}
