import { Swiper, SwiperSlide } from "swiper/react";
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
            spaceBetween={14}
            slidesPerView={"auto"}
            style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 6, paddingTop: 4 }}
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
