// src/data/casinosData.js

function normCC(countryCode) {
    return String(countryCode || "").trim().toUpperCase();
}

/**
 * Region ISO2 sets.
 * Used for rules like: "Africa, Asia, Middle East".
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

// If you want to be stricter later, we can curate this list.
// For now it is practical: "Europe => EUR"
const EUROPE = new Set([
    "AL", "AD", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR",
    "GB", "GE", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV", "MC", "MD", "ME",
    "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SK", "SM", "TR", "UA", "VA",
]);

function getRegionFlags(countryCode) {
    const cc = normCC(countryCode);
    if (!cc) return { AFRICA: false, ASIA: false, MIDDLE_EAST: false };

    return {
        AFRICA: REGION.AFRICA.has(cc),
        ASIA: REGION.ASIA.has(cc),
        MIDDLE_EAST: REGION.MIDDLE_EAST.has(cc),
    };
}

function getCurrencyGroup(countryCode) {
    const cc = normCC(countryCode);
    if (!cc) return "USD";
    if (cc === "TR") return "TRY";
    if (cc === "IN") return "INR";
    if (EUROPE.has(cc)) return "EUR";
    return "USD";
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

/**
 * Bonus resolver (NO conversion):
 * Priority:
 * 1) bonuses.byCountry[CC] (exact country override)
 * 2) bonuses.byCurrency[GROUP] (EUR/USD/INR/TRY)
 * 3) bonuses.default
 * 4) fallback to bonusTitle/bonusDetails on object
 */
function resolveBonus(casino, countryCode) {
    const cc = normCC(countryCode);
    const group = getCurrencyGroup(cc);
    const bonuses = casino.bonuses || null;

    if (!bonuses) {
        return {
            bonusTitle: casino.bonusTitle || "",
            bonusDetails: casino.bonusDetails || "",
            bonusMetrics: casino.bonusMetrics || null,
        };
    }

    const byCountry = bonuses.byCountry || {};
    const byCurrency = bonuses.byCurrency || {};

    const picked =
        (cc && byCountry[cc]) ||
        byCurrency[group] ||
        bonuses.default ||
        null;

    return {
        bonusTitle: picked?.title || "",
        bonusDetails: picked?.details || "",
        bonusMetrics: picked?.metrics || null,
    };
}

/**
 * Returns casinos visible for the country.
 * Also picks:
 * - correct affiliate link (links[CC] -> links.default)
 * - correct bonus text (byCountry -> byCurrency -> default)
 */
export function getVisibleCasinosForCountry(countryCode) {
    const cc = normCC(countryCode);

    return CASINOS
        .filter((c) => isCasinoAllowedInCountry(c, cc))
        .map((c) => {
            const { bonusTitle, bonusDetails, bonusMetrics } = resolveBonus(c, cc);
            return {
                ...c,
                bonusTitle,
                bonusDetails,
                bonusMetrics,
                playUrl: c.links?.[cc] || c.links?.default || c.playUrl || null,
            };
        })
        .filter((c) => Boolean(c.playUrl));
}

