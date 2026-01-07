import { useMemo } from "react";
import { getTelegramUser } from "../lib/telegramUser";

function initialsFromUser(u) {
    const a = (u?.firstName?.[0] || "U").toUpperCase();
    const b = (u?.lastName?.[0] || "").toUpperCase();
    return `${a}${b}`.trim();
}

export default function ProfilePage() {
    const tgUser = useMemo(() => getTelegramUser(), []);

    const managerUrl = import.meta.env.VITE_MANAGER_TG_URL || "https://t.me/";

    return (
        <div className="page">
            <div className="profileWrap">
                <div className="profileCard">
                    <div className="profileHeader">
                        {tgUser?.photoUrl ? (
                            <img
                                className="profileAvatar"
                                src={tgUser.photoUrl}
                                alt={tgUser.name}
                            />
                        ) : (
                            <div className="profileAvatar profileAvatarFallback">
                                {initialsFromUser(tgUser)}
                            </div>
                        )}

                        <div className="profileName">
                            {tgUser?.username || tgUser?.name || "Guest"}
                        </div>
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
                            <div className="profileValue">Not available yet</div>
                        </div>
                    </div>

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
