// src/lib/geo.js
const GEO_KEY = "freakslots_geo_v1";

export function readSavedGeo() {
    try {
        const raw = localStorage.getItem(GEO_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed;
    } catch {
        return null;
    }
}

export function saveGeo(payload) {
    try {
        localStorage.setItem(GEO_KEY, JSON.stringify(payload));
    } catch {
        // ignore
    }
}

export async function fetchGeoFromApi() {
    const API_BASE = import.meta.env.VITE_API_BASE || "";
    const r = await fetch(`${API_BASE}/api/geo`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    const data = await r.json().catch(() => null);
    if (!r.ok || !data?.ok) {
        const msg = data?.error || `GEO fetch failed (HTTP ${r.status})`;
        throw new Error(msg);
    }
    return data;
}

/**
 * Fetch GEO and store it. Safe to call on every app start.
 * Returns saved object or null if failed.
 */
export async function ensureGeo() {
    try {
        const data = await fetchGeoFromApi();

        const payload = {
            label: data.label || null,
            country: data.country || null,
            countryCode: data.countryCode || null,
            city: data.city || null,
            region: data.region || null,
            timezone: data.timezone || null,
            ip: data.ip || null,
            updatedAt: Date.now(),
        };

        saveGeo(payload);
        return payload;
    } catch {
        return null;
    }
}
