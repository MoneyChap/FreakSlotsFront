// GameCarousel.jsx
import { useEffect, useRef } from "react";
import GameCard from "./GameCard";

function formatRtp(rtp) {
    if (typeof rtp !== "number" || Number.isNaN(rtp)) return null;
    const text = Number.isInteger(rtp) ? `${rtp}%` : `${rtp.toFixed(1)}%`;
    return text;
}

function getBadge(sectionId, game) {
    if (sectionId === "exclusive") return { text: "HOT", variant: "exclusive" };
    if (sectionId === "best") return { text: "TOP", variant: "best" };
    if (sectionId === "new") return { text: "NEW", variant: "new" };
    if (sectionId === "rtp97") {
        const r = formatRtp(game.rtp);
        return { text: r ? `RTP ${r}` : "RTP", variant: "rtp97" };
    }
    return { text: null, variant: "exclusive" };
}

// Stops ongoing momentum on iOS/Android when user touches the scroller.
// This prevents the small “reverse nudge” you saw with JS-based carousels.
function stopNativeMomentum(el) {
    if (!el) return;
    const x = el.scrollLeft;

    // Force browser to “commit” the current position and stop inertia.
    el.scrollLeft = x;

    // Some devices need a second tick.
    requestAnimationFrame(() => {
        el.scrollLeft = x;
    });
}

export default function GameCarousel({ games, sectionId, onPlay }) {
    const scrollerRef = useRef(null);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const onTouchStart = () => stopNativeMomentum(el);
        const onPointerDown = (e) => {
            // Only for touch/pen to avoid breaking mouse wheel momentum on desktop.
            if (e.pointerType === "touch" || e.pointerType === "pen") stopNativeMomentum(el);
        };

        // passive true keeps scroll smooth
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("pointerdown", onPointerDown, { passive: true });

        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("pointerdown", onPointerDown);
        };
    }, []);

    return (
        <div className="gameCarouselNative" ref={scrollerRef}>
            <div className="gameCarouselTrack">
                {games.map((g) => {
                    const { text, variant } = getBadge(sectionId, g);
                    return (
                        <div className="gameCarouselItem" key={g.id}>
                            <GameCard game={g} badgeText={text} badgeVariant={variant} onPlay={onPlay} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
