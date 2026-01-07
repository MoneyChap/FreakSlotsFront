import { useCallback, useEffect, useState } from "react";
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

    // Warm cache on app open
    warmHomeCache();

    // Show splash once per session
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("freakslots_splash_seen_v1", "1");
      } catch {
        // ignore
      }
      setShowSplash(false);
    }, 900);

    return () => clearTimeout(t);
  }, []);

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

        {showSplash ? <SplashScreen /> : null}
      </div>
    </div>
  );
}
