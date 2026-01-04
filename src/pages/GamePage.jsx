import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sections } from "../data/mockGames";

export default function GamePage() {
    const nav = useNavigate();
    const { id } = useParams();

    const [launched, setLaunched] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(false);
    const [iframeFailed, setIframeFailed] = useState(false);

    const game = useMemo(() => {
        for (const s of sections) {
            const found = s.games.find((g) => g.id === id);
            if (found) return found;
        }
        return null;
    }, [id]);

    // Telegram BackButton support
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg?.BackButton) return;

        const goBack = () => nav("/");

        tg.BackButton.show();
        tg.BackButton.onClick(goBack);

        return () => {
            tg.BackButton.offClick(goBack);
            tg.BackButton.hide();
        };
    }, [nav]);

    // When launching, show loading until iframe onLoad fires
    const handleLaunch = () => {
        setIframeFailed(false);
        setIframeLoading(true);
        setLaunched(true);
    };

    if (!game) {
        return (
            <div className="page">
                <div className="gameHeader">
                    <button className="btn" onClick={() => nav("/")}>
                        Back
                    </button>
                    <div style={{ fontSize: 16 }}>Game not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="gameHeader">
                <button className="btn" onClick={() => nav("/")}>
                    Back
                </button>
                <div style={{ fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {game.name}
                </div>
            </div>

            {/* Preview card (before launch) */}
            {!launched ? (
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        padding: 8,
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: 92,
                            height: 92,
                            borderRadius: 18,
                            overflow: "hidden",
                            background: "#17181a",
                            flex: "0 0 auto",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <img
                            src={game.thumb}
                            alt={game.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 18, lineHeight: 1.15 }}>{game.name}</div>
                        <div style={{ opacity: 0.7, marginTop: 6, fontSize: 13 }}>
                            {game.provider}
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button className="btn btnPrimary" onClick={handleLaunch}>
                                Launch game
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 10 }}>
                    {/* If iframe failed, show fallback UI */}
                    {iframeFailed ? (
                        <div
                            style={{
                                padding: 14,
                                borderRadius: 18,
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "rgba(255,255,255,0.03)",
                            }}
                        >
                            <div style={{ fontSize: 16, marginBottom: 8 }}>
                                Demo could not be loaded inside the mini-app.
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

                            <button
                                className="btn"
                                onClick={() => {
                                    setLaunched(false);
                                    setIframeFailed(false);
                                    setIframeLoading(false);
                                }}
                                style={{ marginLeft: 10 }}
                            >
                                Back to preview
                            </button>
                        </div>
                    ) : (
                        <div className="iframeBox" style={{ position: "relative" }}>
                            {/* Loading overlay */}
                            {iframeLoading && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(0,0,0,0.35)",
                                        backdropFilter: "blur(6px)",
                                        zIndex: 2,
                                    }}
                                >
                                    <div style={{ opacity: 0.85, fontSize: 14 }}>Loading demo…</div>
                                </div>
                            )}

                            <iframe
                                src={game.demoUrl}
                                title={game.name}
                                allow="autoplay; fullscreen"
                                onLoad={() => setIframeLoading(false)}
                                onError={() => {
                                    setIframeLoading(false);
                                    setIframeFailed(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
