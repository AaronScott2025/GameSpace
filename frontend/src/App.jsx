import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import HomePage from "./pages/home-page";
import DuoMatchmakerPage from "./pages/duo-matchmaker-page";
import ChatBot from "./pages/chat-bot";
import Wrapper from "./pages/Wrapper";
import AccountPage from "./pages/account-page";
import Marketplace from "./pages/marketplace-home";
import ProductPage from "./pages/product-page";
import MatchmakingFormPage from "./pages/matchmaking-form-page";
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
      path: "/chatbot",
      element: (
        <Wrapper>
          <ChatBot />
        </Wrapper>
      ),
    },
    {
      path: "/account",
      element: <AccountPage />,
    },
    {
      path: "/marketplace",
      element: <Marketplace />,
    },
    {
      path: "/chatbot",
      element: <ChatBot />,
    },
    {
      path: "/home",
      element: (
        <Wrapper>
          <HomePage />
        </Wrapper>
      ),
    },
    {
      path: "/partyfinder",
      element: <MatchmakingFormPage />,
      children: [
        {
          path: "matches",
          element: <DuoMatchmakerPage />,
        },
      ],
    },
    {
      path: "/item/:id", // <-- Add this route for item details
      element: <ProductPage />,
    },
  ]);

  return (
    <>
      <div className="App">{routes}</div>
    </>
  );
}

export default App;
