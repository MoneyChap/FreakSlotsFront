import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function GamePage() {
    const nav = useNavigate();
    const { id } = useParams();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeFailed, setIframeFailed] = useState(false);

    // // Telegram BackButton support
    // useEffect(() => {
    //     const tg = window.Telegram?.WebApp;
    //     if (!tg?.BackButton) return;

    //     const onBack = () => window.location.hash = "#/"; // hard navigate, very reliable

    //     tg.BackButton.show();
    //     tg.BackButton.onClick(onBack);

    //     return () => {
    //         tg.BackButton.offClick(onBack);
    //         tg.BackButton.hide();
    //     };
    // }, []);

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

    // When game changes, reset iframe state
    useEffect(() => {
        setIframeFailed(false);
        setIframeLoading(true);
    }, [game?.demoUrl]);

    if (loading) {
        return (
            <div className="gamePage">
                <div className="gameTopbar">
                    <button className="btn btnPrimary" style={{ margin: "0 auto" }} disabled>
                        Play Real Slots
                    </button>
                    <div style={{ width: 60 }} />
                </div>
                <div style={{ padding: 12, opacity: 0.7 }}>Loading…</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="gamePage">
                <div className="gameTopbar">
                    <button className="btn btnPrimary" style={{ margin: "0 auto" }} disabled>
                        Play Real Slots
                    </button>
                    <div style={{ width: 60 }} />
                </div>
                <div style={{ padding: 12, opacity: 0.7 }}>Game not found</div>
            </div>
        );
    }

    return (
        <div className="gamePage">
            <div className="gameTopbar">
                <button className="realPlayBtn">
                    <span className="realPlayLabel">🎰 Play Real Slots 🎰</span>
                </button>
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
        </div>
    );
}
