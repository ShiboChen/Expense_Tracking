import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

const Expense = () => {
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

  const [expenseData, setExpenseData] = useState([]);

  const handleDelete = async (record) => {
    try {
      console.log(record);
      await axios.post(`http://localhost:3001/deleteExpense`, { record });
      message.success("Transaction Deleted!");
      window.location.reload();
    } catch (error) {
      message.error(`unable to delete`);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "categoryID",
      render: (categoryID) => categoryMapping[categoryID],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              handleDelete(record);
            }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const { data } = await axios.post("http://localhost:3001/getExpense", {
          userId: user.userId,
        });
        setExpenseData(data.expenseData);
        console.log(data);
      } catch (error) {
        message.error("Failed to fetch transactions!");
      }
    };
    getAllTransactions();
  }, []);

  return <Table dataSource={expenseData} columns={columns} />;
};

export default Expense;
