import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportWaste from "./pages/ReportWaste";
import LiveMap from "./pages/LiveMap";
import Community from "./pages/Community";
import Assistant from "./pages/Assistant";
import About from "./pages/About";

import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "report",
        element: (
          <ProtectedRoute>
            <ReportWaste />
          </ProtectedRoute>
        ),
      },
      {
        path: "map",
        element: (
          <ProtectedRoute>
            <LiveMap />
          </ProtectedRoute>
        ),
      },
      {
        path: "community",
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        ),
      },
      {
        path: "assistant",
        element: (
          <ProtectedRoute>
            <Assistant />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;
