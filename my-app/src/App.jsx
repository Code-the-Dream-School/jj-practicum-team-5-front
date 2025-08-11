import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProjectPage from "./ProjectPage";
import StepPage from "./StepPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectPage />} />
        <Route path="/step/:id" element={<StepPage />} />
      </Routes>
    </Router>
  );
}
