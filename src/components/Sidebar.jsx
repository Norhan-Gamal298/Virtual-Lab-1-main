import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronRight, FiCircle, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const [chapters, setChapters] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [topicContentExpanded, setTopicContentExpanded] = useState({});
  const [topicContents, setTopicContents] = useState({});
  const [loadingContent, setLoadingContent] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("chapters");
  const { user, topicProgress } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        const currentTopicId = location.pathname.split('/').pop();
        const currentChapter = data.find(chapter =>
          chapter.topics.some(topic => topic.id === currentTopicId)
        );
        if (currentChapter) {
          setExpanded(prev => ({ ...prev, [currentChapter.chapter]: true }));
        }
      })
      .catch((err) => console.error("Failed to load topics:", err));
  }, [location.pathname]);

  const toggleChapter = (chapterObj) => {
    const chapterName = chapterObj.chapter;
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setExpanded(prev => ({ ...prev, [chapterName]: true }));
      const firstTopic = chapterObj.topics[0];
      if (firstTopic) {
        navigate(`/docs/${firstTopic.id}`);
      }
    } else {
      setExpanded(prev => ({ ...prev, [chapterName]: !prev[chapterName] }));
    }
  };

  const fetchTopicContent = async (topicId) => {
    if (topicContents[topicId]) return; // Already loaded

    setLoadingContent(prev => ({ ...prev, [topicId]: true }));
    try {
      const response = await fetch(`http://localhost:8080/api/topics/${topicId}/content`);
      if (response.ok) {
        const content = await response.text();
        setTopicContents(prev => ({ ...prev, [topicId]: content }));
      } else {
        console.error(`Failed to load content for topic ${topicId}`);
      }
    } catch (error) {
      console.error(`Error loading content for topic ${topicId}:`, error);
    } finally {
      setLoadingContent(prev => ({ ...prev, [topicId]: false }));
    }
  };

  const toggleTopicContent = (topicId) => {
    const isExpanded = topicContentExpanded[topicId];
    setTopicContentExpanded(prev => ({ ...prev, [topicId]: !isExpanded }));

    if (!isExpanded && !topicContents[topicId]) {
      fetchTopicContent(topicId);
    }
  };

  const getTopicStatusIcon = (topicId) => {
    if (!user) return null;
    return topicProgress && topicProgress[topicId] ? (
      <FiCheckCircle className="text-green-500 text-sm mr-2 shrink-0" />
    ) : (
      <FiCircle className="text-gray-500 text-sm mr-2 shrink-0" />
    );
  };

  return (
    <aside
      className={`markdownSidebar transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-[50px]" : "w-[450px] bg-neutral-surface"} 
        pb-[3rem] text-neutral-text-primary dark:text-neutral-text-primary sticky z-40`}
    >
      <div className="sidebarViewport overflow-auto">
        <div className="sidebarContainer">
          <div className="flex p-2">
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className="p-1 bg-neutral-surface hover:bg-neutral-surface-hover border-2 border-neutral-border rounded-lg transition"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <TbLayoutSidebarRightCollapse size={30} /> : <TbLayoutSidebarLeftCollapse size={30} />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="transition">
              {/* Tab Navigation */}
              <div className="flex border-b border-neutral-border mb-4 px-2">
                <button
                  onClick={() => setActiveTab("chapters")}
                  className={`py-2 px-4 font-medium ${activeTab === "chapters" ? "text-primary border-b-2 border-primary" : "text-neutral-text-secondary hover:text-neutral-text-primary"}`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => {
                    setActiveTab("quiz");
                    navigate("/quizzes");
                  }}
                  className={`py-2 px-4 font-medium ${activeTab === "quiz" ? "text-primary border-b-2 border-primary" : "text-neutral-text-secondary hover:text-neutral-text-primary"}`}
                >
                  Quiz
                </button>
              </div>

              {/* Chapters Content */}
              {activeTab === "chapters" && (
                <nav>
                  <ul className="space-y-2 pr-2 pl-[12px]">
                    {chapters
                      .sort((a, b) => a.chapterId - b.chapterId)
                      .map((chapter) => (
                        <li key={chapter.chapter}>
                          <div
                            onClick={() => toggleChapter(chapter)}
                            className={`cursor-pointer font-semibold p-2 rounded-lg flex justify-between items-center transition
                              ${expanded[chapter.chapter] ? 'bg-neutral-background-hover' : 'hover:bg-neutral-background-hover'}`}
                          >
                            <motion.span
                              className="select-none overflow-hidden text-ellipsis w-full"
                              initial={{ opacity: 0, x: 0 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.25 }}
                            >
                              {chapter.chapter}
                            </motion.span>
                            <span>
                              {expanded[chapter.chapter]
                                ? <FiChevronDown size={18} />
                                : <FiChevronRight size={18} />}
                            </span>
                          </div>

                          <AnimatePresence initial={false}>
                            {expanded[chapter.chapter] && (
                              <motion.div
                                key={chapter.chapter}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <motion.ul
                                  className="ml-4 mt-2 space-y-1"
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={{
                                    visible: {
                                      transition: {
                                        staggerChildren: 0.10,
                                        when: "beforeChildren"
                                      }
                                    },
                                    exit: {
                                      transition: {
                                        staggerChildren: 0.03,
                                        staggerDirection: -1
                                      }
                                    }
                                  }}
                                >
                                  {chapter.topics
                                    .filter(topic => !/^\d+\.0(\D|$)/.test(topic.title))
                                    .sort((a, b) => {
                                      const numA = parseFloat(a.title.match(/^\d+\.(\d+)/)?.[0] || "0");
                                      const numB = parseFloat(b.title.match(/^\d+\.(\d+)/)?.[0] || "0");
                                      return numA - numB;
                                    })
                                    .map((topic) => {
                                      const isActive = location.pathname === `/docs/${topic.id}`;
                                      const isContentExpanded = topicContentExpanded[topic.id];
                                      const isLoading = loadingContent[topic.id];

                                      return (
                                        <motion.li
                                          key={topic.id}
                                          variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 },
                                            exit: { opacity: 0, x: -20 }
                                          }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <div className={`block px-3 py-2 rounded-lg transition-all duration-200 
                                              ${isActive
                                              ? 'font-medium border-primary bg-[#dfdfdf] dark:bg-[#353535]'
                                              : 'hover:text-neutral-text-primary hover:bg-[#dfdfdf] hover:dark:bg-[#353535]'}`}>

                                            {/* Topic Title Row */}
                                            <div className="flex items-center justify-between">
                                              <Link
                                                to={`/docs/${topic.id}`}
                                                className="items-center flex flex-1"
                                              >
                                                {getTopicStatusIcon(topic.id)}
                                                <span className="topicSidebarTitle">{topic.title}</span>
                                              </Link>


                                            </div>

                                            {/* Topic Content */}
                                            <AnimatePresence>
                                              {isContentExpanded && (
                                                <motion.div
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: "auto", opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="overflow-hidden mt-2"
                                                >
                                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm max-h-60 overflow-y-auto">
                                                    {isLoading ? (
                                                      <div className="text-gray-500">Loading content...</div>
                                                    ) : topicContents[topic.id] ? (
                                                      <div
                                                        className="prose prose-sm max-w-none dark:prose-invert"
                                                        dangerouslySetInnerHTML={{
                                                          __html: topicContents[topic.id]
                                                        }}
                                                      />
                                                    ) : (
                                                      <div className="text-gray-500">No content available</div>
                                                    )}
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        </motion.li>
                                      );
                                    })}
                                </motion.ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      ))}
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}