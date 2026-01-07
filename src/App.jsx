import { useCallback, useEffect } from "react";
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
import { initTelegramUi } from "./lib/telegram.js";

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
              <Route path="/casinos" element={<CasinosPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/game/:id" element={<GamePage />} />
            </Route>
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
