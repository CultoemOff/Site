import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import OffersView from "../src/components/offers/OffersView";
import { SAMPLE_OFFERS } from "./sample-offers";

createRoot(document.getElementById("root")!).render(<OffersView offers={SAMPLE_OFFERS} homeUrl="index.html" />);
