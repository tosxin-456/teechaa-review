import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <QuizProvider> {/* Wrapping the app with QuizProvider */}
      <div className="font-montserrat">
        <Router>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search-questions" element={<SearchQuestions />} />
            <Route path="/result-checker" element={<SelectQuiz />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/progress-report" element={<ProgressReport />} />
            <Route path="/upcoming-tests" element={<UpcomingTests />} />
            <Route path="/profile" element={<StudentProfilePage />} />
            <Route path="/take-jamb" element={<TakeJambQuiz />} />
            <Route path="/take-waec" element={<TakeWaecQuiz />} />
            <Route path="/schedule-exam" element={<ScheuleExam />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/results" element={<Results2Page />} />
            <Route path="/exam-history" element={<ExamHistory />} />
          </Routes>
        </Router>
      </div>
    </QuizProvider>
  );
}

export default App;
