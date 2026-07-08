import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./router";
import LoadingScreen from "./components/common/LoadingScreen";
import "./styles/Global.css";
import "./styles/auth.css";
import "./styles/loadingscreen.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingScreen />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
