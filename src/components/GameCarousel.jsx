import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import GameCard from "./GameCard";

function formatRtp(rtp) {
    if (typeof rtp !== "number" || Number.isNaN(rtp)) return null;
    // show 1 decimal if not an integer
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

export default function GameCarousel({ games, sectionId, onPlay }) {
    return (
        <Swiper
            className="gameCarousel"
            style={{paddingTop: 5}}
            slidesPerView="auto"
            spaceBetween={14}
            // feel
            modules={[FreeMode]}
            freeMode={{
                enabled: true,
                sticky: false,          // IMPORTANT: no snapping
                momentum: true,
                momentumRatio: 1.05,    // a bit more glide
                momentumBounce: false,  // IMPORTANT: removes reverse “bounce”
                minimumVelocity: 0.02,
            }}
            // stop the “reverse nudge”
            resistance={false}
            resistanceRatio={0}
            // touch behavior
            followFinger={true}
            threshold={2}                  // makes it responsive but not twitchy
            touchStartPreventDefault={false}
            touchMoveStopPropagation={true}
            preventClicks={true}
            preventClicksPropagation={true}
            // stability
            watchSlidesProgress
            observer
            observeParents
            passiveListeners
            // keep default speed irrelevant in freeMode, but harmless
            speed={0}
        >
            {games.map((g) => {
                const { text, variant } = getBadge(sectionId, g);

                return (
                    <SwiperSlide key={g.id} style={{ width: 220 }}>
                        <GameCard
                            game={g}
                            badgeText={text}
                            badgeVariant={variant}
                            onPlay={onPlay}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
