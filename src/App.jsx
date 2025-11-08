import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { isLoaded, isSignedIn } = useUser();

  // Wait until Clerk loads
  if (!isLoaded) return null;

  // If not signed in, redirect to sign-in page
  if (!isSignedIn) return <Navigate to="/auth/sign-in" replace />;

  return (
    <>
      <Header />
      <Outlet /> {/* <-- Renders nested routes */}
      <Toaster />
    </>
  );
}

export default App;
