import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { message } from "antd";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully!");
    navigate("/");
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{ width: "20%", padding: "10px", backgroundColor: "#f0f0f0" }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <NavLink to="/">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/transaction">Transaction</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/expense">Expense</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/income">Income</NavLink>
            </li>
          </ul>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
