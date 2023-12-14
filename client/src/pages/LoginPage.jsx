import React, { useState, useEffect } from "react";
import { Form, Input, message, Button, Col, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      setLoading(false);
      console.log(data);
      message.success("Login Successfully!");
      localStorage.setItem("user", JSON.stringify({ ...data }));
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong!");
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col span={14}>
        <img
          src={
            "https://static.vecteezy.com/system/resources/previews/015/939/308/original/financial-management-planning-and-control-financial-resources-to-maximize-profit-and-revenue-capital-credit-and-cash-management-concept-businessman-analyze-financial-resource-with-growth-profit-vector.jpg"
          }
          alt="landing page"
          style={{ width: "100%", height: "100%" }}
        />
      </Col>
      <Col span={10}>
        <div className="align-center" style={{ width: "65%" }}>
          {loading && <Spinner />}
          <Form layout="vertical" onFinish={submitHandler}>
            <h3>Sign In</h3>
            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" />
            </Form.Item>
            <div>
              <p>
                <Link to="/register">Don't have an account? Sign Up</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
