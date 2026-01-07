import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCarousel from "../components/GameCarousel";
import { getTelegramUser } from "../lib/telegramUser";
import { readHomeCache, fetchHomeFromApi, writeHomeCache } from "../lib/homeCache";

export default function HomePage() {
    const nav = useNavigate();
    const [tgUser, setTgUser] = useState(null);

    const cached = readHomeCache();

    const [sections, setSections] = useState(() => (cached?.sections ? cached.sections : []));
    const [loading, setLoading] = useState(() => !cached?.sections?.length);
    const [err, setErr] = useState("");

    useEffect(() => {
        setTgUser(getTelegramUser());
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                // If we have fresh cache, do not show loading, just background refresh.
                if (cached?.sections?.length) {
                    setLoading(false);
                }

                const data = await fetchHomeFromApi();

                if (cancelled) return;

                setSections(Array.isArray(data) ? data : []);
                writeHomeCache(Array.isArray(data) ? data : []);
                setErr("");
            } catch (e) {
                if (cancelled) return;

                // If cache exists, keep UI and only show error silently
                // If no cache, show error openly
                setErr(String(e.message || e));
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
        // Intentionally run once only
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="page" style={{paddingBottom: 80}}>
            <div className="topbar">
                <div className="topbarPill">
                    <div className="topbarStatus">
                        <span className="statusDot" />
                        <span className="statusText">Online</span>
                    </div>

                    <div className="topbarDivider" />

                    <div className="topbarUser">
                        <div className="userName">{tgUser ? tgUser.name : "Guest"}</div>

                        {tgUser?.photoUrl ? (
                            <img className="userAvatar" src={tgUser.photoUrl} alt={tgUser.name} />
                        ) : (
                            <div className="userAvatar userAvatarFallback">
                                {tgUser
                                    ? `${(tgUser.firstName?.[0] || "U").toUpperCase()}${(tgUser.lastName?.[0] || "").toUpperCase()}`
                                    : "G"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Only show this when there is no cache */}
            {loading ? <div className="homeInlineLoading">Loading…</div> : null}

            {/* If cache exists, do not block UI; show small error line */}
            {err ? (
                <div className="homeInlineError">
                    {cached?.sections?.length ? "Update failed. Showing cached games." : `Error loading API:\n${err}`}
                </div>
            ) : null}

            {sections.map((s) => (
                <div key={s.id} className="sectionBlock">
                    <div className="sectionTitle">
                        <span>{s.icon}</span>
                        <span>{s.title}</span>
                    </div>

                    <GameCarousel games={s.games} sectionId={s.id} onPlay={(game) => nav(`/game/${game.id}`)} />
                </div>
            ))}
        </div>
    );
}
