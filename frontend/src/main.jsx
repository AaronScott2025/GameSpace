import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { UserProvider } from "./pages/UserContext.jsx";
import Layout from "./components/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Layout>
        <App />
      </Layout>
    </UserProvider>
  </BrowserRouter>
);
