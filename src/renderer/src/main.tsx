import React from "react";
import ReactDOM from "react-dom/client";
import CandidateSystemPage from "./CandidateSystemPage";
import ResumePage from "./ResumePage";
import "./candidate-system.css";

const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const page = /(?:^|\/)resume$/.test(normalizedPath) ? <ResumePage /> : <CandidateSystemPage />;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{page}</React.StrictMode>
);
