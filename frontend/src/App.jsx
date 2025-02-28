import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import HomePage from "./pages/home-page";
import DuoMatchmakerPage from "./pages/duo-matchmaker-page";
import "./App.css";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/duo-matchmaker",
      element: <DuoMatchmakerPage />,
    },
  ]);

  return (
    <>
      <div className="App">{routes}</div>
    </>
  );
}

export default App;
