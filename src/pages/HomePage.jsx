import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCarousel from "../components/GameCarousel";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function HomePage() {
    const nav = useNavigate();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

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
                <div style={{ opacity: 0.7 }}>•••</div>
            </div>

            {loading && <div style={{ opacity: 0.7, padding: 10 }}>Loading…</div>}

            {err && (
                <div style={{ padding: 12, color: "#ffb4b4", fontSize: 13, whiteSpace: "pre-wrap" }}>
                    Error loading API:\n{err}\n\nAPI_BASE: {API_BASE}
                </div>
            )}

            {sections.map((s) => (
                <div key={s.id}>
                    <div className="sectionTitle">
                        <span>{s.icon}</span>
                        <span>{s.title}</span>
                    </div>

                    <GameCarousel games={s.games} onSelect={(game) => nav(`/game/${game.id}`)} />
                </div>
            ))}
        </div>
    );
}
