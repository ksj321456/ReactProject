import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import Portfolio from "./Portfolio";
import CoinTable from "./CoinTable";
import CoinChart from "./CoinChart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<CoinTable />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/chart" element={<CoinChart />} />
      </Routes>
    </Router>
  );
}

export default App;
