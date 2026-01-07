export function initTelegramUi() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready?.();
    tg.expand?.();

    // Request fullscreen (Telegram Bot API 8.0+ clients)
    try {
        tg.requestFullscreen?.();
    } catch (e) {
        // ignore; some clients/versions may not support it
    }
}