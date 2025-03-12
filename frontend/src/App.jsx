import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import HomePage from "./pages/home-page";
import Wrapper from "./pages/Wrapper";
import AccountPage from "./pages/account-page";
import "./App.css";
import ChatBot from "./pages/chat-bot.jsx";

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
      path: "/account",
      element: < AccountPage/>,
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
  ]);

  return (
    <>
      <div className="App">{routes}</div>
    </>
  );
}

export default App;
