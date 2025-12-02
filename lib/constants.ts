/* AfriDaily Design System Constants */

export const COLORS = {
  primary: "#0B5FFF",
  accent: "#FFB703",
  success: "#16A34A",
  danger: "#EF4444",
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
}

export const TYPOGRAPHY = {
  h1: { size: "28px", lineHeight: "1.4", weight: 700 },
  h2: { size: "24px", lineHeight: "1.4", weight: 600 },
  body: { size: "16px", lineHeight: "1.5", weight: 400 },
  small: { size: "14px", lineHeight: "1.4", weight: 400 },
}

export const SPACING = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
}

export const RADIUS = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
}

export const MOTION = {
  duration: "200ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out
}

export const CURRENCY_SYMBOLS = {
  cUSD: "₵",
  cNGN: "₦",
}

export const WALLET_NETWORKS = {
  CELO: {
    chainId: 42220,
    name: "Celo",
    currency: "CELO",
  },
  CELO_ALFAJORES: {
    chainId: 44787,
    name: "Celo Alfajores",
    currency: "CELO",
  },
}

export const ROUTES = {
  HOME: "/",
  WALLET: "/wallet",
  WALLET_CREATE: "/wallet/create",
  WALLET_IMPORT: "/wallet/import",
  STREAMS: "/streams",
  STREAMS_CREATE: "/streams/create",
  CIRCLES: "/circles",
  CIRCLES_CREATE: "/circles/create",
}

export const STABLECOINS = [
  {
    symbol: "cUSD",
    name: "Celo Dollar",
    address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  },
  {
    symbol: "cNGN",
    name: "Celo Nigerian Naira",
    address: "0xe8537aCeaF7F50a92B05Df2D42ba20E2C221812B",
  },
]
