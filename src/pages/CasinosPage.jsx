import { useMemo } from "react";

// Temporary static list. We will replace this with geo-personalized affiliate data.
const CASINOS = [
    {
        id: "casino-1",
        name: "Example casino",
        bonus: "Up to 100% bonus",
        logoUrl: "https://placehold.co/96x96/png?text=C",
        link: "https://example.com",
    },
    {
        id: "casino-2",
        name: "Example casino two",
        bonus: "50 free spins",
        logoUrl: "https://placehold.co/96x96/png?text=C2",
        link: "https://example.com",
    },
];

export default function CasinosPage() {
    const casinos = useMemo(() => CASINOS, []);

    return (
        <div className="page">
            <div className="sectionTitle" style={{ marginTop: 6 }}>
                <span>🏛️</span>
                <span>Casinos</span>
            </div>

            <div className="casinosHint">
                Casino offers will be personalized for your location.
            </div>

            <div className="casinosList">
                {casinos.map((c) => (
                    <a
                        key={c.id}
                        className="casinoCard"
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img className="casinoLogo" src={c.logoUrl} alt={c.name} />
                        <div className="casinoBody">
                            <div className="casinoName">{c.name}</div>
                            <div className="casinoBonus">{c.bonus}</div>
                            <div className="casinoCta">Open casino</div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
