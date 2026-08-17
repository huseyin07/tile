const configuredXHandle = (process.env.NEXT_PUBLIC_TILE_X_HANDLE ?? "").replace(/^@/, "");

export const siteConfig = {
  name: "TILE",
  supply: 1111,
  xHandle: configuredXHandle,
  xUrl: configuredXHandle ? `https://x.com/${configuredXHandle}` : "https://x.com",
  giwaWording: "Building toward GIWA.",
  createSignalPost(tileNumber: number) {
    const id = String(tileNumber).padStart(4, "0");
    return [
      "I found my place in the picture.",
      "",
      `TILE #${id} assembled.`,
      "",
      "1,111 TILEs. One bigger picture.",
      this.giwaWording,
      this.xHandle ? `@${this.xHandle}` : "",
    ]
      .filter((line, index, lines) => line || lines[index - 1] !== "")
      .join("\n")
      .trim();
  },
} as const;

export function formatTileNumber(value: number) {
  return String(value).padStart(4, "0");
}
