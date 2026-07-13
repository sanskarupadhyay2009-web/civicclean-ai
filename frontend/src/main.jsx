import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./router";
import LoadingScreen from "./components/common/LoadingScreen";
import CustomCursor from "./components/common/CustomCursor";
import "./styles/theme.css";
import "./styles/cursor.css";
import "./styles/Global.css";
import "./styles/auth.css";
import "./styles/loadingscreen.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CustomCursor />
      <LoadingScreen />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
