import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import { initTelegramUi } from "./lib/telegram.js";

export default function App() {
  useEffect(() => {
    initTelegramUi();
  }, []);

  return (
    <div className="appRoot">
      <div className="appFrame">
        HELLO WORLD
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
