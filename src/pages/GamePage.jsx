import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ensureGeo, readSavedGeo } from "../lib/geo.js";
import RealPlayPopup from "../components/RealPlayPopup.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function GamePage() {
    const nav = useNavigate();
    const { id } = useParams();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeFailed, setIframeFailed] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const [promoDismissed, setPromoDismissed] = useState(false);
    const [countryCode, setCountryCode] = useState("");

    // Load game from backend by id
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/games/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) setGame(data);
            } catch (e) {
                if (!cancelled) setGame(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        const saved = readSavedGeo();
        const cc = String(saved?.countryCode || "").toUpperCase();
        if (cc) {
            setCountryCode(cc);
            return;
        }

        let cancelled = false;
        ensureGeo().then((payload) => {
            if (cancelled) return;
            const next = String(payload?.countryCode || "").toUpperCase();
            if (next) setCountryCode(next);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // When game changes, reset iframe state
    useEffect(() => {
        setIframeFailed(false);
        setIframeLoading(true);
    }, [game?.demoUrl]);

    useEffect(() => {
        if (loading || !game) return;
        setShowPromo(false);
        setPromoDismissed(false);

        const timer = setTimeout(() => {
            setShowPromo(true);
        }, 60_000);

        return () => clearTimeout(timer);
    }, [game?.id, loading]);

    if (loading) {
        return (
            <div className="gamePage">
                <div className="gameTopbar">
                    <Link to={"/casinos"} >
                        <button className="realPlayBtn">
                            <span className="realPlayLabel">Play Real Slots 🎰</span>
                        </button>
                    </Link>
                </div>
                <div style={{ padding: 12, opacity: 0.7 }}>Loading…</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="gamePage">
                <div className="gameTopbar">
                    <Link to={"/casinos"} >
                        <button className="realPlayBtn">
                            <span className="realPlayLabel">Play Real Slots 🎰</span>
                        </button>
                    </Link>
                </div>
                <div style={{ padding: 12, opacity: 0.7 }}>Game not found</div>
            </div>
        );
    }

    return (
        <div className="gamePage">
            <div className="gameTopbar">
                <Link to={"/casinos"} >
                    <button className="realPlayBtn">
                        <span className="realPlayLabel">Play Real Slots 🎰</span>
                    </button>
                </Link>
            </div>

            <div className="gameIframeArea">
                {iframeLoading && !iframeFailed && (
                    <div className="iframeOverlay">
                        <div style={{ opacity: 0.85, fontSize: 14 }}>Loading game…</div>
                    </div>
                )}

                {iframeFailed ? (
                    <div className="iframeFail">
                        <div style={{ fontSize: 16, marginBottom: 8 }}>
                            Game could not be loaded inside the mini-app.
                        </div>
                        <div style={{ opacity: 0.75, fontSize: 13, marginBottom: 12 }}>
                            Please open the demo in a browser window.
                        </div>
                        <a
                            href={game.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btnPrimary"
                            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                        >
                            Open demo
                        </a>
                    </div>
                ) : (
                    <iframe
                        className="gameIframe"
                        src={game.demoUrl}
                        title={game.name}
                        allow="autoplay; fullscreen"
                        onLoad={() => setIframeLoading(false)}
                        onError={() => {
                            setIframeLoading(false);
                            setIframeFailed(true);
                        }}
                    />
                )}
            </div>

            <RealPlayPopup
                open={showPromo && !promoDismissed}
                onClose={() => {
                    setShowPromo(false);
                    setPromoDismissed(true);
                }}
                countryCode={countryCode}
            />
        </div>
    );
}
