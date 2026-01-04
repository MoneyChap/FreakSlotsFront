import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";

export default function App() {
  return (
    <div className="appRoot">
      <div className="appFrame">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
