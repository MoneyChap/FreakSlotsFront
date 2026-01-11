import GameCard from "./GameCard";

function formatRtp(rtp) {
    if (typeof rtp !== "number" || Number.isNaN(rtp)) return null;
    return Number.isInteger(rtp) ? `${rtp}%` : `${rtp.toFixed(1)}%`;
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

export default function GameCarouselNative({ games, sectionId, onPlay }) {
    return (
        <div className="nativeCarousel" role="region" aria-label="Games carousel">
            <div className="nativeTrack">
                {games.map((g) => {
                    const { text, variant } = getBadge(sectionId, g);

                    return (
                        <div key={g.id} className="nativeSlide">
                            <GameCard
                                game={g}
                                badgeText={text}
                                badgeVariant={variant}
                                onPlay={onPlay}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
