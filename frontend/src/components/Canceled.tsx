import React from "react";
import "../styles/PaymentStatus.css";
import { Header } from "../pages/Header";
import { Footer2 } from "../pages/Footer2";
import { Footer } from "../pages/Footer";

const Cancel = () => {
  return (
    <div>
      <Header bgColor="#f6f6f6"></Header>
      <div className="payment-container cancel">
        <h2>Payment cancelled</h2>
        <p>No worries. You can <a href="/upgrade-account-tier" style={{textDecoration: 'none', color: '#007bff'}}>Upgrade</a> again anytime. </p>
      </div>
      <Footer2 bgColor="#f6f6f6"></Footer2>
      <Footer bgColor="#f6f6f6"></Footer>
    </div>
    );
};

export default Cancel;