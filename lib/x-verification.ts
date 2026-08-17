export type NormalizedXPost = { url: string; username: string; postId: string };

export function normalizeXPostUrl(value: unknown): NormalizedXPost | null {
  if (typeof value !== "string" || value.length > 300) return null;
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (url.protocol !== "https:" || !["x.com", "twitter.com"].includes(host)) return null;
    const match = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})\/?$/);
    if (!match) return null;
    const [, username, postId] = match;
    return { url: `https://x.com/${username}/status/${postId}`, username, postId };
  } catch {
    return null;
  }
}

export function normalizeXUsername(value: string) {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export async function verifyWithXApi(post: NormalizedXPost, expectedTile: number) {
  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) return { level: "url" as const };
  const response = await fetch(
    `https://api.x.com/2/tweets/${post.postId}?expansions=author_id&user.fields=username`,
    { headers: { Authorization: `Bearer ${bearer}` }, cache: "no-store" },
  );
  if (!response.ok) throw new Error("The X post could not be confirmed through the X API.");
  const payload = await response.json();
  const author = payload.includes?.users?.find(
    (user: { id: string }) => user.id === payload.data?.author_id,
  );
  if (!author || normalizeXUsername(author.username) !== normalizeXUsername(post.username)) {
    throw new Error("The X post author could not be confirmed.");
  }
  const tileMarker = `TILE #${format(expectedTile)}`;
  if (typeof payload.data?.text === "string" && !payload.data.text.includes(tileMarker)) {
    throw new Error(`The X post must include ${tileMarker}.`);
  }
  return { level: "content" as const };
}

function format(value: number) {
  return String(value).padStart(4, "0");
}
