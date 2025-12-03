/* Utility functions for formatting data */

import { CURRENCY_SYMBOLS, STABLECOINS } from "./constants"

export function formatCurrency(
  amount: number | string,
  currency: "cUSD" | "cNGN" = "cUSD",
  includeSymbol = true,
): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)

  if (!includeSymbol) return formatted
  const symbol = CURRENCY_SYMBOLS[currency]
  return `${symbol}${formatted}`
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} · ${formatTime(date)}`
}

export function abbreviateNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toFixed(0)
}

export function getStablecoinInfo(symbol: "cUSD" | "cNGN") {
  return STABLECOINS.find((sc) => sc.symbol === symbol)
}
