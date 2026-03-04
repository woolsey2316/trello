import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUserId } from "../api/client.js";
import { jwtDecode } from "jwt-decode";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token)
      const userId = jwtDecode(token)?.sub;
      setUserId(userId || "");
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
