// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { getTelegramUser } from "../lib/telegramUser";

const GEO_STORAGE_KEY = "freakslots_geo_v1";

function initialsFromUser(u) {
    const first = (u?.firstName?.[0] || "U").toUpperCase();
    const last = (u?.lastName?.[0] || "").toUpperCase();
    return `${first}${last}`.trim();
}

function readSavedGeo() {
    try {
        const raw = localStorage.getItem(GEO_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed;
    } catch {
        return null;
    }
}

function saveGeo(payload) {
    try {
        localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // ignore
    }
}

export default function ProfilePage() {
    const tgUser = useMemo(() => getTelegramUser(), []);

    const [geo, setGeo] = useState(() => readSavedGeo());
    const [geoBusy, setGeoBusy] = useState(false);
    const [geoError, setGeoError] = useState("");

    const managerUrl = import.meta.env.VITE_MANAGER_TG_URL || "https://t.me/";
    const apiBase = import.meta.env.VITE_API_BASE || "";

    // Initialize Telegram LocationManager if available
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        const lm = tg?.LocationManager;
        if (!lm) return;

        try {
            if (!lm.isInited) lm.init();
        } catch {
            // ignore
        }
    }, []);

    async function reverseGeocode(lat, lon) {
        const r = await fetch(`${apiBase}/api/geo/reverse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
        });

        const data = await r.json().catch(() => null);
        if (!r.ok || !data?.ok) {
            const msg =
                data?.error ||
                `Reverse geocode failed${r?.status ? ` (${r.status})` : ""}`;
            throw new Error(msg);
        }
        return data;
    }

    function openGeoSettings() {
        const tg = window.Telegram?.WebApp;
        const lm = tg?.LocationManager;
        if (!lm) return;

        try {
            lm.openSettings();
        } catch {
            // ignore
        }
    }

    function requestGeo() {
        setGeoError("");

        const tg = window.Telegram?.WebApp;
        const lm = tg?.LocationManager;

        if (!tg || !lm) {
            setGeoError("Location is available only inside Telegram.");
            return;
        }

        try {
            if (!lm.isInited) lm.init();
        } catch {
            // ignore
        }

        if (lm.isLocationAvailable === false) {
            setGeoError("Location is not supported on this Telegram client.");
            return;
        }

        setGeoBusy(true);

        // Telegram returns coordinates only if the user grants access
        lm.getLocation(async (loc) => {
            try {
                if (!loc) {
                    setGeoError("Location access was not granted.");
                    setGeoBusy(false);
                    return;
                }

                const lat = Number(loc.latitude);
                const lon = Number(loc.longitude);

                if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                    setGeoError("Location data is invalid.");
                    setGeoBusy(false);
                    return;
                }

                const resolved = await reverseGeocode(lat, lon);

                const payload = {
                    label: resolved.label || null,
                    country: resolved.country || null,
                    city: resolved.city || null,
                    lat,
                    lon,
                    updatedAt: Date.now(),
                };

                saveGeo(payload);
                setGeo(payload);
                setGeoBusy(false);
            } catch (e) {
                setGeoError(String(e?.message || e));
                setGeoBusy(false);
            }
        });
    }

    const displayName = tgUser?.username || tgUser?.name || "Guest";
    const geoLabel = geo?.label || "Not set";

    return (
        <div className="page">
            <div className="profileWrap">
                <div className="profileCard">
                    <div className="profileHeader">
                        {tgUser?.photoUrl ? (
                            <img
                                className="profileAvatar"
                                src={tgUser.photoUrl}
                                alt={displayName}
                            />
                        ) : (
                            <div className="profileAvatar profileAvatarFallback">
                                {initialsFromUser(tgUser)}
                            </div>
                        )}

                        <div className="profileName">{displayName}</div>
                    </div>

                    <div className="profileRows">
                        <div className="profileRow">
                            <div className="profileLabel">Telegram ID:</div>
                            <div className="profileValue">{tgUser?.id || ""}</div>
                        </div>

                        <div className="profileRow">
                            <div className="profileLabel">Source:</div>
                            <div className="profileValue">Telegram WebApp</div>
                        </div>

                        <div className="profileRow">
                            <div className="profileLabel">GEO:</div>
                            <div className="profileValue">{geoLabel}</div>
                        </div>
                    </div>

                    <div className="profileGeoActions">
                        <button
                            type="button"
                            className="geoPrimaryBtn"
                            onClick={requestGeo}
                            disabled={geoBusy}
                        >
                            {geoBusy ? "Requesting location..." : "Enable location"}
                        </button>

                        <button
                            type="button"
                            className="geoGhostBtn"
                            onClick={openGeoSettings}
                            disabled={geoBusy}
                        >
                            Settings
                        </button>
                    </div>

                    {geoError ? <div className="geoErrorText">{geoError}</div> : null}

                    <a
                        className="contactManagerBtn"
                        href={managerUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="contactManagerIcon" aria-hidden="true">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 14.5a3 3 0 0 1-3 3H9l-5 3v-3.5a3 3 0 0 1-2-2.8V7.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>Contact Manager</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
