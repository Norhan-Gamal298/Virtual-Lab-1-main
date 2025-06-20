import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import DocsLayout from "./layout/DocsLayout";
import MarkdownPage from "./pages/MarkdownPage";
import Profile from "./components/Profile";
import Community from "./pages/Community";
import About from "./pages/About";
import QuizListPage from "./pages/QuizListPage";
import QuizPage from "./pages/QuizPage";
import TerminalPage from "./pages/TerminalPage";
import BlogDetail from "./components/BlogDetail";
import Blogs from "./pages/Blogs";
import ResetPassword from "./pages/ResetPassword";
import BlogsLayout from "./layout/BlogsLayout";
import TermsAndPrivacy from "./pages/TermsAndPrivacy"; // New import
// Admin imports
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminContent from "./pages/admin/Content";
import AdminBlogs from "./pages/admin/Blogs";
import AdminQuizzes from "./pages/admin/Quizzes";
import AdminProfile from "./pages/admin/Profile";
import AdminAdmins from "./pages/admin/Admins";
import AdminLogin from "./pages/admin/Login";
import AdminRoute from "./components/AdminRoute";
import Faq from "./pages/Faq";
import ProtectedCongratulations from "./components/ProtectedCongratulations";

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />

        {/* Terms and Privacy routes */}
        <Route path="/terms" element={<TermsAndPrivacy />} />
        <Route path="/privacy" element={<TermsAndPrivacy />} />
        <Route path="/congratulations " element={<ProtectedCongratulations />} />
        <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />

        <Route path="/docs/*" element={<DocsLayout />}>
          <Route index element={<MarkdownPage />} /> {/* This catches /docs */}
          <Route path=":topicId" element={<MarkdownPage />} />{" "}
          {/* This catches /docs/specific-topic */}
        </Route>

        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quizzes/:chapterId" element={<QuizPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/terminal-page" element={<TerminalPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs" element={<BlogsLayout />}>
          <Route index element={<Blogs />} />
          <Route path=":id" element={<BlogDetail />} />
        </Route>
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Route>

      {/* Admin login (public) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users/:type" element={<AdminUsers />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="admins" element={<AdminAdmins />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;