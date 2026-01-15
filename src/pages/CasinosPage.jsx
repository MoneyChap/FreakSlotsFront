import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useImageGlow } from "../lib/useImageGlow.js";
import { getVisibleCasinosForCountry } from "../data/casinosData.js";
import "swiper/css";
import "swiper/css/pagination";

const API_BASE = import.meta.env.VITE_API_BASE;

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
    const [countryCode, setCountryCode] = useState("");
    const [geoLabel, setGeoLabel] = useState("");

    // No caching: always detect GEO on every app open (page mount)
    useEffect(() => {
        let cancelled = false;

        async function loadGeo() {
            try {
                const res = await fetch(`${API_BASE}/api/geo`, { cache: "no-store" });
                if (!res.ok) return;

                const data = await res.json();
                const cc = String(data?.countryCode || "").toUpperCase();
                if (!cc) return;

                if (cancelled) return;
                setCountryCode(cc);
                setGeoLabel(String(data?.label || ""));
            } catch {
                // ignore
            }
        }

        loadGeo();

        return () => {
            cancelled = true;
        };
    }, []);

    // New implementation: pass countryCode only — casinosData handles:
    // - GEO filtering
    // - affiliate link selection
    // - bonus selection + currency conversion (EU/EUR, TR/TRY, IN/INR, else USD)
    const casinos = useMemo(() => getVisibleCasinosForCountry(countryCode), [countryCode]);

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

    return (
        <div className="page" style={{ paddingLeft: 10, paddingRight: 10 }}>
            <div className="casinosHeroZone">
                <div className="casinosHeroContent">
                    <h1 className="casinosHeroTitle">Top Casinos</h1>

                    <p className="casinosHeroSubtitle">
                        Exclusive bonuses • Fast payouts • Trusted brands
                    </p>
                </div>
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
                                {c.bonusDetails ? (
                                    <div className="casinoBonusDetails">{c.bonusDetails}</div>
                                ) : null}
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
                                disabled={!c.playUrl}
                                title={!c.playUrl ? "Link unavailable" : undefined}
                            >
                                Play
                            </button>
                        </div>
                    </div>
                ))}

                {!casinos.length ? (
                    <div style={{ opacity: 0.7, padding: "10px 2px", fontSize: 13 }}>
                        No casinos available for this country.
                    </div>
                ) : null}
            </div>
        </div>
    );
}
