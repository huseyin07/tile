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
      "One tile becomes part of something greater.",
      "",
      "I’m joining the first 1,111.",
      "",
      "TILE · 기와",
      "Minting first on Robinhood Chain. Moving to GIWA when mainnet is live.",
      "",
      "@TileOnGIWA",
    ].join("\n");
  },
} as const;

export function formatTileNumber(value: number) {
  return String(value).padStart(4, "0");
}
