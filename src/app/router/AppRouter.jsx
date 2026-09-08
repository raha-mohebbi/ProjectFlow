import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import Dashboard from "../../components/layout/Dashboard";
import MainLayout from "../../components/layout/MainLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Main Application */}
        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;