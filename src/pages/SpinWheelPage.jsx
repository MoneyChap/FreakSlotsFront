import { useEffect, useMemo, useRef, useState } from "react";
import { ensureGeo, readSavedGeo } from "../lib/geo.js";
import { getVisibleCasinosForCountry } from "../data/casinosData.js";

const STORAGE_NEXT_SPIN = "freakslots_wheel_next_spin_at_v1";
const COOLDOWN_MS = 12 * 60 * 60 * 1000;

const CARD_WIDTH = 220;
const CARD_GAP = 12;

function openTgLink(url) {
    const tg = window.Telegram?.WebApp;
    if (tg?.openLink) {
        tg.openLink(url);
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}

function readNextSpinAt() {
    try {
        const raw = localStorage.getItem(STORAGE_NEXT_SPIN);
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
    } catch {
        return 0;
    }
}

function writeNextSpinAt(ts) {
    try {
        localStorage.setItem(STORAGE_NEXT_SPIN, String(ts));
    } catch {
        // ignore
    }
}

function formatRemaining(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const hh = String(Math.floor(total / 3600)).padStart(2, "0");
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

function bonusText(casino) {
    const title = String(casino?.bonusTitle || "").trim();
    const details = String(casino?.bonusDetails || "").trim();
    return details ? `${title} ${details}` : title;
}

function fireTickHaptic() {
    const tgHaptic = window.Telegram?.WebApp?.HapticFeedback;
    if (tgHaptic?.impactOccurred) {
        tgHaptic.impactOccurred("light");
        return;
    }
    if (navigator.vibrate) navigator.vibrate(10);
}

function getTranslateX(node) {
    if (!node) return 0;
    const t = window.getComputedStyle(node).transform;
    if (!t || t === "none") return 0;
    try {
        return new DOMMatrixReadOnly(t).m41 || 0;
    } catch {
        return 0;
    }
}

export default function SpinWheelPage() {
    const viewportRef = useRef(null);
    const finishTimerRef = useRef(null);
    const trackRef = useRef(null);
    const hapticRafRef = useRef(null);
    const spinActiveRef = useRef(false);
    const lastTickIndexRef = useRef(null);
    const lastTickAtRef = useRef(0);

    const [countryCode, setCountryCode] = useState("");
    const [now, setNow] = useState(Date.now());
    const [nextSpinAt, setNextSpinAt] = useState(() => readNextSpinAt());

    const [trackItems, setTrackItems] = useState([]);
    const [trackX, setTrackX] = useState(0);
    const [animateTrack, setAnimateTrack] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [viewportWidth, setViewportWidth] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

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

    useEffect(() => {
        function measure() {
            const w = viewportRef.current?.clientWidth || 0;
            setViewportWidth(w);
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        return () => {
            if (finishTimerRef.current) {
                clearTimeout(finishTimerRef.current);
                finishTimerRef.current = null;
                spinActiveRef.current = false;
                if (hapticRafRef.current) {
                    cancelAnimationFrame(hapticRafRef.current);
                    hapticRafRef.current = null;
                }
            }
        };
    }, []);

    const offers = useMemo(
        () => getVisibleCasinosForCountry(countryCode),
        [countryCode]
    );

    useEffect(() => {
        if (!offers.length) {
            setTrackItems([]);
            return;
        }
        const initialRepeats = 6;
        setTrackItems(
            Array.from(
                { length: offers.length * initialRepeats },
                (_, i) => offers[i % offers.length]
            )
        );
        setTrackX(0);
        setAnimateTrack(false);
    }, [offers]);

    const cooldownMs = Math.max(0, nextSpinAt - now);
    const canSpin = offers.length > 0 && cooldownMs === 0 && !isSpinning;
    const showCooldown = !isSpinning && cooldownMs > 0;
    const showSpinButton = isSpinning || cooldownMs === 0;

    function startHapticTickLoop(viewW) {
        const step = CARD_WIDTH + CARD_GAP;
        const pointerX = viewW / 2;

        const tick = () => {
            if (!spinActiveRef.current) return;

            const tx = getTranslateX(trackRef.current);
            const idx = Math.floor((pointerX - tx - CARD_WIDTH / 2) / step);
            const nowTs = performance.now();

            if (lastTickIndexRef.current === null) {
                lastTickIndexRef.current = idx;
            } else if (idx !== lastTickIndexRef.current && nowTs - lastTickAtRef.current > 55) {
                lastTickIndexRef.current = idx;
                lastTickAtRef.current = nowTs;
                fireTickHaptic();
            }

            hapticRafRef.current = requestAnimationFrame(tick);
        };

        hapticRafRef.current = requestAnimationFrame(tick);
    }


    function handleSpin() {
        if (!canSpin || !viewportWidth) return;

        const winnerIndex = Math.floor(Math.random() * offers.length);
        const loops = 10 + Math.floor(Math.random() * 3);
        const totalSpots = (loops + 3) * offers.length;
        const selectedWinner = offers[winnerIndex];

        const longTrack = Array.from(
            { length: totalSpots },
            (_, i) => offers[i % offers.length]
        );

        setWinner(null);
        setIsSpinning(true);
        setAnimateTrack(false);
        setTrackItems(longTrack);
        setTrackX(0);
        spinActiveRef.current = true;
        lastTickIndexRef.current = null;
        lastTickAtRef.current = 0;

        const targetFlatIndex = loops * offers.length + winnerIndex;
        const centerOffset = (viewportWidth - CARD_WIDTH) / 2;
        const destinationX = -(targetFlatIndex * (CARD_WIDTH + CARD_GAP) - centerOffset);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setAnimateTrack(true);
                setTrackX(destinationX);
                startHapticTickLoop(viewportWidth);
            });
        });

        const nextAt = Date.now() + COOLDOWN_MS;
        setNextSpinAt(nextAt);
        writeNextSpinAt(nextAt);

        if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
        finishTimerRef.current = setTimeout(() => {
            setIsSpinning(false);
            setWinner(selectedWinner || null);
            spinActiveRef.current = false;
            if (hapticRafRef.current) {
                cancelAnimationFrame(hapticRafRef.current);
                hapticRafRef.current = null;
            }
        }, 4800);

    }


    return (
        <div className="page wheelPage">
            <div className="wheelHero">
                <div className="wheelHeroTitle">Spin The Wheel</div>
                <div className="wheelHeroSubtitle">
                    Spin once every 12 hours and win a casino bonus
                </div>
                <div className="wheelCount">{offers.length} prizes available</div>
            </div>

            <div className={`wheelWinnerWrap ${winner ? "isVisible" : ""}`}>
                {winner ? (
                    <div className="wheelWinnerCard wheelWinnerCardIn">
                        <div className="wheelWinnerLabel">Congratulations</div>
                        <div className="wheelWinnerLogoWrap">
                            <img
                                src={winner.heroUrl}
                                alt={winner.name}
                                className="wheelWinnerLogo"
                            />
                        </div>
                        <div className="wheelWinnerText">{bonusText(winner)}</div>
                        <button
                            type="button"
                            className="wheelClaimBtn"
                            onClick={() => openTgLink(winner.playUrl)}
                        >
                            Claim Your Bonuss
                        </button>
                    </div>
                ) : null}
            </div>


            <div className="wheelViewport" ref={viewportRef}>
                <div className="wheelPointer">
                    <span />
                </div>
                <div
                    className="wheelTrack"
                    ref={trackRef}
                    style={{
                        transform: `translate3d(${trackX}px, 0, 0)`,
                        transition: animateTrack
                            ? "transform 4800ms cubic-bezier(0.08, 0.72, 0.12, 1)"
                            : "none",
                    }}
                >
                    {trackItems.map((c, i) => (
                        <div className="wheelOfferCard" key={`${c.id}-${i}`}>
                            <img src={c.heroUrl} alt={c.name} className="wheelOfferLogo" />
                            <div className="wheelOfferName">{c.name}</div>
                            <div className="wheelOfferBonus">{bonusText(c)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {showCooldown ? (
                <div className="wheelCooldown">
                    Next spin available in {formatRemaining(cooldownMs)}
                </div>
            ) : null}

            {showSpinButton ? (
                <button
                    type="button"
                    className="wheelSpinBtn"
                    onClick={handleSpin}
                    disabled={!canSpin}
                >
                    {isSpinning ? "Spinning..." : "Spin The Wheel"}
                </button>
            ) : null}


            <div className="wheelPrizesTitle">Possible Prizes</div>
            <div className="wheelPrizesGrid">
                {offers.map((c) => (
                    <div className="wheelPrizeCard" key={c.id}>
                        <img src={c.heroUrl} alt={c.name} className="wheelPrizeLogo" />
                        <div className="wheelPrizeName">{c.name}</div>
                        <div className="wheelPrizeBonus">{bonusText(c)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
