import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useMatch,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import CasinosPage from "./pages/CasinosPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import BottomNav from "./components/BottomNav.jsx";
import SplashScreen from "./components/SplashScreen.jsx";

import { initTelegramUi } from "./lib/telegram.js";
import { warmHomeCache } from "./lib/homeCache.js";

function TelegramBackButtonController() {
  const navigate = useNavigate();
  const isGamePage = useMatch("/game/:id");

  const onBack = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    tg.BackButton.offClick(onBack);

    if (isGamePage) {
      tg.BackButton.show();
      tg.BackButton.onClick(onBack);
    } else {
      tg.BackButton.hide();
    }

    return () => tg.BackButton.offClick(onBack);
  }, [isGamePage, onBack]);

  return null;
}

export function AppLayout() {
  const isGamePage = useMatch("/game/:id");

  return (
    <>
      <TelegramBackButtonController />
      <Outlet />
      {!isGamePage && <BottomNav />}
    </>
  );
}

function pickRandomWinEmoji() {
  const pool = ["💎", "🍒", "7", "🔔", "🍋", "🎁"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function App() {
  const winEmoji = useMemo(() => pickRandomWinEmoji(), []);

  const [splashPhase, setSplashPhase] = useState(() => {
    try {
      return sessionStorage.getItem("freakslots_splash_seen_v1") === "1"
        ? "hidden"
        : "spinning";
    } catch {
      return "spinning";
    }
  });

  useEffect(() => {
    initTelegramUi();

    // Always warm cache (even if splash is hidden)
    const warmPromise = warmHomeCache();

    if (splashPhase === "hidden") return;

    const MIN_MS = 1700; // increase to ~2000 if you want
    const STOP_GAP_MS = 220; // delay between reel stops
    const POP_MS = 520; // how long the “win pop” stays visible

    let cancelled = false;

    (async () => {
      // Ensure splash stays for at least MIN_MS AND cache warmup runs in parallel
      await Promise.all([warmPromise, sleep(MIN_MS)]);
      if (cancelled) return;

      // Sequential reel stops
      setSplashPhase("stop1");
      await sleep(STOP_GAP_MS);
      if (cancelled) return;

      setSplashPhase("stop2");
      await sleep(STOP_GAP_MS);
      if (cancelled) return;

      setSplashPhase("stop3"); // this triggers payline + pop animation
      await sleep(POP_MS);
      if (cancelled) return;

      try {
        sessionStorage.setItem("freakslots_splash_seen_v1", "1");
      } catch {
        // ignore
      }
      setSplashPhase("hidden");
    })();

    return () => {
      cancelled = true;
    };
  }, [splashPhase]);

  return (
    <div className="appRoot">
      <div className="appFrame">
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/casinos" element={<CasinosPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/game/:id" element={<GamePage />} />
            </Route>
          </Routes>
        </HashRouter>

        {splashPhase !== "hidden" ? (
          <SplashScreen phase={splashPhase} winEmoji={winEmoji} />
        ) : null}
      </div>
    </div>
  );
}
