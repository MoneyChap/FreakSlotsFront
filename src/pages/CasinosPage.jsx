import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useImageGlow } from "../lib/useImageGlow.js";
import "swiper/css";
import "swiper/css/pagination";


function openTgLink(url) {
    const tg = window.Telegram?.WebApp;
    if (tg?.openLink) {
        tg.openLink(url);
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}

function Stars({ value }) {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const full = Math.floor(v);
    const half = v - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
        <span aria-label={`Rating ${v.toFixed(1)} out of 5`} title={`${v.toFixed(1)}/5`}>
            {"★".repeat(full)}
            {half ? "½" : ""}
            {"☆".repeat(empty)}
        </span>
    );
}

function PromoCard({ title, img, url }) {
    const glow = useImageGlow(img);

    return (
        <button
            type="button"
            className="promoCard promoCardFull promoCardGlow"
            style={{ "--promoGlow": glow }}
            onClick={() => openTgLink(url)}
            aria-label={title}
        >
            <img className="promoImg" src={img} alt={title} />
            <div className="promoGlow" />
        </button>
    );
}


export default function CasinosPage() {
    const promos = useMemo(
        () => [
            {
                id: "promo-1",
                title: "Vulkan Vegas",
                img: "/promos/vulkan.jpg",
                url: "https://example.com",
            },
            {
                id: "promo-2",
                title: "Royal Spin",
                img: "/promos/verde.jpg",
                url: "https://example.com",
            },
            {
                id: "promo-3",
                title: "Nova Casino",
                img: "/promos/gangsta.jpg",
                url: "https://example.com",
            },
        ],
        []
    );

    const casinos = useMemo(
        () => [
            {
                id: "melbet",
                name: "MELBET",
                heroUrl:
                    "logos/melbet.png",
                rating: 4.7,
                bonusTitle: "100% up to €500",
                bonusDetails: "Plus 200 free spins",
                tags: ["Fast payouts", "Mobile"],
                playUrl: "https://example.com",
                theme: "casinoThemeOrange",
            },
            {
                id: "hitnspin",
                name: "Hit'N'Spin",
                heroUrl:
                    "/logos/hitnspin.png",
                rating: 4.6,
                bonusTitle: "150 free spins",
                bonusDetails: "No deposit for new users",
                tags: ["No deposit", "Slots"],
                playUrl: "https://example.com",
                theme: "casinoThemeCyan",
            },
            {
                id: "verde-casino",
                name: "Verde Casino",
                heroUrl:
                    "/logos/verde.png",
                rating: 4.5,
                bonusTitle: "50% up to €300",
                bonusDetails: "Weekly cashback 10%",
                tags: ["Cashback", "Live"],
                playUrl: "https://example.com",
                theme: "casinoThemePurple",
            },
            {
                id: "mega-pari",
                name: "Mega Pari",
                heroUrl:
                    "/logos/megapari.png",
                rating: 4.4,
                bonusTitle: "20 free spins",
                bonusDetails: "Instant signup bonus",
                tags: ["Beginner friendly"],
                playUrl: "https://example.com",
                theme: "casinoThemeGold",
            },
            {
                id: "slotoro",
                name: "Slotoro",
                heroUrl:
                    "logos/slotoro.png",
                rating: 4.3,
                bonusTitle: "200% up to €1,000",
                bonusDetails: "VIP rewards available",
                tags: ["VIP", "High limits"],
                playUrl: "https://example.com",
                theme: "casinoThemeBlue",
            },
            {
                id: "1-win",
                name: "1Win",
                heroUrl:
                    "/logos/1win.png",
                rating: 4.3,
                bonusTitle: "200% up to €1,000",
                bonusDetails: "VIP rewards available",
                tags: ["VIP", "High limits"],
                playUrl: "https://example.com",
                theme: "casinoThemeBlue",
            },
            {
                id: "Vulkan",
                name: "Vulkan Spiele",
                heroUrl:
                    "/logos/vulkan.png",
                rating: 4.3,
                bonusTitle: "200% up to €1,000",
                bonusDetails: "VIP rewards available",
                tags: ["VIP", "High limits"],
                playUrl: "https://example.com",
                theme: "casinoThemeBlue",
            },
        ],
        []
    );

    return (
        <div className="page" style={{ paddingLeft: 10, paddingRight: 10 }}>
            <div className="sectionTitle" style={{ marginTop: 10 }}>
                <span>🎰</span>
                <span>Casinos</span>
            </div>

            <div className="promoCarousel promoCarouselFullBleed">
                <Swiper
                    className="promoSwiper"
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                >
                    {promos.map((p) => (
                        <SwiperSlide key={p.id}>
                            <PromoCard title={p.title} img={p.img} url={p.url} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="casinosGrid">
                {casinos.map((c) => (
                    <div key={c.id} className={`casinoCardV2 ${c.theme}`}>
                        <div className="casinoHero">
                            <img className="casinoHeroImg" src={c.heroUrl} alt={c.name} />
                            <div className="casinoHeroOverlay" />

                            <div className="casinoHeroTop">
                                <div className="casinoPill">
                                    <span className="casinoPillDot" />
                                    <span className="casinoPillText">Hot bonus</span>
                                </div>

                                <div className="casinoRating">
                                    <span className="casinoStars">
                                        <Stars value={c.rating} />
                                    </span>
                                    <span className="casinoRatingNum">{Number(c.rating).toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="casinoHeroTitle">{c.name}</div>
                        </div>

                        <div className="casinoInfo">
                            <div className="casinoBonusBlock">
                                <div className="casinoBonusTitle">{c.bonusTitle}</div>
                                <div className="casinoBonusDetails">{c.bonusDetails}</div>
                            </div>

                            {Array.isArray(c.tags) && c.tags.length ? (
                                <div className="casinoTags">
                                    {c.tags.slice(0, 3).map((t) => (
                                        <span key={t} className="casinoTag">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            <button
                                type="button"
                                className="casinoPlayBtn"
                                onClick={() => openTgLink(c.playUrl)}
                            >
                                Play
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
