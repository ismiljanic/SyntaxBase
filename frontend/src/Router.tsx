import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MainP } from "./pages/MainP";
import Homepage from "./pages/Homepage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import { Contact } from "./pages/Contact";
import { WebDevelopmentPage } from "./pages/WebDevelopmentPage";
import { GameDevelopmentPage } from "./pages/GameDevelopmentPage";
import { DatabaseManagment } from "./pages/DatabaseManagment";
import { ProblemSolvingPage } from "./pages/ProblemSolvingPage";
import { InstructionsPage } from "./pages/InstructionsPage";

export function Router() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/homepage/:donorId" element={<Homepage />} />
          <Route path="/changeSettings/:donorId" element={<PersonalInformationPage />} />
          <Route path="/webDevelopment" element={<WebDevelopmentPage />} />
          <Route path="/gameDevelopment" element={<GameDevelopmentPage />} />
          <Route path="/databaseManagment" element={<DatabaseManagment />} />
          <Route path="/problemSolving" element={<ProblemSolvingPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}