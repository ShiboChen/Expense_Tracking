import React, { useState, useEffect } from "react";
import { Form, Input, message, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const submitHandler = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3001/register",
        formData
      );
      setLoading(false);
      message.success("Register Successfully!");
      localStorage.setItem("user", JSON.stringify({ ...data }));
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong!");
    }
  };

  return (
    <div className="align-center" style={{ width: "30%" }}>
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h3>Sign Up</h3>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>
        <div>
          <p>
            <Link to="/">Already have an account? Sign in</Link>
          </p>
          <Button type="primary" htmlType="submit">
            Resgiter
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
