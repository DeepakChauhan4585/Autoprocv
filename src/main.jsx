import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignInPage from "./auth/sign-in/index.jsx";
import Home from "./home/index.jsx";
import Dashboard from "./dashboard/index.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import EditResume from "./dashboard/resume/[resumeId]/edit/index.jsx";
import ViewResume from "./my-resume/[resumeId]/view/index.jsx";

// ✅ Load Clerk publishable key from .env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("⚠️ Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

// ✅ Detect environment (local vs production)
const basename = import.meta.env.DEV ? "/" : "/autoprocv";

// ✅ Define routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      element: <App />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/dashboard/resume/:resumeId/edit",
          element: <EditResume />,
        },
      ],
    },
    {
      path: "/auth/sign-in",
      element: <SignInPage />,
    },
    {
      path: "/my-resume/:resumeId/view",
      element: <ViewResume />,
    },
  ],
  {
    basename, // ✅ Important: base path for GitHub Pages
  }
);

// ✅ Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
