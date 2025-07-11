import React from "react";
import "../styles/PaymentStatus.css";
import { Header } from "../pages/Header";
import { Footer2 } from "../pages/Footer2";
import { Footer } from "../pages/Footer";

const Success = () => {
  return (
    <div>
      <Header bgColor="#f6f6f6"></Header>
      <div className="payment-container success">
        <h2>Payment successful!</h2>
        <p>Thank you for your purchase. Your subscription is now active.</p>
        <a href="/homepage" style={{textDecoration: 'none', color: '#007bff'}}>Go to Homepage</a>
      </div>
      <Footer2 bgColor="#f6f6f6"></Footer2>
      <Footer bgColor="#f6f6f6"></Footer>
    </div>
  );
};
export default Success;
