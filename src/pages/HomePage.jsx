import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCarousel from "../components/GameCarousel";
import { getTelegramUser } from "../lib/telegramUser";
import { readHomeCache, fetchHomeFromApi, writeHomeCache } from "../lib/homeCache";

export default function HomePage() {
    const nav = useNavigate();
    const [tgUser, setTgUser] = useState(null);

    const cached = readHomeCache();

    const [sections, setSections] = useState(() =>
        cached?.sections ? cached.sections : []
    );

    // Only show "Loading..." if nothing exists at all
    const [loading, setLoading] = useState(() => !cached?.sections?.length);

    useEffect(() => {
        setTgUser(getTelegramUser());
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                // If cache exists, do not show loading UI
                if (cached?.sections?.length) setLoading(false);

                const data = await fetchHomeFromApi();
                if (cancelled) return;

                const next = Array.isArray(data) ? data : [];
                setSections(next);
                writeHomeCache(next);
            } catch {
                // Intentionally silent: no frontend errors shown
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="page" style={{ paddingBottom: 80 }}>
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

            <button
                type="button"
                className="wheelEntryCard"
                onClick={() => nav("/wheel")}
                aria-label="Open Spin the Wheel"
            >
                <div className="wheelEntryBadge">Lucky Wheel</div>
                <div className="wheelEntryTitle">Spin the wheel</div>
                <div className="wheelEntrySubtitle">Win casino bonuses and free spins</div>
                <div className="wheelEntryCta">Play Now</div>
            </button>

            {loading ? <div className="homeInlineLoading">Loading…</div> : null}

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
