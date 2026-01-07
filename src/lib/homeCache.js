// src/lib/homeCache.js
const KEY = "freakslots_home_cache_v1";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function readHomeCache() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;

        const age = Date.now() - Number(parsed.savedAt || 0);
        if (!Number.isFinite(age) || age < 0) return null;

        const sections = Array.isArray(parsed.sections) ? parsed.sections : null;
        if (!sections) return null;

        return {
            sections,
            savedAt: parsed.savedAt,
            isFresh: age <= TTL_MS,
            ageMs: age,
        };
    } catch {
        return null;
    }
}

export function writeHomeCache(sections) {
    try {
        localStorage.setItem(
            KEY,
            JSON.stringify({
                sections: Array.isArray(sections) ? sections : [],
                savedAt: Date.now(),
            })
        );
    } catch {
        // ignore
    }
}

export async function fetchHomeFromApi() {
    const API_BASE = import.meta.env.VITE_API_BASE;
    const url = `${API_BASE}/api/home`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });

    const text = await res.text().catch(() => "");
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
}

/**
 * Warm up cache. Safe to call on app open.
 * Returns { ok, sections? } and never throws.
 */
export async function warmHomeCache() {
    try {
        const sections = await fetchHomeFromApi();
        writeHomeCache(sections);
        return { ok: true, sections };
    } catch {
        return { ok: false };
    }
}
