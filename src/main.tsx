
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import logoIcon from "./imports/logo-header.png";

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = logoIcon;
document.head.appendChild(favicon);
  createRoot(document.getElementById("root")!).render(<App />);
  