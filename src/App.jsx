import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpForm from "./pages/SignUpForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import StepPage from "./pages/StepPage";
import ProjectFormPage from "./pages/ProjectFormPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from './contexts/AuthContext';


import "./index.css";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* IMPORTANT: creation route must come before the param route */}
                        <Route path="/projects/new" element={<ProjectFormPage />} />

                        {/* ADDED: plain /project shows default/first project */}
                        <Route path="/project" element={<ProjectPage />} />

                        {/* UNIFIED: use :projectId everywhere (not :id) */}
                        <Route path="/project/:projectId" element={<ProjectPage />} />

                        {/* Step route stays consistent with :projectId */}
                        <Route
                            path="/project/:projectId/step/:stepId"
                            element={<StepPage />}
                        />
                        <Route path="/TeamPage" element={<TeamPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    );
}