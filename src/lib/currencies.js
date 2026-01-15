// src/lib/currency.js

// “Europe” here = EU + EEA + a few common European countries.
// Adjust if you want stricter/looser.
const EUROPE_ISO2 = new Set([
    "AL", "AD", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GE",
    "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL",
    "PT", "RO", "RS", "RU", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
]);

// Hardcoded FX rates relative to USD.
// Meaning: 1 USD = FX[currency] units of that currency.
// Update these manually when you want (weekly/monthly).
export const FX = {
    USD: 1,
    EUR: 0.92,
    TRY: 30.5,
    INR: 83.0,
};

export const SYMBOL = {
    USD: "$",
    EUR: "€",
    TRY: "₺",
    INR: "₹",
};

export function normCC(countryCode) {
    return String(countryCode || "").trim().toUpperCase();
}

export function getTargetCurrency(countryCode) {
    const cc = normCC(countryCode);

    if (cc === "IN") return "INR";
    if (cc === "TR") return "TRY";
    if (EUROPE_ISO2.has(cc)) return "EUR";
    return "USD";
}

export function convertAmount(amount, from, to) {
    const a = Number(amount);
    if (!Number.isFinite(a)) return null;

    const f = String(from || "USD").toUpperCase();
    const t = String(to || "USD").toUpperCase();

    if (!FX[f] || !FX[t]) return null;
    if (f === t) return a;

    // FX is “per USD”, so:
    // amount in USD = amount / FX[from]
    // amount in to-currency = amountUSD * FX[to]
    const usd = a / FX[f];
    return usd * FX[t];
}

export function formatMoney(amount, currency) {
    const c = String(currency || "USD").toUpperCase();
    const v = Number(amount);
    if (!Number.isFinite(v)) return "";

    // Keep it simple and readable: no decimals, add symbol.
    const sym = SYMBOL[c] || "";
    const rounded = Math.round(v);

    // Simple thousands formatting
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${sym}${formatted}`;
}