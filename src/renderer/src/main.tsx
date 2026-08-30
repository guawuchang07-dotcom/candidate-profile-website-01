import React from "react";
import ReactDOM from "react-dom/client";
import ProjectCasePage, { hasProjectCase } from "./ProjectCasePage";
import ResumePage from "./ResumePage";
import SplashCursor from "./SplashCursor";
import "./app.css";

const Hero3DPreviewPage = React.lazy(() => import("./Hero3DPreviewPage"));

const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const projectSlugMatch = normalizedPath.match(/(?:^|\/)projects\/([^/]+)$/);
const projectSlug = projectSlugMatch ? projectSlugMatch[1] : null;

let page: JSX.Element;
if (normalizedPath === "/hero-3d-preview") {
  page = (
    <React.Suspense fallback={null}>
      <Hero3DPreviewPage />
    </React.Suspense>
  );
} else if (projectSlug && hasProjectCase(projectSlug)) {
  page = <ProjectCasePage slug={projectSlug} />;
} else {
  page = <ResumePage />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {normalizedPath !== "/hero-3d-preview" && <SplashCursor />}
    {page}
  </React.StrictMode>
);
