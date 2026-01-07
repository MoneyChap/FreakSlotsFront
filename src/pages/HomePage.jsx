import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCarousel from "../components/GameCarousel";
import { getTelegramUser } from "../lib/telegramUser";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function HomePage() {
    const nav = useNavigate();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [tgUser, setTgUser] = useState(null);

    useEffect(() => {
        setTgUser(getTelegramUser());
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const url = `${API_BASE}/api/home`;
                const res = await fetch(url);
                const text = await res.text(); // read as text first
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
                const data = JSON.parse(text);
                setSections(Array.isArray(data) ? data : []);
            } catch (e) {
                setErr(String(e.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="page">
            <div className="topbar">
                <div className="appTitle">FreakSlots</div>

                <div className="topbarRight">
                    <div className="statusPill">
                        <span className="statusDot" />
                        <span>Online</span>
                    </div>

                    {tgUser ? (
                        <div className="userPill">
                            <div className="userName">{tgUser.name}</div>

                            {tgUser.photoUrl ? (
                                <img className="userAvatar" src={tgUser.photoUrl} alt={tgUser.name} />
                            ) : (
                                <div className="userAvatar userAvatarFallback">
                                    {(tgUser.firstName?.[0] || "U").toUpperCase()}
                                    {(tgUser.lastName?.[0] || "").toUpperCase()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="userPill">
                            <div className="userName" style={{ opacity: 0.7 }}>Guest</div>
                            <div className="userAvatar userAvatarFallback">G</div>
                        </div>
                    )}
                </div>
            </div>

            {loading && <div style={{ opacity: 0.7, padding: 10 }}>Loading…</div>}

            {err && (
                <div style={{ padding: 12, color: "#ffb4b4", fontSize: 13, whiteSpace: "pre-wrap" }}>
                    Error loading API:\n{err}\n\nAPI_BASE: {API_BASE}
                </div>
            )}

            {sections.map((s) => (
                <div key={s.id} className="sectionBlock">
                    <div className="sectionTitle">
                        <span>{s.icon}</span>
                        <span>{s.title}</span>
                    </div>

                    <GameCarousel
                        games={s.games}
                        sectionId={s.id}
                        onPlay={(game) => nav(`/game/${game.id}`)}
                    />
                </div>
            ))}
        </div>
    );
}
