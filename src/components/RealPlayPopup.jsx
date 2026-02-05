import { useEffect, useMemo, useState } from "react";
import { getVisibleCasinosForCountry } from "../data/casinosData.js";

function openTgLink(url) {
    const tg = window.Telegram?.WebApp;
    if (tg?.openLink) {
        tg.openLink(url);
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}

function parseBonusText(title = "", details = "") {
    const t = String(title || "").trim();
    const d = String(details || "").trim();

    const percentMatch = t.match(/(\d{1,4})\s*%/);
    const percent = percentMatch ? `${percentMatch[1]}%` : "";

    const spinsMatch = t.match(/(\d{1,4})\s*(FS|FD)\b/i);
    const spins = spinsMatch ? `${spinsMatch[1]} ${spinsMatch[2].toUpperCase()}` : "";

    const prefixAmountMatch = t.match(/([€$£₹₺])\s*([\d][\d.,\s]*)/);
    const suffixAmountMatch = t.match(/([\d][\d.,\s]*)\s*([€$£₹₺])/);

    let amount = "";
    if (prefixAmountMatch) amount = `${prefixAmountMatch[1]}${prefixAmountMatch[2].trim()}`;
    else if (suffixAmountMatch) amount = `${suffixAmountMatch[1].trim()} ${suffixAmountMatch[2]}`;

    let tagline = d;
    if (!tagline) {
        tagline = t
            .replace(/([€$£₹₺])\s*[\d][\d.,\s]*/g, "")
            .replace(/[\d][\d.,\s]*\s*([€$£₹₺])/g, "")
            .replace(/\d{1,4}\s*(FS|FD)\b/gi, "")
            .replace(/\d{1,4}\s*%/g, "")
            .replace(/\s*\+\s*/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim();
    }

    return { amount, spins, percent, tagline };
}

function normalizeMetricsFromCasino(c) {
    if (c?.bonusMetrics && typeof c.bonusMetrics === "object") {
        const amount = String(c.bonusMetrics.amount || "").trim();
        const spins = String(c.bonusMetrics.spins || "").trim();
        const percent = String(c.bonusMetrics.percent || "").trim();
        const tagline = String(c.bonusMetrics.tagline || c.bonusDetails || "").trim();
        return { amount, spins, percent, tagline };
    }

    return parseBonusText(c?.bonusTitle || "", c?.bonusDetails || "");
}

function pickBadgePrimary(metrics) {
    if (metrics.percent) return metrics.percent;
    if (metrics.amount) return metrics.amount;
    return "";
}

export default function RealPlayPopup({ open, onClose, countryCode }) {
    const [closing, setClosing] = useState(false);
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        if (!open) {
            setVisible(false);
            return;
        }
        setClosing(false);
        // next tick so CSS can transition from hidden -> visible
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, [open]);

    const casinos = useMemo(
        () => getVisibleCasinosForCountry(countryCode).slice(0, 3),
        [countryCode]
    );

    if (!open && !closing) return null;

    const handleClose = () => {
        setClosing(true);
        setVisible(false);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 220);
    };

    return (
        <div className={`realPlayPopupOverlay ${open && visible ? "isOpen" : ""} ${closing ? "isClosing" : ""}`}
            role="dialog"
            aria-modal="true"
        >
            <div className="realPlayPopup">
                <div className="realPlayPopupTitle">Ready To Play For Real?</div>

                <div className="realPlayPopupList">
                    {casinos.map((c, idx) => {
                        const metrics = normalizeMetricsFromCasino(c);
                        const badgePrimary = pickBadgePrimary(metrics);
                        const badgeSecondary = metrics.spins || "";

                        return (
                            <div key={c.id} className="realPlayPopupCard">

                                <div className="realPlayPopupLogo">
                                    <img src={c.heroUrl} alt={c.name} />
                                </div>

                                <div className="realPlayPopupInfo">
                                    <div className="realPlayPopupTop">
                                        <div className="realPlayPopupName">{c.name}</div>
                                        <div className="realPlayPopupRating">
                                            <span className="realPlayPopupStar">★</span>
                                            <span>{Number(c.rating).toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="realPlayPopupBadges">
                                        {badgePrimary ? (
                                            <span className="realPlayPopupBadge badgeGold">{badgePrimary}</span>
                                        ) : null}
                                        {badgeSecondary ? (
                                            <span className="realPlayPopupBadge badgeRed">{badgeSecondary}</span>
                                        ) : null}
                                    </div>

                                    {metrics.tagline ? (
                                        <div className="realPlayPopupTagline">
                                            {c.bonusTitle}
                                            {c.bonusDetails ? ` • ${c.bonusDetails}` : ""}
                                        </div>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    className="realPlayPopupPlay"
                                    onClick={() => openTgLink(c.playUrl)}
                                >
                                    Play
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button type="button" className="realPlayPopupClose" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
