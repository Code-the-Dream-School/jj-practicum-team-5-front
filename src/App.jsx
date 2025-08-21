import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpForm from "./pages/SignUpForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import StepPage from "./pages/StepPage";
import ProjectFormPage from "./pages/ProjectFormPage.jsx";
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Project list/default project */}
          <Route path="/project" element={<ProjectPage />} />
          {/* Specific project by ID  */}
          <Route path="/project/:projectId" element={<ProjectPage />} />

          {/* Step inside specific project */}
          <Route
            path="/project/:projectId/step/:stepId"
            element={<StepPage />}
          />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
