import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import GameCard from "./GameCard";

export default function GameCarousel({ games, onSelect }) {
    return (
        <Swiper
            spaceBetween={12}
            slidesPerView={"auto"}
            style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 2 }}
        >
            {games.map((g) => (
                <SwiperSlide key={g.id} style={{ width: 150 }}>
                    <GameCard game={g} onClick={() => onSelect(g)} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
