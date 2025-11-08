import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import Dashboard from "./pages/home";
import OTPPage from "./pages/otp";
import ForgotPassword from "./pages/forgot_password";
import ResetPassword from "./pages/reset_password";
import SearchQuestions from "./pages/search_questions";
import SelectQuiz from "./pages/select_quiz";
import ResultPage from "./pages/result_page";
import NotFound from "./pages/404";
import ProgressReport from "./pages/progress_report";
import UpcomingTests from "./pages/upcoming_test";
import StudentProfilePage from "./pages/profile";
import TakeJambQuiz from "./pages/take_jamb";
import TakeWaecQuiz from "./pages/take_waec";
import ScheuleExam from "./pages/schedule_exam";
import ExamPage from "./pages/exam _page";
import Results2Page from "./test";
import { QuizProvider } from "./utils/api/Redux/QuizContext";
import ExamHistory from "./pages/exam_history";
import OTPResetPage from "./pages/otpRestPass";
import { SessionExpirationPopup } from "./components/sessionExpiredPopup";
import HomePage from "./pages/website";
import SubscriptionModal from "./components/subscriptionModal";

function AppContent() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const subscribed = false;

  console.log("User from localStorage:", localStorage.getItem("user"));
  console.log("Parsed user:", user);
  console.log("Subscribed status:", subscribed);

  const excludedPaths = [
    "/login",
    "/register",
    "/",
    "/forgot-password",
    "/otp",
    "/reset-password",
    "/reset-otp",
    "/signup",
  ];

  return (
    <div className="font-montserrat">
      {subscribed && !excludedPaths.includes(location.pathname) && (
        <div className="m-11">
          <SubscriptionModal />
        </div>
      )}
      <SessionExpirationPopup />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-otp" element={<OTPResetPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search-questions" element={<SearchQuestions />} />
        <Route path="/result-checker" element={<SelectQuiz />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/progress-report" element={<ProgressReport />} />
        <Route path="/upcoming-tests" element={<UpcomingTests />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/review-jamb" element={<TakeJambQuiz />} />
        <Route path="/review-waec" element={<TakeWaecQuiz />} />
        <Route path="/schedule-exam" element={<ScheuleExam />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/results" element={<Results2Page />} />
        <Route path="/exam-history" element={<ExamHistory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}



function App() {
  return (
    <QuizProvider>
      <Router>
        <AppContent />
      </Router>
    </QuizProvider>
  );
}

export default App;
