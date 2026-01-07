// src/components/SplashScreen.jsx
export default function SplashScreen({ phase = "spinning", winEmoji = "💎" }) {
    const isWin = phase === "win";

    return (
        <div className="splashRoot" role="status" aria-label="Loading">
            <div className={`splashCard ${isWin ? "splashCardWin" : ""}`}>
                <div className="splashBrand">
                    <div className="splashLogo">
                        <div className={`splashReels ${isWin ? "splashReelsWin" : ""}`}>
                            <div className="reel">
                                <div className={`reelTrack ${isWin ? "reelTrackFreeze" : ""}`}>
                                    {isWin ? (
                                        <>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🍒</span>
                                            <span>🔔</span>
                                            <span>💎</span>
                                            <span>7</span>
                                            <span>🍋</span>
                                            <span>🎁</span>
                                            <span>🍒</span>
                                            <span>🔔</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="reel">
                                <div
                                    className={`reelTrack reelTrack2 ${isWin ? "reelTrackFreeze" : ""}`}
                                >
                                    {isWin ? (
                                        <>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>💎</span>
                                            <span>7</span>
                                            <span>🍋</span>
                                            <span>🔔</span>
                                            <span>🎁</span>
                                            <span>🍒</span>
                                            <span>💎</span>
                                            <span>7</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="reel">
                                <div
                                    className={`reelTrack reelTrack3 ${isWin ? "reelTrackFreeze" : ""}`}
                                >
                                    {isWin ? (
                                        <>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                            <span className="reelWinSymbol">{winEmoji}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🍋</span>
                                            <span>🍒</span>
                                            <span>7</span>
                                            <span>💎</span>
                                            <span>🎁</span>
                                            <span>🔔</span>
                                            <span>🍋</span>
                                            <span>🍒</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="splashTitle">FreakSlots</div>
                    <div className="splashSubtitle">
                        {isWin ? "Ready" : "Loading games"}
                    </div>
                </div>

                <div className="splashProgress">
                    <div className={`splashBar ${isWin ? "splashBarWin" : ""}`} />
                </div>
            </div>
        </div>
    );
}
