import React, { useState } from "react";
import { Form, Input, message, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Transaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      await axios.post("http://localhost:3001/addTransaction", {
        ...formData,
        userId: user.userId,
      });
      setLoading(false);
      message.success("Transaction Added Successfully");
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };

  return (
    <div className="form-container">
      {loading && <Spinner />}
      <Form
        name="addTransactionForm"
        layout="vertical"
        onFinish={handleSubmit}
        className="custom-form"
      >
        <Form.Item label="Amount" name="amount">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="food">Food & drink</Select.Option>
            <Select.Option value="bill">Bills</Select.Option>
            <Select.Option value="service">Services</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="shopping">Shopping</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="other">Others</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date" name="date">
          <Input type="date" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input type="text" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Transaction;