export const CASINOS = [
    {
        id: "melbet",
        name: "MELBET",
        heroUrl: "/logos/melbet.png",
        rating: 4.7,
        tags: ["Fast payouts", "Mobile"],
        theme: "casinoThemeOrange",
        links: {
            default:
                "https://refpa3665.com/L?tag=d_652383m_45415c_FreakSlots&site=652383&ad=45415&r=registration",
        },
        // No conversion: whole-number presets
        bonuses: {
            default: { title: "Welcome package up to $1,900 + 290 FS", details: "" },
            byCountry: {
                TR: { title: "Welcome package up to 64,750 ₺ + 290 FS", details: "" },
                IN: { title: "Welcome package up to ₹212,000 + 250 FS", details: "" },
            },
            // Optional (if you want Europe to look clean):
            byCurrency: {
                EUR: { title: "Welcome package up to €1,900 + 290 FS", details: "" },
            },
        },
        geo: { worldwide: true, includeCountries: [], includeRegions: [], excludeCountries: [] },
    },

    {
        id: "mega-pari",
        name: "Mega Pari",
        heroUrl: "/logos/megapari.png",
        rating: 4.4,
        tags: ["Beginner friendly"],
        theme: "casinoThemeGold",
        links: { default: "https://freakslots.com/games" },
        bonuses: {
            default: { title: "Welcome package up to $2,050 + 150 FS", details: "" },
            byCountry: {
                TR: { title: "Welcome package up to 64,750 ₺ + 290 FS", details: "" },
                IN: { title: "Welcome package up to ₹212,000 + 250 FS", details: "" },
            },
            byCurrency: {
                EUR: { title: "Welcome package up to €2,050 + 150 FS", details: "" },
            },
        },
        geo: { worldwide: true, includeCountries: [], includeRegions: [], excludeCountries: [] },
    },

    {
        id: "1-win",
        name: "1Win",
        heroUrl: "/logos/1win.png",
        rating: 4.3,
        tags: ["VIP", "High limits"],
        theme: "casinoThemeBlue",
        links: { default: "https://freakslots.com/xcPj29" },
        bonuses: {
            default: { title: "Welcome bonus 500% up to $2,000 on first deposit", details: "" },
            byCountry: {
                TR: { title: "First deposit bonus 500% up to 16,600 ₺", details: "" },
                IN: { title: "Welcome bonus 500% up to ₹80,400 on first deposit", details: "" },
            },
            byCurrency: {
                EUR: { title: "Welcome bonus 500% up to €2,000 on first deposit", details: "" },
            },
        },
        geo: { worldwide: true, includeCountries: [], includeRegions: [], excludeCountries: [] },
    },

    {
        id: "vulkan",
        name: "Vulkan Spiele",
        heroUrl: "/logos/vulkan.png",
        rating: 4.3,
        tags: ["VIP", "High limits"],
        theme: "casinoThemeBlue",
        links: { default: "https://freakslots.com/x1fXSH" },
        bonuses: {
            default: {
                title: "WELCOME BONUS UP TO €2,000",
                details: "Up to 450% deposit bonus and up to 250 FD",
            },
            byCountry: {},
            byCurrency: {
                USD: { title: "WELCOME BONUS UP TO $2,000", details: "Up to 450% deposit bonus and up to 250 FD" },
                EUR: { title: "WELCOME BONUS UP TO €2,000", details: "Up to 450% deposit bonus and up to 250 FD" },
            },
        },
        geo: {
            worldwide: false,
            includeCountries: [
                "DE", "BE", "LU", "LI", "AT", "DK", "NO", "PL", "LV", "LT", "EE", "SK", "SI", "GR", "FI", "PT", "RO", "BG",
                "HR", "HU", "BA", "AL", "MK", "ME", "IS", "CA", "IE", "CH", "SE", "GE", "MD",
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
        tags: ["Cashback", "Live"],
        theme: "casinoThemePurple",
        links: { default: "https://freakslots.com/YCb7Mb" },
        bonuses: {
            default: { title: "Sign up and get a bonus €1,200 + 220 FS", details: "" },
            byCountry: {},
            byCurrency: {
                USD: { title: "Sign up and get a bonus $1,200 + 220 FS", details: "" },
                EUR: { title: "Sign up and get a bonus €1,200 + 220 FS", details: "" },
            },
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
        id: "ggbet",
        name: "GGBET",
        heroUrl: "/logos/ggbet.png",
        rating: 4.7,
        tags: ["Esports", "Big bonuses"],
        theme: "casinoThemeOrange",
        links: { default: "https://freakslots.com/XxRRx9" },
        bonuses: {
            default: { title: "Welcome Bonus up to €3,000 + 900 FS", details: "" },
            byCountry: {},
            byCurrency: {
                USD: { title: "Welcome Bonus up to $3,000 + 900 FS", details: "" },
                EUR: { title: "Welcome Bonus up to €3,000 + 900 FS", details: "" },
            },
        },
        geo: {
            worldwide: false,
            includeCountries: [
                "IE", "CA", "IS", "LV", "MK", "AL", "BA", "ME", "RO", "PL", "GR", "EE", "AT", "SE", "LI", "LU", "DK", "NO",
                "HU", "SK", "SI", "BG", "HR", "LT", "CH", "GE", "MD",
            ],
            includeRegions: [],
            excludeCountries: [],
        },
    },

    {
        id: "hitnspin",
        name: "Hit'N'Spin",
        heroUrl: "/logos/hitnspin.png",
        rating: 4.6,
        tags: ["No deposit", "Slots"],
        theme: "casinoThemeCyan",
        links: { default: "https://freakslots.com/kC255k" },
        bonuses: {
            default: { title: "Welcome Bonus €800 + 200 FS", details: "" },
            byCountry: {},
            byCurrency: {
                USD: { title: "Welcome Bonus $800 + 200 FS", details: "" },
                EUR: { title: "Welcome Bonus €800 + 200 FS", details: "" },
            },
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
        id: "slotoro",
        name: "Slotoro",
        heroUrl: "/logos/slotoro.png",
        rating: 4.3,
        tags: ["Fast payouts", "Slots"],
        theme: "casinoThemeBlue",
        links: { default: "https://freakslots.com/bT42K2" },
        bonuses: {
            default: { title: "Welcome bonus €2,500 + 250 free spins", details: "" },
            byCountry: {},
            byCurrency: {
                USD: { title: "Welcome bonus $2,500 + 250 free spins", details: "" },
                EUR: { title: "Welcome bonus €2,500 + 250 free spins", details: "" },
            },
        },
        geo: { worldwide: false, includeCountries: ["PL", "DE"], includeRegions: [], excludeCountries: [] },
    },
];
