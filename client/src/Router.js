import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ToDoPage from "./pages/ToDoPage";
import PrivateRoute from "./components/PrivateRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Route */}
        <Route element={<PrivateRoute />}>
          <Route path="/tasks" element={<ToDoPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
