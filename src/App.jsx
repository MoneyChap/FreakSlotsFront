import { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import { initTelegramUi } from "./lib/telegram.js";

function TelegramBackButtonController() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    const onBack = () => nav("/");

    if (pathname.startsWith("/game/")) {
      tg.BackButton.show();
      tg.BackButton.offClick(onBack);
      tg.BackButton.onClick(onBack);
    } else {
      tg.BackButton.offClick(onBack);
      tg.BackButton.hide();
    }

    return () => {
      tg.BackButton.offClick(onBack);
    };
  }, [pathname, nav]);

  return null;
}

function AppLayout() {
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
