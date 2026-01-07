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
import { initTelegramUi } from "./lib/telegram.js";
import SplashScreen from "./components/SplashScreen.jsx";
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
  return (
    <>
      <TelegramBackButtonController />
      <Outlet />
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

    // Warm cache on app open (so HomePage can render instantly from cache)
    warmHomeCache();

    // Hide splash after a short moment (also mark as seen for this session)
    // This avoids a “blank flash” during Telegram WebView initialization.
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
              <Route path="/game/:id" element={<GamePage />} />
            </Route>
          </Routes>
        </HashRouter>

        {showSplash ? <SplashScreen /> : null}
      </div>
    </div>
  );
}
