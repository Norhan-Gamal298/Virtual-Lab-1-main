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
/* import Terminal from "./pages/Terminal";
 */import TerminalPage from "./pages/TerminalPage";
import BlogDetail from "./components/BlogDetail";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs/*" element={<DocsLayout />}>
          <Route path=":topicId" element={<MarkdownPage />} />
        </Route>
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quizzes/:chapterId" element={<QuizPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/terminal-page" element={<TerminalPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
