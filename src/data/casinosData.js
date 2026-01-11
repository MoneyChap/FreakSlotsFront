// src/data/casinosData.js

// Small helper to normalize country codes.
function normCC(countryCode) {
    return String(countryCode || "").trim().toUpperCase();
}

/**
 * Region ISO2 sets.
 * Used for rules like: "Africa, Asia, Middle East".
 * If later you want more strict control, we can replace these with your own curated lists.
 */
const REGION = {
    AFRICA: new Set([
        "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CD", "CG", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW",
    ]),
    ASIA: new Set([
        "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE",
    ]),
    MIDDLE_EAST: new Set([
        "BH", "CY", "EG", "IR", "IQ", "IL", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "AE", "YE",
    ]),
};

function getRegionFlags(countryCode) {
    const cc = normCC(countryCode);
    if (!cc) return { AFRICA: false, ASIA: false, MIDDLE_EAST: false };

    return {
        AFRICA: REGION.AFRICA.has(cc),
        ASIA: REGION.ASIA.has(cc),
        MIDDLE_EAST: REGION.MIDDLE_EAST.has(cc),
    };
}

/**
 * GEO rule format:
 * geo: {
 *   worldwide: boolean,
 *   includeCountries: ["LV","EE"...],
 *   includeRegions: ["AFRICA","ASIA","MIDDLE_EAST"],
 *   excludeCountries: ["US"...]
 * }
 */
export function isCasinoAllowedInCountry(casino, countryCode) {
    const cc = normCC(countryCode);
    const geo = casino.geo || {};

    if (!cc) {
        // If GEO is unknown, show only worldwide items.
        return Boolean(geo.worldwide);
    }

    if (Array.isArray(geo.excludeCountries) && geo.excludeCountries.includes(cc)) return false;

    if (geo.worldwide) return true;

    if (Array.isArray(geo.includeCountries) && geo.includeCountries.includes(cc)) return true;

    if (Array.isArray(geo.includeRegions) && geo.includeRegions.length) {
        const regions = getRegionFlags(cc);
        return geo.includeRegions.some((r) => Boolean(regions[r]));
    }

    return false;
}

export function getVisibleCasinosForCountry(countryCode) {
    const cc = normCC(countryCode);

    return CASINOS
        .filter((c) => isCasinoAllowedInCountry(c, cc))
        .map((c) => ({
            ...c,
            playUrl: c.links?.[cc] || c.links?.default || c.playUrl || null,
        }))
        .filter((c) => Boolean(c.playUrl));
}

/**
 * Your casino catalog.
 * Notes:
 * - I normalized heroUrl paths to start with "/" (public folder usage).
 * - I added geo rules + affiliate links from your mapping.
 * - For Hit'N'Spin: you wrote "Gergoia" -> using "GE".
 */
export const CASINOS = [
    {
        id: "mega-pari",
        name: "Mega Pari",
        heroUrl: "/logos/megapari.png",
        rating: 4.4,
        bonusTitle: "20 free spins",
        bonusDetails: "Instant signup bonus",
        tags: ["Beginner friendly"],
        theme: "casinoThemeGold",

        links: {
            default: "https://freakslots.com/games",
        },

        geo: {
            worldwide: true,
            includeCountries: [],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    {
        id: "1-win",
        name: "1Win",
        heroUrl: "/logos/1win.png",
        rating: 4.3,
        bonusTitle: "200% up to €1,000",
        bonusDetails: "VIP rewards available",
        tags: ["VIP", "High limits"],
        theme: "casinoThemeBlue",

        links: {
            default: "https://freakslots.com/xcPj29",
        },

        geo: {
            worldwide: false,
            includeCountries: ["TR", "IN"],
            includeRegions: ["AFRICA", "ASIA", "MIDDLE_EAST"],
            excludeCountries: [],
        },
    },

    {
        id: "hitnspin",
        name: "Hit'N'Spin",
        heroUrl: "/logos/hitnspin.png",
        rating: 4.6,
        bonusTitle: "150 free spins",
        bonusDetails: "No deposit for new users",
        tags: ["No deposit", "Slots"],
        theme: "casinoThemeCyan",

        links: {
            default: "https://freakslots.com/kC255k",
        },

        geo: {
            worldwide: false,
            includeCountries: [
                "HU", "RO", "BG", "PT", "DE", "CH", "PL", "IT", "LV", "LT", "EE", "GR", "BE", "LU", "LI", "AT", "DK", "NO", "SE", "GE",
            ],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    {
        id: "verde-casino",
        name: "Verde Casino",
        heroUrl: "/logos/verde.png",
        rating: 4.5,
        bonusTitle: "50% up to €300",
        bonusDetails: "Weekly cashback 10%",
        tags: ["Cashback", "Live"],
        theme: "casinoThemePurple",

        links: {
            default: "https://freakslots.com/YCb7Mb",
        },

        geo: {
            worldwide: false,
            includeCountries: [
                "BE", "AT", "DK", "SE", "LU", "LI",
                "HU", "AL", "BA", "ME",
                "IS", "CA",
                "PL",
                "EE", "LV", "LT", "IT",
                "GR",
                "NO",
                "RO", "BG", "PT",
                "HR", "SK", "SI",
                "GE",
                "CL",
                "DE",
            ],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    {
        id: "slotoro",
        name: "Slotoro",
        heroUrl: "/logos/slotoro.png",
        rating: 4.3,
        bonusTitle: "200% up to €1,000",
        bonusDetails: "VIP rewards available",
        tags: ["VIP", "High limits"],
        theme: "casinoThemeBlue",

        links: {
            default: "https://freakslots.com/bT42K2",
        },

        geo: {
            worldwide: false,
            includeCountries: ["PL", "DE"],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    {
        id: "vulkan",
        name: "Vulkan Spiele",
        heroUrl: "/logos/vulkan.png",
        rating: 4.3,
        bonusTitle: "200% up to €1,000",
        bonusDetails: "VIP rewards available",
        tags: ["VIP", "High limits"],
        theme: "casinoThemeBlue",

        links: {
            default: "https://freakslots.com/x1fXSH",
        },

        geo: {
            worldwide: false,
            includeCountries: [
                "DE",
                "BE", "LU", "LI",
                "AT", "DK", "NO",
                "PL", "LV", "LT", "EE", "SK", "SI", "GR", "FI",
                "PT", "RO", "BG",
                "HR", "HU",
                "BA", "AL", "MK", "ME",
                "IS", "CA", "IE",
                "CH",
                "SE",
                "GE",
                "MD",
            ],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    // You included MELBET in your object, but you did not provide GEO mapping for it yet.
    // For safety it is set to worldwide: false (hidden) until you confirm GEOs + link.
    {
        id: "melbet",
        name: "MELBET",
        heroUrl: "/logos/melbet.png",
        rating: 4.7,
        bonusTitle: "100% up to €500",
        bonusDetails: "Plus 200 free spins",
        tags: ["Fast payouts", "Mobile"],
        theme: "casinoThemeOrange",

        links: {
            default: "https://example.com",
        },

        geo: {
            worldwide: false,
            includeCountries: [],
            includeRegions: [],
            excludeCountries: [],
        },
    },
];
