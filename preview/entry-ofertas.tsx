import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import OffersView from "../src/components/offers/OffersView";
import { COURSES } from "../src/config/courses";
import { SAMPLE_OFFERS } from "./sample-offers";

createRoot(document.getElementById("root")!).render(<OffersView offers={SAMPLE_OFFERS} homeUrl="/" courses={COURSES} />);
