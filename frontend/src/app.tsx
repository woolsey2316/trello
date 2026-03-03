import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage.js";
import BoardPage from "./pages/BoardPage.js";
import LoginPage from "./pages/LoginPage.js";
import AuthCallbackPage from "./pages/AuthCallbackPage.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board/:id"
        element={
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
