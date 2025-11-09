
  import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppResponsive from "./AppResponsive.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppResponsive />
  </BrowserRouter>
);
  