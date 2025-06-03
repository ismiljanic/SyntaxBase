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
import { Lesson2 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson2";
import { Lesson3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson3";
import { Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson4";
import { Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson5";
import { Lesson6 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson6";
import { Lesson7 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson7";
import { Lesson8 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson8";
import { Lesson9 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson9";
import { Lesson10 } from "./pages/webCourses/BeginnerWebCourse/Lessons/Lesson10";
import { ShowCase1 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase1";
import { ShowCase2 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase2";
import { ShowCase3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase3";
import { ShowCase4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase4";
import { ShowCase1Lesson3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase1Lesson3";
import { ShowCase2Lesson3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase2Lesson3";
import { ShowCase3Lesson3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase3Lesson3";
import { ShowCase4Lesson3 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase4Lesson3";
import { ShowCase1Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase1Lesson4";
import { ShowCase2Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase2Lesson4";
import { ShowCase3Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase3Lesson4";
import { ShowCase4Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase4Lesson4";
import { ShowCase5Lesson4 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase5Lesson4";
import { ShowCase1Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase1Lesson5";
import { ShowCase2Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase2Lesson5";
import { ShowCase3Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase3Lesson5";
import { ShowCase4Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase4Lesson5";
import { ShowCase5Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase5Lesson5";
import { ShowCase6Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase6Lesson5";
import { ShowCase7Lesson5 } from "./pages/webCourses/BeginnerWebCourse/Lessons/ShowCase7Lesson5";
import { Lesson7PortfolioExample } from "./pages/webCourses/BeginnerWebCourse/Lessons/project/examples/Lesson7PortfolioExample";
import { BeginnerWebTutorialLesson1 } from "./pages/webTutorials/beginnerWebTutorial/Lessons/Lesson1";
import { BeginnerWebTutorialLesson2 } from "./pages/webTutorials/beginnerWebTutorial/Lessons/Lesson2";
import { BeginnerWebTutorialLesson3 } from "./pages/webTutorials/beginnerWebTutorial/Lessons/Lesson3";
import { BeginnerWebTutorialLesson4 } from "./pages/webTutorials/beginnerWebTutorial/Lessons/Lesson4";
import { BeginnerWebTutorialLesson5 } from "./pages/webTutorials/beginnerWebTutorial/Lessons/Lesson5";
import { FinishCourse } from "./pages/webCourses/BeginnerWebCourse/Lessons/FinishCourse";
import { BeginnerWebDevelopmentQuiz } from "./pages/webCourses/BeginnerWebCourse/Lessons/BeginnerWebDevelopmentQuiz";
import { Community } from "./pages/Community";
import { Notifications } from "./pages/Notifications";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminPage } from './components/AdminPage';
import { InstructorRequestForm } from "./pages/InstructorRequestForm";

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
          <Route path="/homepage" element={<Homepage />} />
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
          <Route path="/beginnerWebCourse/quiz" element={<BeginnerWebDevelopmentQuiz />} />
          <Route path="/beginnerWebCourse/:userId" element={<MainPageBeginnerWebCourse />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<PrivateRoute><Lesson1 /></PrivateRoute>} />
          <Route path="/course/:courseId/lesson/2" element={<Lesson2 />} />
          <Route path="/course/:courseId/lesson/3" element={<Lesson3 />} />
          <Route path="/course/:courseId/lesson/4" element={<Lesson4 />} />
          <Route path="/course/:courseId/lesson/5" element={<Lesson5 />} />
          <Route path="/course/:courseId/lesson/6" element={<Lesson6 />} />
          <Route path="/course/:courseId/lesson/7" element={<Lesson7 />} />
          <Route path="/course/:courseId/lesson/8" element={<Lesson8 />} />
          <Route path="/course/:courseId/lesson/9" element={<Lesson9 />} />
          <Route path="/course/:courseId/lesson/10" element={<Lesson10 />} />
          <Route path="/showCase1/lesson2" element={<ShowCase1 />} />
          <Route path="/showCase2/lesson2" element={<ShowCase2 />} />
          <Route path="/showCase3/lesson2" element={<ShowCase3 />} />
          <Route path="/showCase4/lesson2" element={<ShowCase4 />} />
          <Route path="/showCase1Lesson3/lesson3" element={<ShowCase1Lesson3 />} />
          <Route path="/showCase2Lesson3/lesson3" element={<ShowCase2Lesson3 />} />
          <Route path="/showCase3Lesson3/lesson3" element={<ShowCase3Lesson3 />} />
          <Route path="/showCase4Lesson3/lesson3" element={<ShowCase4Lesson3 />} />
          <Route path="/showCase1Lesson4/lesson4" element={<ShowCase1Lesson4 />} />
          <Route path="/showCase2Lesson4/lesson4" element={<ShowCase2Lesson4 />} />
          <Route path="/showCase3Lesson4/lesson4" element={<ShowCase3Lesson4 />} />
          <Route path="/showCase4Lesson4/lesson4" element={<ShowCase4Lesson4 />} />
          <Route path="/showCase5Lesson4/lesson4" element={<ShowCase5Lesson4 />} />
          <Route path="/showCase1Lesson5/lesson5" element={<ShowCase1Lesson5 />} />
          <Route path="/showCase2Lesson5/lesson5" element={<ShowCase2Lesson5 />} />
          <Route path="/showCase3Lesson5/lesson5" element={<ShowCase3Lesson5 />} />
          <Route path="/showCase4Lesson5/lesson5" element={<ShowCase4Lesson5 />} />
          <Route path="/showCase5Lesson5/lesson5" element={<ShowCase5Lesson5 />} />
          <Route path="/showCase6Lesson5/lesson5" element={<ShowCase6Lesson5 />} />
          <Route path="/showCase7Lesson5/lesson5" element={<ShowCase7Lesson5 />} />
          <Route path="/beginnerWebCourse/project/portfolio" element={<Lesson7PortfolioExample />} />
          <Route path="/beginnerWebTutorial/lesson/1" element={<BeginnerWebTutorialLesson1 />} />
          <Route path="/beginnerWebTutorial/lesson/2" element={<BeginnerWebTutorialLesson2 />} />
          <Route path="/beginnerWebTutorial/lesson/3" element={<BeginnerWebTutorialLesson3 />} />
          <Route path="/beginnerWebTutorial/lesson/4" element={<BeginnerWebTutorialLesson4 />} />
          <Route path="/beginnerWebTutorial/lesson/5" element={<BeginnerWebTutorialLesson5 />} />
          <Route path="/course/:courseId/lesson/finish" element={<FinishCourse />} />
          <Route path="/request-instructor" element={<InstructorRequestForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/community/:userId" element={<Community />} />
          <Route path="/notifications/:userId" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}