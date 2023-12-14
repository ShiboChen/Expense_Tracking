import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Transaction from "./components/Transaction";
import Income from "./components/Income";
import Expense from "./components/Expense";
import Home from "./components/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/transaction" element={<Transaction />} />
          <Route path="/dashboard/expense" element={<Expense />} />
          <Route path="/dashboard/income" element={<Income />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
