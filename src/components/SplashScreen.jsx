// src/components/SplashScreen.jsx
function pick(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

const SPIN_POOL = ["🍒", "🔔", "💎", "7", "🍋", "🎁"];

function Reel({ state, winEmoji, seed = 0 }) {
    const isSpinning = state === "spinning";
    const isStopped = state === "stop";

    // When stopped: only the CENTER symbol is the win emoji.
    // Top and bottom are random (but stable per mount).
    const top = pick(["🍒", "🔔", "🍋", "🎁", "💎", "7"]);
    const mid = winEmoji;
    const bot = pick(["🍒", "🔔", "🍋", "🎁", "💎", "7"]);

    return (
        <div className="reel">
            <div className={`reelWindow ${isStopped ? "reelWindowStop" : ""}`}>
                {isSpinning ? (
                    <div className={`reelTrack reelSpin${seed}`}>
                        <span>🍒</span>
                        <span>🔔</span>
                        <span>💎</span>
                        <span>7</span>
                        <span>🍋</span>
                        <span>🎁</span>
                        <span>🍒</span>
                        <span>🔔</span>
                        <span>💎</span>
                        <span>7</span>
                        <span>🍋</span>
                        <span>🎁</span>
                    </div>
                ) : (
                    <div className="reelStopStack">
                        <span className="reelSymbol">{top}</span>
                        <span className="reelSymbol reelSymbolMid">{mid}</span>
                        <span className="reelSymbol">{bot}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * phase:
 * - "spinning"
 * - "stop1" (only reel 1 stopped)
 * - "stop2" (reels 1-2 stopped)
 * - "stop3" (reels 1-3 stopped, ready to pop)
 */
export default function SplashScreen({ phase = "spinning", winEmoji = "💎" }) {
    const r1 = phase === "spinning" ? "spinning" : "stop";
    const r2 = phase === "stop1" || phase === "spinning" ? "spinning" : "stop";
    const r3 = phase === "stop3" ? "stop" : "spinning";

    const isWin = phase === "stop3";

    return (
        <div className="splashRoot" role="status" aria-label="Loading">
            <div className={`splashCard ${isWin ? "splashCardWin" : ""}`}>
                <div className="splashBrand">
                    <div className="splashLogo">
                        <div className={`splashReels ${isWin ? "splashReelsWin" : ""}`}>
                            <Reel state={r1} winEmoji={winEmoji} seed={1} />
                            <Reel state={r2} winEmoji={winEmoji} seed={2} />
                            <Reel state={r3} winEmoji={winEmoji} seed={3} />

                            {/* Middle-line overlay and pop */}
                            <div className={`payline ${isWin ? "paylineWin" : ""}`} />
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
