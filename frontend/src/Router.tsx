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
import { AdminPage } from "./pages/admin/AdminPage";
import { InstructorRequestForm } from "./pages/instructor/InstructorRequestForm";
import UserDetails from "./components/UserDetails";
import CreateCourse from "./pages/CreateCourse";
import DynamicLessonRenderer from "./components/DynamicLessonRenderer";
import { PlaceToStartCourse } from "./components/PlaceToStartCourse";
import TierUpgradePage from './pages/instructor/TierUpgradePage'
import ProtectedRoute from "./models/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Forbidden from "./pages/Forbidden";
import Canceled from "./components/Canceled";
import Success from "./components/Success";
import Cancel from "./components/Canceled";
import InviteHandler from "./components/InviteHandler";
import AcceptInvite from "./components/AcceptInvite";

export function Router() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/:userId" element={<ProtectedRoute>
            <Contact />
          </ProtectedRoute>} />
          <Route path="/homepage/:id" element={<ProtectedRoute>
            <Homepage />
          </ProtectedRoute>} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/changeSettings/:id" element={<ProtectedRoute>
            <PersonalInformationPage />
          </ProtectedRoute>} />
          <Route path="/webDevelopment" element={<WebDevelopmentPage />} />
          <Route path="/gameDevelopment" element={<GameDevelopmentPage />} />
          <Route path="/databaseManagment" element={<DatabaseManagment />} />
          <Route path="/problemSolving" element={<ProblemSolvingPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/myCourses/:id" element={<ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>} />
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
          <Route path="/simpleFrontendApplication" element={<ProtectedRoute>
            <SimpleFrontendApplication />
          </ProtectedRoute>} />
          <Route path="/change-personal-info/:id" element={<ProtectedRoute>
            <PersonalInformationPage />
          </ProtectedRoute>} />
          <Route path="/accountInformation/:userId" element={<ProtectedRoute>
            <AccountInformation />
          </ProtectedRoute>} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/beginnerWebDevelopmentQuiz" element={<ProtectedRoute>
            <BeginnerWebDevelopmentQuiz />
          </ProtectedRoute>} />
          <Route path="/beginnerWebCourse/:userId" element={<ProtectedRoute>
            <MainPageBeginnerWebCourse />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><Lesson1 /></ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/2" element={<ProtectedRoute>
            <Lesson2 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/3" element={<ProtectedRoute>
            <Lesson3 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/4" element={<ProtectedRoute>
            <Lesson4 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/5" element={<ProtectedRoute>
            <Lesson5 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/6" element={<ProtectedRoute>
            <Lesson6 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/7" element={<ProtectedRoute>
            <Lesson7 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/8" element={<ProtectedRoute>
            <Lesson8 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/9" element={<ProtectedRoute>
            <Lesson9 />
          </ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/10" element={<ProtectedRoute>
            <Lesson10 />
          </ProtectedRoute>} />
          <Route path="/showCase1/lesson2" element={<ProtectedRoute>
            <ShowCase1 />
          </ProtectedRoute>} />
          <Route path="/showCase2/lesson2" element={<ProtectedRoute>
            <ShowCase2 />
          </ProtectedRoute>} />
          <Route path="/showCase3/lesson2" element={<ProtectedRoute>
            <ShowCase3 />
          </ProtectedRoute>} />
          <Route path="/showCase4/lesson2" element={<ProtectedRoute>
            <ShowCase4 />
          </ProtectedRoute>} />
          <Route path="/showCase1Lesson3/lesson3" element={<ProtectedRoute>
            <ShowCase1Lesson3 />
          </ProtectedRoute>} />
          <Route path="/showCase2Lesson3/lesson3" element={<ProtectedRoute>
            <ShowCase2Lesson3 />
          </ProtectedRoute>} />
          <Route path="/showCase3Lesson3/lesson3" element={<ProtectedRoute>
            <ShowCase3Lesson3 />
          </ProtectedRoute>} />
          <Route path="/showCase4Lesson3/lesson3" element={<ProtectedRoute>
            <ShowCase4Lesson3 />
          </ProtectedRoute>} />
          <Route path="/showCase1Lesson4/lesson4" element={<ProtectedRoute>
            <ShowCase1Lesson4 />
          </ProtectedRoute>} />
          <Route path="/showCase2Lesson4/lesson4" element={<ProtectedRoute>
            <ShowCase2Lesson4 />
          </ProtectedRoute>} />
          <Route path="/showCase3Lesson4/lesson4" element={<ProtectedRoute>
            <ShowCase3Lesson4 />
          </ProtectedRoute>} />
          <Route path="/showCase4Lesson4/lesson4" element={<ProtectedRoute>
            <ShowCase4Lesson4 />
          </ProtectedRoute>} />
          <Route path="/showCase5Lesson4/lesson4" element={<ProtectedRoute>
            <ShowCase5Lesson4 />
          </ProtectedRoute>} />
          <Route path="/showCase1Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase1Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase2Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase2Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase3Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase3Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase4Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase4Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase5Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase5Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase6Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase6Lesson5 />
          </ProtectedRoute>} />
          <Route path="/showCase7Lesson5/lesson5" element={<ProtectedRoute>
            <ShowCase7Lesson5 />
          </ProtectedRoute>} />
          <Route path="/beginnerWebCourse/:courseId/project/portfolio" element={<ProtectedRoute>
            <Lesson7PortfolioExample />
          </ProtectedRoute>} />
          <Route path="/beginnerWebTutorial/lesson/1" element={
            <BeginnerWebTutorialLesson1 />
          } />
          <Route path="/beginnerWebTutorial/lesson/2" element={
            <BeginnerWebTutorialLesson2 />
          } />
          <Route path="/beginnerWebTutorial/lesson/3" element={
            <BeginnerWebTutorialLesson3 />
          } />
          <Route path="/beginnerWebTutorial/lesson/4" element={
            <BeginnerWebTutorialLesson4 />
          } />
          <Route path="/beginnerWebTutorial/lesson/5" element={
            <BeginnerWebTutorialLesson5 />} />
          <Route path="/course/:courseId/lesson/finish" element={<ProtectedRoute>
            <FinishCourse />
          </ProtectedRoute>} />
          <Route path="/request-instructor" element={<ProtectedRoute>
            <InstructorRequestForm />
          </ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>} />
          <Route path="/adminPage" element={<ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>} />
          <Route path="/admin/users/:userId" element={<ProtectedRoute requiredRoles={['ADMIN']}>
            <UserDetails />
          </ProtectedRoute>} />
          <Route path="/community/:userId" element={<ProtectedRoute>
            <Community />
          </ProtectedRoute>} />
          <Route path="/notifications/:userId" element={<ProtectedRoute>
            <Notifications />
          </ProtectedRoute>} />
          <Route path="/create-course" element={<ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>} />
          <Route path="/dynamic-course/:courseId/lesson/:lessonId" element={<ProtectedRoute>
            <DynamicLessonRenderer />
          </ProtectedRoute>} />
          <Route path="/placetostartcourse/" element={<ProtectedRoute>
            <PlaceToStartCourse />
          </ProtectedRoute>} />
          <Route path="/upgrade-account-tier" element={<ProtectedRoute>
            <TierUpgradePage />
          </ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute>
            <Success />
          </ProtectedRoute>} />
          <Route path="/cancel" element={<ProtectedRoute>
            <Cancel />
          </ProtectedRoute>} />
          <Route path="/invite/:token" element={<ProtectedRoute>
            <InviteHandler />
          </ProtectedRoute>} />
          <Route path="/accept-invite" element={
             <AcceptInvite /> } />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}