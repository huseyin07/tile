export const siteConfig = {
  name: "TILE",
  supply: 1111,
  xHandle: "TileOnGIWA",
  xUrl: "https://x.com/TileOnGIWA",
  whitelistPostUrl: "#",
  mintNetwork: "Robinhood Chain mainnet",
  mintDate: "TBA",
  createSignalPost() {
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
