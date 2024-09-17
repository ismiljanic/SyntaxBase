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
import { Tutorials } from "./pages/Tutorials";
import { Courses } from "./pages/Courses";
import { Help } from "./pages/Help";
import { About } from "./pages/About";
import { MyCourses } from "./pages/MyCourses";
import { BeginnerWebCourse } from "./pages/webCourses/BeginnerWebCourse";
import { IntermediateWebCourse } from "./pages/webCourses/IntermediateWebCourse";
import { AdvancedWebCourse } from "./pages/webCourses/AdvancedWebCourse";
import { BeginnerGameCourse } from "./pages/gameCourses/BeginnerGameCourse";
import { IntermediateGameCourse } from "./pages/gameCourses/IntermediateGameCourse";
import { AdvancedGameCourse } from "./pages/gameCourses/AdvancedGameCourse";
import { BeginnerDatabaseCourse } from "./pages/databaseCourses/BeginnerDatabaseCourse";
import { IntermediateDatabaseCourse } from "./pages/databaseCourses/IntermediateDatabaseCourse";
import { AdvancedDatabaseCourse } from "./pages/databaseCourses/AdvancedDatabaseCourse";
import { BeginnerProblemSolvingCourse } from "./pages/problemSolvingCourses/BeginnerProblemSolvingCourse";
import { IntermediateProblemSolvingCourse } from "./pages/problemSolvingCourses/IntermediateProblemSolvingCourse";
import { AdvancedProblemSolvingCourse } from "./pages/problemSolvingCourses/AdvancedProblemSolvingCourse";
import { SimpleFrontendApplication } from "./pages/webCourses/BeginnerWebCourse/pages/SimpleFrontendApplication";
import { AccountInformation } from "./pages/AccountInformation";
import { MainPageBeginnerWebCourse } from "./pages/webCourses/BeginnerWebCourse/MainPageBeginnerWebCourse/MainPageBeginnerWebCourse";
import { Lesson1 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson1";


export function Router() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainP />} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/:userId" element={<Contact />} />
          <Route path="/homepage/:id" element={<Homepage />} />
          <Route path="/changeSettings/:id" element={<PersonalInformationPage />} />
          <Route path="/webDevelopment" element={<WebDevelopmentPage />} />
          <Route path="/gameDevelopment" element={<GameDevelopmentPage />} />
          <Route path="/databaseManagment" element={<DatabaseManagment />} />
          <Route path="/problemSolving" element={<ProblemSolvingPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/myCourses/:id" element={<MyCourses />} />
          <Route path="/beginnerWebCourse" element={<BeginnerWebCourse />} />
          <Route path="/intermediateWebCourse" element={<IntermediateWebCourse />} />
          <Route path="/advancedWebCourse" element={<AdvancedWebCourse />} />
          <Route path="/beginnerGameCourse" element={<BeginnerGameCourse />} />
          <Route path="/intermediateGameCourse" element={<IntermediateGameCourse />} />
          <Route path="/advancedGameCourse" element={<AdvancedGameCourse />} />
          <Route path="/beginnerDatabaseCourse" element={<BeginnerDatabaseCourse />} />
          <Route path="/intermediateDatabaseCourse" element={<IntermediateDatabaseCourse />} />
          <Route path="/advancedDatabaseCourse" element={<AdvancedDatabaseCourse />} />
          <Route path="/beginnerProblemSolvingCourse" element={<BeginnerProblemSolvingCourse />} />
          <Route path="/intermediateProblemSolvingCourse" element={<IntermediateProblemSolvingCourse />} />
          <Route path="/advancedProblemSolvingCourse" element={<AdvancedProblemSolvingCourse />} />
          <Route path="/simpleFrontendApplication" element={<SimpleFrontendApplication />} />
          <Route path="/change-personal-info/:id" element={<PersonalInformationPage />} />
          <Route path="/accountInformation/:userId" element={<AccountInformation />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/course/:courseid" element={<MainPageBeginnerWebCourse />} />
          <Route path="/course/:courseId/lesson1" element={<Lesson1 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}