import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../api/client.js";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center">
      <p className="text-white">Signing you in…</p>
    </div>
  );
};

export default AuthCallbackPage;
