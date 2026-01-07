import { useCallback, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import { initTelegramUi } from "./lib/telegram.js";

function TelegramBackButtonController() {
  const navigate = useNavigate();
  const isGamePage = useMatch("/game/:id");

  const onBack = useCallback(() => {
    // If you want “back to home” always:
    navigate("/", { replace: true });

    // If you want real history back instead, use:
    // navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // If this is falsy in Telegram, the SDK is not initialized/loaded correctly.
    if (!tg?.BackButton) return;

    // Remove our handler first (important when effects re-run)
    tg.BackButton.offClick(onBack);

    if (isGamePage) {
      tg.BackButton.show();      // This is what changes X -> back arrow in Telegram header
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
  useEffect(() => {
    initTelegramUi();
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
      </div>
    </div>
  );
}
