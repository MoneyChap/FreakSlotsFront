// src/components/SplashScreen.jsx
export default function SplashScreen() {
    return (
        <div className="splashRoot" role="status" aria-label="Loading">
            <div className="splashCard">
                <div className="splashBrand">
                    <div className="splashLogo">
                        <div className="splashReels">
                            <div className="reel">
                                <div className="reelTrack">
                                    <span>🍒</span>
                                    <span>🔔</span>
                                    <span>💎</span>
                                    <span>7</span>
                                    <span>🍒</span>
                                    <span>🔔</span>
                                </div>
                            </div>

                            <div className="reel">
                                <div className="reelTrack reelTrack2">
                                    <span>💎</span>
                                    <span>7</span>
                                    <span>🍋</span>
                                    <span>🔔</span>
                                    <span>💎</span>
                                    <span>7</span>
                                </div>
                            </div>

                            <div className="reel">
                                <div className="reelTrack reelTrack3">
                                    <span>🍋</span>
                                    <span>🍒</span>
                                    <span>7</span>
                                    <span>💎</span>
                                    <span>🍋</span>
                                    <span>🍒</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="splashTitle">FreakSlots</div>
                    <div className="splashSubtitle">Loading games</div>
                </div>

                <div className="splashProgress">
                    <div className="splashBar" />
                </div>
            </div>
        </div>
    );
}
