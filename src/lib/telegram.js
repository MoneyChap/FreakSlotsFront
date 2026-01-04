export function initTelegramUi() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.expand?.();
    tg.ready?.();

    // Optional: match Telegram theme colors
    // tg.setHeaderColor?.("secondary_bg_color");
}
