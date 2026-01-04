import { useNavigate } from "react-router-dom";
import { sections } from "../data/mockGames";
import GameCarousel from "../components/GameCarousel";
import { useEffect } from "react";
import { initTelegramUi } from "../lib/telegram";

export default function HomePage() {
    const nav = useNavigate();
    useEffect(() => {
        initTelegramUi();
    }, []);

    return (
        <div className="page">
            <div className="shell roundedFrame">
                <div className="topbar">
                    <div className="appTitle">FreakSlots</div>
                    <div style={{ opacity: 0.7 }}>•••</div>
                </div>
            </div>

            {sections.map((s) => (
                <div key={s.id}>
                    <div className="sectionTitle">
                        <span>{s.icon}</span>
                        <span>{s.title}</span>
                    </div>

                    <GameCarousel
                        games={s.games}
                        onSelect={(game) => nav(`/game/${game.id}`)}
                    />
                </div>
            ))}
        </div>
    );
}
