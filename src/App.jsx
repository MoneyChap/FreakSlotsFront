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
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
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

    if (splashPhase === "hidden") {
      // Still warm cache, but no splash
      warmHomeCache();
      return;
    }

    const MIN_MS = 1600; // set to 2000 if you want closer to 2 seconds
    const WIN_MS = 450;

    let cancelled = false;

    const minTimer = new Promise((resolve) => setTimeout(resolve, MIN_MS));

    (async () => {
      // run both in parallel
      await Promise.all([warmHomeCache(), minTimer]);

      if (cancelled) return;

      // show the “win alignment”
      setSplashPhase("win");

      setTimeout(() => {
        if (cancelled) return;
        try {
          sessionStorage.setItem("freakslots_splash_seen_v1", "1");
        } catch {
          // ignore
        }
        setSplashPhase("hidden");
      }, WIN_MS);
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
