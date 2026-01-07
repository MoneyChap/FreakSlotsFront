export function getTelegramUser() {
    const tg = window.Telegram?.WebApp;
    const u = tg?.initDataUnsafe?.user;

    if (!u) return null;

    const first = u.first_name || "";
    const last = u.last_name || "";
    const name = `${first} ${last}`.trim() || u.username || "User";

    return {
        id: u.id,
        name,
        username: u.username || "",
        photoUrl: u.photo_url || "",
        firstName: first,
        lastName: last,
    };
}
