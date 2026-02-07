import { useCallback, useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
  useMatch,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import CasinosPage from "./pages/CasinosPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SpinWheelPage from "./pages/SpinWheelPage.jsx";


import BottomNav from "./components/BottomNav.jsx";
import SplashScreen from "./components/SplashScreen.jsx";

import { initTelegramUi } from "./lib/telegram.js";
import { warmHomeCache } from "./lib/homeCache.js";

function TelegramBackButtonController() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  const onBack = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    tg.BackButton.offClick(onBack);

    if (!isHome) {
      tg.BackButton.show();
      tg.BackButton.onClick(onBack);
    } else {
      tg.BackButton.hide();
    }

    return () => tg.BackButton.offClick(onBack);
  }, [isHome, onBack]);

  return null;
}

export function AppLayout() {
  const isGamePage = useMatch("/game/:id");
  const isWheelPage = useMatch("/wheel");
  const isDetailPage = Boolean(isGamePage || isWheelPage);

  return (
    <>
      <TelegramBackButtonController />
      <Outlet />
      {!isDetailPage && <BottomNav />}
    </>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem("freakslots_splash_seen_v1") !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    initTelegramUi();

    // Always warm the cache (even if splash is not shown)
    const warmPromise = warmHomeCache();

    if (!showSplash) return;

    let cancelled = false;
    const start = Date.now();

    const MIN_MS = 700;   // keep a short “nice” splash
    const MAX_MS = 2000;  // hard cap: must disappear by itself

    const finish = () => {
      if (cancelled) return;

      try {
        sessionStorage.setItem("freakslots_splash_seen_v1", "1");
      } catch {
        // ignore
      }

      setShowSplash(false);
    };

    // Hard stop no matter what
    const hardTimer = setTimeout(finish, MAX_MS);

    // Hide after warm completes, but never earlier than MIN_MS
    warmPromise.finally(() => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      setTimeout(finish, wait);
    });

    return () => {
      cancelled = true;
      clearTimeout(hardTimer);
    };
  }, [showSplash]);

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
              <Route path="/wheel" element={<SpinWheelPage />} />
            </Route>
          </Routes>
        </HashRouter>

        {showSplash ? <SplashScreen /> : null}
      </div>
    </div>
  );
}
