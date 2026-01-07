// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { getTelegramUser } from "../lib/telegramUser";
import { ensureGeo, readSavedGeo } from "../lib/geo";

function initialsFromUser(u) {
    const first = (u?.firstName?.[0] || "U").toUpperCase();
    const last = (u?.lastName?.[0] || "").toUpperCase();
    return `${first}${last}`.trim();
}

export default function ProfilePage() {
    const tgUser = useMemo(() => getTelegramUser(), []);
    const [geo, setGeo] = useState(() => readSavedGeo());

    const managerUrl = import.meta.env.VITE_MANAGER_TG_URL || "https://t.me/";

    async function refreshGeo() {
        setGeoBusy(true);
        const latest = await ensureGeo();
        if (latest) setGeo(latest);
        setGeoBusy(false);
    }

    const displayName = tgUser?.username || tgUser?.name || "Guest";
    const geoLabel = geo?.label || "Detecting…";

    return (
        <div className="page">
            <div className="profileWrap">
                <div className="profileCard">
                    <div className="profileHeader">
                        {tgUser?.photoUrl ? (
                            <img className="profileAvatar" src={tgUser.photoUrl} alt={displayName} />
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

                    <a className="contactManagerBtn" href={managerUrl} target="_blank" rel="noreferrer">
                        <span className="contactManagerIcon" aria-hidden="true">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20 14.5a3 3 0 0 1-3 3H9l-5 3v-3.5a3 3 0 0 1-2-2.8V7.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>Contact manager</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
