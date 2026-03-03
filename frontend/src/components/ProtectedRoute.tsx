import { Navigate } from "react-router-dom";
import { getToken } from "../api/client.js";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
