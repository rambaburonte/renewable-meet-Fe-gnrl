import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedPaymentRouteProps {
  children: React.ReactNode;
}

const ProtectedPaymentRoute: React.FC<ProtectedPaymentRouteProps> = ({ children }) => {
  const location = useLocation();
  // Only allow access if navigated from a payment flow (e.g., via state)
  // You can enhance this logic as needed (e.g., check for sessionId, etc.)
  const fromPayment = location.state && location.state.fromPayment;
  if (!fromPayment) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedPaymentRoute;
