export const siteConfig = {
  name: "TILE",
  supply: 1111,
  xHandle: "TileOnGIWA",
  xUrl: "https://x.com/TileOnGIWA",
  whitelistPostUrl: "#",
  mintNetwork: "Robinhood Chain mainnet",
  mintDate: "TBA",
  createSignalPost(_tileNumber?: number) {
    return [
      "I just completed my TILE whitelist application.",
      "",
      "1,111 pieces. One story.",
      "Born from Korean giwa culture, built for the next chapter.",
      "",
      "@TileOnGIWA",
    ].join("\n");
  },
} as const;

export function formatTileNumber(value: number) {
  return String(value).padStart(4, "0");
}
