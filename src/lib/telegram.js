// src/lib/telegram.js
import { ensureGeo } from "./geo";

export function initTelegramUi() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready?.();
    tg.expand?.();

    try {
        tg.requestFullscreen?.();
    } catch {
        // ignore
    }

    // Option 2: automatic geo on app open (IP-based)
    // Do not block UI. Just fire and forget.
    ensureGeo();
}
