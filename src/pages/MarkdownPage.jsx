import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { useSelector } from "react-redux";
import VideoNote from "../components/VideoNote";
import "katex/dist/katex.min.css"; // Import KaTeX CSS

export default function MarkdownPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [headings, setHeadings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const videoRef = useRef(null);
  const hasRedirectedRef = useRef(false);
  const [connectionError, setConnectionError] = useState(false);
  {/* Handling Topics ratings */ }
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const { user } = useSelector((state) => state.auth);
  const userEmail =
    user?.email || JSON.parse(localStorage.getItem("user"))?.email;

  // Fetch chapters from backend
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/topics");
        if (!response.ok) throw new Error("Failed to load chapters");
        const data = await response.json();

        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  // Sort chapters and topics
  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => {
      const numA = a.chapterId || parseInt(a.chapter.match(/^\d+/)?.[0] || "0", 10);
      const numB = b.chapterId || parseInt(b.chapter.match(/^\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  }, [chapters]);

  const allTopics = useMemo(() => {
    return sortedChapters.flatMap((chapter) =>
      [...chapter.topics].sort((a, b) => {
        const getParts = (t) => {
          const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
          return match
            ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
            : [0, 0, 0];
        };
        const [a1, a2, a3] = getParts(a);
        const [b1, b2, b3] = getParts(b);
        return a1 - b1 || a2 - b2 || a3 - b3;
      })
    );
  }, [sortedChapters]);

  const currentIndex = allTopics.findIndex((topic) => topic.id === topicId);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // Move checkAllTopicsCompleted function here, after allTopics is defined
  const checkAllTopicsCompleted = async () => {
    if (!userEmail || !allTopics.length || currentIndex === -1) return false;

    try {
      const response = await fetch(`http://localhost:8080/api/user-progress/${userEmail}`);
      if (!response.ok) {
        setConnectionError(true);
        return false;
      }

      const progressData = await response.json();
      const userProgress = Array.isArray(progressData)
        ? progressData.reduce((acc, topic) => {
          acc[topic.id] = topic.completed;
          return acc;
        }, {})
        : progressData;

      // Check if all topics before the current one are completed
      const allPreviousCompleted = allTopics
        .slice(0, currentIndex)
        .every(topic => userProgress[topic.id]);

      return allPreviousCompleted && currentIndex === allTopics.length - 1;
    } catch (error) {
      console.error("Error checking progress:", error);
      return false;
    }
  };

  useEffect(() => {
    const determineFinishButton = async () => {
      const shouldShow = await checkAllTopicsCompleted();
      setShowFinishButton(shouldShow);
    };

    determineFinishButton();
  }, [userEmail, topicId, allTopics, currentIndex]);

  // Function to handle finishing the journey
  const handleFinishJourney = () => {
    // Update progress for the last topic
    if (user) {
      fetch("http://localhost:8080/api/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          topicId: topicId,
        }),
      }).catch(error => {
        console.error("Error updating progress:", error);
      });
    }

    // Show congratulations modal
    setShowCongratulations(true);
  };

  useEffect(() => {
    if (chapters.length > 0 && !topicId && allTopics.length > 0) {
      const firstTopic = allTopics[0];
      if (firstTopic?.id) {
        hasRedirectedRef.current = true;
        navigate(`/docs/${firstTopic.id}`, { replace: true });
      }
    }
  }, [chapters, topicId, allTopics]);

  // Fetch markdown for the topic
  useEffect(() => {
    if (!topicId) {
      setContent("# 404 - Topic Not Found");
      setLoading(false);
      return;
    }

    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const topic = allTopics.find((t) => t.id === topicId);

        if (!topic) {
          throw new Error("Topic not found");
        }

        const response = await fetch(`/api/docs/${topic.id}`);
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const text = await response.text();

        if (text.toLowerCase().includes("<!doctype html>")) {
          throw new Error("Received HTML instead of Markdown");
        }

        setContent(text);
        extractHeadings(text);
        if (text.toLowerCase().includes("<!doctype html>") || text.includes("Content missing")) {
          setContent(`# 404 - Content Not Found\n\nThe requested content is missing.`);
        } else {
          setContent(text);
        }

      } catch (error) {
        console.error("Error loading markdown:", error);
        setContent("# 404 - Topic Not Found");
        setHeadings([]);
      } finally {
        setLoading(false);
      }
    };

    if (chapters.length > 0) {
      fetchMarkdown();
    }
  }, [topicId, chapters]);

  // Extract headings for table of contents
  const extractHeadings = (markdown) => {
    const lines = markdown.split("\n");
    const extractedHeadings = [];
    let insideCodeBlock = false;

    for (let line of lines) {
      if (line.trim().startsWith("```")) {
        insideCodeBlock = !insideCodeBlock;
        continue;
      }

      if (!insideCodeBlock && /^#{1,2}\s/.test(line)) {
        const text = line.replace(/^#+\s/, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "-");
        extractedHeadings.push({
          id,
          text,
          level: line.startsWith("##") ? 2 : 1,
        });
      }
    }

    setHeadings(extractedHeadings);
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          topicId,
          rating,
          message: feedbackMessage
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      // Close modal first
      setShowFeedbackModal(false);

      // Reset feedback state
      setRating(0);
      setFeedbackMessage('');

      // Then navigate after a brief delay to allow the modal to fully close
      setTimeout(() => {
        if (nextTopic) {
          navigate(`/docs/${nextTopic.id}`);
        } else if (showFinishButton) {
          handleFinishJourney();
        }
      }, 100);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleNextTopicClick = () => {
    if (user) {
      const topicExists = allTopics.some(t => t.id === topicId);
      if (!topicExists) {
        console.error(`Topic ${topicId} not found`);
        return navigate(`/docs/${nextTopic.id}`);
      }

      // Show feedback modal first
      setShowFeedbackModal(true);

      // Update progress but DON'T navigate yet
      fetch("http://localhost:8080/api/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          topicId: topicId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Progress updated:", data);
          // DON'T navigate here - let the feedback modal handle navigation
        })
        .catch((error) => {
          console.error("Error updating progress:", error);
          // DON'T navigate here either
        });
    } else {
      // If no user, navigate directly without feedback
      navigate(`/docs/${nextTopic.id}`);
    }
  };

  return (
    <div className="docsLayoutContainer poppins-regular">
      <div className="markdownMain">
        <div className="markdownContainer flex flex-col lg:flex-row">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="flex items-center justify-between w-full p-3 bg-neutral-background dark:bg-dark-neutral-background rounded-lg border border-neutral-border dark:border-dark-neutral-border"
            >
              <span className="font-medium text-neutral-text-primary dark:text-dark-neutral-text-primary">
                Table of Contents
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isTocOpen ? "transform rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 markdownContentContainer order-2 lg:order-1">
            <div className="max-w-none markdownContent px-4 md:px-6">
              {loading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 dark:bg-[#353535] rounded w-3/4 bg-[#dfdfdf]"></div>
                  <div className="space-y-3">
                    <div className="h-4 dark:bg-[#353535] rounded w-full bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-4/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                  </div>
                  <div className="h-64 dark:bg-[#353535] rounded-lg bg-[#dfdfdf]"></div>
                  <div className="h-6 dark:bg-[#353535] rounded w-1/2 bg-[#dfdfdf] mt-8"></div>
                  <div className="space-y-2 pl-6">
                    <div className="h-4 dark:bg-[#353535] rounded w-4/6 bg-[#dfdfdf]"></div>
                    <div className="dark:bg-[#353535] rounded w-3/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                  </div>
                  <div className="h-48 dark:bg-[#353535] rounded-lg mt-6 bg-[#dfdfdf]"></div>
                  <div className="space-y-3 mt-6">
                    <div className="h-4 dark:bg-[#353535] rounded w-full bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-2/3 bg-[#dfdfdf]"></div>
                  </div>
                  <div className="mt-6">
                    <div className="h-8 dark:bg-[#353535] rounded-t-lg bg-[#dfdfdf]"></div>
                    <div className="h-32 dark:bg-[#353535] rounded-b-lg bg-[#dfdfdf]"></div>
                  </div>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={{
                    h1: ({ children }) => {
                      const text = String(children).trim();
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h1
                          id={id}
                          className="scroll-mt-24 text-neutral-text-primary text-3xl font-bold mb-6 mt-8 first:mt-0"
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const text = String(children).trim();
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h2
                          id={id}
                          className="scroll-mt-24 text-neutral-text-primary text-2xl font-semibold mb-4 mt-8"
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children).trim();
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h3
                          id={id}
                          className="scroll-mt-24 text-neutral-text-primary text-xl font-semibold mb-3 mt-6"
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-neutral-text-secondary mb-4 leading-relaxed text-base">
                        {children}
                      </p>
                    ),
                    img: ({ src, alt }) => {
                      if (!src) return null;

                      const currentTopic = allTopics.find((t) => t.id === topicId);
                      if (!currentTopic) return null;

                      const filename = src.split("/").pop();
                      const imageUrl = `http://localhost:8080/api/image/${currentTopic.id}/${filename}`;

                      const [loading, setLoading] = useState(true);
                      const [error, setError] = useState(false);

                      return (
                        <div className="relative">
                          {loading && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                          )}
                          {error ? (
                            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                              Image failed to load
                            </div>
                          ) : (
                            <img
                              src={imageUrl}
                              alt={alt || ""}
                              loading="lazy"
                              className={`max-w-full h-auto my-6 rounded-lg border border-neutral-border shadow-sm ${loading ? 'opacity-0' : 'opacity-100'
                                }`}
                              onLoad={() => setLoading(false)}
                              onError={() => {
                                setLoading(false);
                                setError(true);
                              }}
                            />
                          )}
                        </div>
                      );
                    },
                    video: ({ src, ...props }) => {
                      const currentTopic = allTopics.find(
                        (t) => t.id === topicId
                      );
                      if (!currentTopic?.videoPath) return null;

                      return (
                        <div className="my-6">
                          <VideoNote
                            videoPath={`http://localhost:8080/api/video/${topicId}`}
                            topicId={topicId}
                            userEmail={userEmail}
                          />
                        </div>
                      );
                    },
                    iframe: ({ ...props }) => (
                      <div className="my-6 aspect-video max-w-full rounded-lg overflow-hidden border border-neutral-border shadow-sm">
                        <iframe
                          {...props}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ),
                    code({ node, inline, className, children, ...props }) {
                      const language = className?.replace('language-', '');

                      // For inline code
                      if (inline) {
                        return (
                          <code className="bg-neutral-surface-secondary px-1.5 py-0.5 rounded text-sm border border-neutral-border text-neutral-text-primary font-mono">
                            {children}
                          </code>
                        );
                      }

                      // For code blocks
                      return (
                        <div className="relative my-6 rounded-lg overflow-hidden bg-[#1E1E1E] shadow-lg">
                          {/* Editor header */}
                          <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
                              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
                              <span className="w-3 h-3 rounded-full bg-[#27C93F]"></span>
                            </div>
                            <div className="text-xs text-neutral-400 font-mono">
                              {language || 'text'}
                            </div>
                          </div>

                          {/* Line numbers and code */}
                          <div className="flex overflow-x-auto font-mono text-sm">
                            <div className="text-neutral-500 select-none pr-4 py-3 text-right border-r border-[#333] bg-[#1E1E1E]">
                              {Array.from({ length: String(children).split('\n').length }, (_, i) => (
                                <div key={i} className="px-2">{i + 1}</div>
                              ))}
                            </div>
                            <pre className="flex-1 py-3 px-4 overflow-x-auto">
                              <code className={`language-${language} block text-[#D4D4D4]`}>
                                {children}
                              </code>
                            </pre>
                          </div>

                          {/* Action buttons */}
                          <div className="absolute top-[3rem] right-2 flex space-x-2">
                            <button
                              className="text-xs bg-[#333] hover:bg-[#3a3a3a] text-neutral-300 px-2 py-1 rounded"
                              onClick={() => navigator.clipboard.writeText(String(children))}
                            >
                              Copy
                            </button>

                            {language === 'python' && (
                              <button
                                className="text-xs bg-[#007acc] hover:bg-[#0062a3] text-white px-2 py-1 rounded"
                                onClick={() => navigate(`/terminal-page?code=${encodeURIComponent(String(children))}`)}
                              >
                                Run
                              </button>
                            )}

                            {(language === 'matlab' || language === 'm') && (
                              <button
                                className="text-xs bg-[#e97627] hover:bg-[#d16619] text-white px-2 py-1 rounded"
                                onClick={() => window.open('https://www.mathworks.com/products/matlab-online.html', '_blank')}
                              >
                                Try on Matlab
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    },
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-primary hover:text-primary-hover underline underline-offset-2 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary bg-neutral-surface pl-4 py-2 italic text-neutral-text-secondary my-6 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 my-4 space-y-2 text-neutral-text-secondary">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 my-4 space-y-2 text-neutral-text-secondary">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-neutral-text-secondary leading-relaxed">
                        {children}
                      </li>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-neutral-border">
                        <table className="min-w-full">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-neutral-surface">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-neutral-background">
                        {children}
                      </tbody>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left text-neutral-text-primary font-semibold border-b border-neutral-border">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-neutral-text-secondary border-b border-neutral-border">
                        {children}
                      </td>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-neutral-text-primary font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-neutral-text-secondary italic">
                        {children}
                      </em>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>

            {!loading && (
              <nav className="paginationButtons mt-12 grid gap-4 grid-cols-2">
                {prevTopic ? (
                  <button
                    onClick={() => navigate(`/docs/${prevTopic.id}`)}
                    className="border border-neutral-border hover:border-primary bg-neutral-background hover:bg-neutral-surface rounded-lg cursor-pointer paginationNavLink paginationNavLinkPrev p-4 text-left transition-all duration-200"
                  >
                    <div className="text-neutral-text-secondary text-sm">
                      Previous
                    </div>
                    <div className="paginationLabel break-all text-primary font-medium mt-1">
                      {prevTopic.title}
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextTopic ? (
                  <button
                    onClick={handleNextTopicClick}
                    className="border border-neutral-border hover:border-primary bg-neutral-background hover:bg-neutral-surface rounded-lg text-right cursor-pointer paginationNavLink paginationNavLinkNext p-4 transition-all duration-200"
                  >
                    <div className="text-neutral-text-secondary text-sm">
                      Next
                    </div>
                    <div className="paginationLabel break-all text-primary font-medium mt-1">
                      {nextTopic.title}
                    </div>
                  </button>
                ) : showFinishButton && !connectionError ? (
                  <button
                    onClick={handleFinishJourney}
                    className="border border-green-500 hover:border-green-600 bg-green-500 hover:bg-green-600 text-white rounded-lg text-right cursor-pointer paginationNavLink paginationNavLinkNext p-4 transition-all duration-200"
                  >
                    <div className="text-sm">
                      Finish Learning Journey
                    </div>
                    <div className="paginationLabel break-all font-medium mt-1">
                      Congratulations!
                    </div>
                  </button>
                ) : (
                  <div />
                )}
              </nav>
            )}
          </div>

          {!loading && headings.length > 0 && (
            <div
              className={`markdownTableContainer order-1 lg:order-2 w-full lg:w-1/4 lg:pl-6 mb-6 lg:mb-0 ${isTocOpen ? "block" : "hidden lg:block"
                }`}
            >
              <div className="markdownTable bg-neutral-background dark:bg-dark-neutral-background rounded-lg p-4 lg:sticky lg:top-20">
                <h3 className="text-lg font-semibold mb-3 text-neutral-text-primary dark:text-dark-neutral-text-primary hidden lg:block">
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li
                      key={`${heading.id}-${index}`}
                      className={`${heading.level === 2 ? "pl-4" : "pl-2"}`}
                    >
                      <button
                        onClick={() => {
                          handleScrollTo(heading.id);
                          setIsTocOpen(false);
                        }}
                        className="text-neutral-text-secondary dark:text-dark-neutral-text-secondary hover:text-primary dark:hover:text-dark-primary text-left w-full transition-colors duration-200 focus:outline-none text-sm py-1 rounded hover:bg-neutral-surface dark:hover:bg-dark-neutral-surface px-2 -mx-2"
                        aria-label={`Jump to ${heading.text}`}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#E5E7EB] dark:bg-[#1E1E1E] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-[#E5E7EB] dark:border-[#323232]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-purple-700 px-8 py-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Share Your Experience</h3>
                  <p className="text-blue-100 dark:text-purple-100 text-sm">Help us improve the learning experience</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              {/* Rating Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
                  How would you rate this topic?
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`group relative transition-all duration-200 hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-300'
                        }`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {/* Hover tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][star - 1]}
                      </div>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]} - Thank you for your rating!
                  </p>
                )}
              </div>

              {/* Feedback Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                  Additional feedback <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Share what you liked or suggest improvements..."
                    className="w-full p-4 bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 focus:border-transparent text-gray-800 dark:text-gray-100 resize-none transition-all duration-200"
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
                    {feedbackMessage.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-[#1E1E1E] border-t border-[#E5E7EB] dark:border-[#323232] px-8 py-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setRating(0);
                  setFeedbackMessage('');
                  // Skip feedback and go to next topic
                  if (nextTopic) {
                    navigate(`/docs/${nextTopic.id}`);
                  } else if (showFinishButton) {
                    handleFinishJourney();
                  }
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-medium"
              >
                Skip for now
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setRating(0);
                    setFeedbackMessage('');
                  }}
                  className="px-4 py-2 border border-[#E5E7EB] dark:border-[#323232] text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#323232] rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${rating === 0
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-purple-700 hover:from-blue-700 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                >
                  {rating === 0 ? 'Select a rating' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCongratulations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You've completed the entire learning journey. Great job!
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setShowCongratulations(false);
                  navigate("/");
                }}
                className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-purple-700 transition"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setShowCongratulations(false);
                  navigate("/profile");
                }}
                className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                View Achievements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}