import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCarousel from "../components/GameCarousel";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function HomePage() {
    const nav = useNavigate();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/home`)
            .then((r) => r.json())
            .then((data) => setSections(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page">
            <div className="topbar">
                <div className="appTitle">FreakSlots</div>
                <div style={{ opacity: 0.7 }}>•••</div>
            </div>

            {loading && <div style={{ opacity: 0.7, padding: 10 }}>Loading…</div>}

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
