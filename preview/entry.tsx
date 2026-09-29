import { createRoot } from "react-dom/client";
import "../src/app/globals.css";
import "../src/components/fx/fx.css";
import Home from "../src/app/page";

document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(<Home />);
