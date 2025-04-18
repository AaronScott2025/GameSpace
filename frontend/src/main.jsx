import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { UserProvider } from "./pages/UserContext.jsx";
import Layout from "./components/Layout.jsx";

// generate random shooting stars
const generateStars = () => {
  const stars = [];
  const starCount = 150; // star count for coverage


  for (let i = 0; i < starCount; i++) {
    // Random position for each star
    const topPosition = Math.random() * 100; // Random top position between 0-100%
    const leftPosition = Math.random() * 100; // Random left position between 0-100%

    stars.push(
      <div
        key={i}
        className="star"
        style={{
          top: `${topPosition}%`,
          left: `${leftPosition}%`,
          animationDelay: `-${Math.random() * 5}s`, // Random delay for each star
        }}
      ></div>
    );
  }

  return stars;
};


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Layout>
      {generateStars()}
        <App />
      </Layout>
    </UserProvider>
  </BrowserRouter>
);
