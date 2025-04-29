import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import HomePage from "./pages/home-page";
import DuoMatchmakerPage from "./pages/duo-matchmaker-page";
import ChatBot from "./pages/chat-bot";
import DMPage from "./pages/dm-page";
import Wrapper from "./pages/Wrapper";
import AccountPage from "./pages/account-page";
import Marketplace from "./pages/marketplace-home";
import ProductPage from "./pages/product-page";
import ErrorPage from "./pages/error-page";
import EventsPage from "./pages/events-page";
import PostDetails from './pages/PostDetails';
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
      path: "/dm-page",
      element: (
        <Wrapper>
          <DMPage />
        </Wrapper>
      ),
    },
    {
      path: "/account",
      element: <AccountPage />,
    },
    {
      path: "/marketplace",
      element: (
        <Wrapper>
          <Marketplace />,
        </Wrapper>
      ),
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
      path: "/post/:id",
      element: (
        <Wrapper>
          <PostDetails />
        </Wrapper>
      ),
    },
    
    {
      path: "/partyfinder",
      element: <DuoMatchmakerPage />,
    },
    {
      path: "/item/:id", // <-- Add this route for item details
      element: (
        <Wrapper>
          <ProductPage />,
        </Wrapper>
      ),
    },
    {
      path: "/events",
      element: (
        <Wrapper>
          <EventsPage />
        </Wrapper>
      ),
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <>
      <div className="App">{routes}</div>
    </>
  );
}

export default App;
