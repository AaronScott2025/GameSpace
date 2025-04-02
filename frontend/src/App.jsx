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
      path: "/chatbot",
      element: < ChatBot/>,
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
