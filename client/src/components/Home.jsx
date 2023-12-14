import React, { useState, useEffect } from "react";
import { Card, Col, Row, message, Table } from "antd";
import axios from "axios";

const Home = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [totalValues, setTotalValues] = useState({
    sumPositive: 0,
    sumNegative: 0,
    overallSum: 0,
  });
  const [categoryExpense, setCategoryExpense] = useState([]);

  const categoryMapping = {
    1: "Salary",
    2: "Food & drink",
    3: "Bills",
    4: "Services",
    5: "Entertainment",
    6: "Shopping",
    7: "Travel",
    8: "Others",
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "category",
      render: (categoryID) => categoryMapping[categoryID],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const columns2 = [
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "categoryID",
      render: (categoryID) => categoryMapping[categoryID],
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "amount",
    },
  ];

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const { data } = await axios.post(
          "http://localhost:3001/getAllTransactions",
          {
            userId: user.userId,
          }
        );
        setTransactionData(data.transactions);
        if (Object.keys(data.total).length !== 0) {
          setTotalValues(data.total);
        }
        setCategoryExpense(data.categoryExpense);
      } catch (error) {
        message.error("Failed to fetch transactions!");
      }
    };
    getAllTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        {/* Top Section */}
        <Col span={24}>
          <Card title="Financial Overview">
            <p>Total Income: $ {totalValues.sumPositive}</p>
            <p>Total Expense: $ {totalValues.sumNegative}</p>
            <p>Your Balance: $ {totalValues.overallSum}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Left Section - Recent Transactions */}
        <Col span={12}>
          <Card title="Recent Transactions">
            <Table
              dataSource={transactionData}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>

        {/* Right Section - Expense by Category */}
        <Col span={12}>
          <Card title="Expense by Category">
            <Table
              dataSource={categoryExpense}
              columns={columns2}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
