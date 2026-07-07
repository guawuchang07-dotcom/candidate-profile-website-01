import React from "react";
import ReactDOM from "react-dom/client";
import CandidateSystemPage from "./CandidateSystemPage";
import ProjectCasePage, { hasProjectCase } from "./ProjectCasePage";
import ResumePage from "./ResumePage";
import "./candidate-system.css";

const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const projectSlugMatch = normalizedPath.match(/(?:^|\/)projects\/([^/]+)$/);
const projectSlug = projectSlugMatch ? projectSlugMatch[1] : null;

let page: JSX.Element;
if (projectSlug && hasProjectCase(projectSlug)) {
  page = <ProjectCasePage slug={projectSlug} />;
} else if (/(?:^|\/)resume$/.test(normalizedPath)) {
  page = <ResumePage />;
} else {
  page = <CandidateSystemPage />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{page}</React.StrictMode>
);
