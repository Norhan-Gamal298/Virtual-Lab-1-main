import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useSelector } from "react-redux";
import VideoNote from "../components/VideoNote";

export default function MarkdownPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [headings, setHeadings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const hasRedirectedRef = useRef(false);

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

        /* console.log(
          "Fetched chapters:",
          data.map((ch) => ch.chapter)
        ); */

        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  // Sort chapters and topics
  const sortedChapters = [...chapters].sort((a, b) => {
    const numA =
      a.chapterId || parseInt(a.chapter.match(/^\d+/)?.[0] || "0", 10);
    const numB =
      b.chapterId || parseInt(b.chapter.match(/^\d+/)?.[0] || "0", 10);
    return numA - numB;
  });

  const allTopics = sortedChapters.flatMap((chapter) =>
    [...chapter.topics].sort((a, b) => {
      // Extract numbers from topicId, e.g. chapter_1_1_what_is_image_processing
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

  const currentIndex = allTopics.findIndex((topic) => topic.id === topicId);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  useEffect(() => {
    if (chapters.length > 0 && !topicId && allTopics.length > 0) {
      // Redirect to the very first topic in allTopics
      const firstTopic = allTopics[0];
      if (firstTopic?.id) {
        hasRedirectedRef.current = true;
        navigate(`/docs/${firstTopic.id}`, { replace: true });
      }
    }
    // eslint-disable-next-line
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
        /* console.log(
          "allTopics",
          allTopics.map((t) => ({ id: t.id, title: t.title }))
        );
        console.log("topicId", topicId); */
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
    // eslint-disable-next-line
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

  const handleNextTopicClick = () => {
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
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Progress updated:", data);
          navigate(`/docs/${nextTopic.id}`);
        })
        .catch((error) => {
          console.error("Error updating progress:", error);
          navigate(`/docs/${nextTopic.id}`);
        });
    } else {
      navigate(`/docs/${nextTopic.id}`);
    }
  };

  return (
    <div className="docsLayoutContainer poppins-regular">
      <div className="markdownMain">
        <div className="markdownContainer">
          <div className="flex flex-1 flex-col markdownContentContainer">
            <div className="max-w-none markdownContent">
              {loading ? (
                <div className="space-y-6 animate-pulse">
                  {/* Title skeleton */}
                  <div className="h-8 dark:bg-[#353535] rounded w-3/4 bg-[#dfdfdf]"></div>

                  {/* Paragraph skeletons */}
                  <div className="space-y-3">
                    <div className="h-4 dark:bg-[#353535] rounded w-full bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-4/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                  </div>

                  {/* Code block skeleton */}
                  <div className="h-64 dark:bg-[#353535] rounded-lg bg-[#dfdfdf]"></div>

                  {/* Subheading skeleton */}
                  <div className="h-6 dark:bg-[#353535] rounded w-1/2 bg-[#dfdfdf] mt-8"></div>

                  {/* List skeletons */}
                  <div className="space-y-2 pl-6">
                    <div className="h-4 dark:bg-[#353535] rounded w-4/6 bg-[#dfdfdf]"></div>
                    <div className="dark:bg-[#353535] rounded w-3/6 bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-5/6 bg-[#dfdfdf]"></div>
                  </div>

                  {/* Image skeleton */}
                  <div className="h-48 dark:bg-[#353535] rounded-lg mt-6 bg-[#dfdfdf]"></div>

                  {/* Another paragraph */}
                  <div className="space-y-3 mt-6">
                    <div className="h-4 dark:bg-[#353535] rounded w-full bg-[#dfdfdf]"></div>
                    <div className="h-4 dark:bg-[#353535] rounded w-2/3 bg-[#dfdfdf]"></div>
                  </div>

                  {/* Table skeleton */}
                  <div className="mt-6">
                    <div className="h-8 dark:bg-[#353535] rounded-t-lg bg-[#dfdfdf]"></div>
                    <div className="h-32 dark:bg-[#353535] rounded-b-lg bg-[#dfdfdf]"></div>
                  </div>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
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

                      const currentTopic = allTopics.find(
                        (t) => t.id === topicId
                      );
                      if (!currentTopic) return null;


                      // Extract filename from src (e.g., "grayscale.png")
                      const filename = src.split("/").pop(); // in case it's "photos/grayscale.png"
                      const imageUrl = `http://localhost:8080/api/image/${currentTopic.id}/${filename}`;

                      return (
                        <img
                          src={imageUrl}
                          alt={alt || ""}
                          loading="lazy"
                          className="max-w-full h-auto my-6 rounded-lg border border-neutral-border shadow-sm"
                        />
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
                    code({ className, children }) {
                      const language = className?.replace("language-", "");

                      if (language === "python") {
                        const codeString = String(children).trim();
                        const encodedCode = encodeURIComponent(codeString);

                        return (
                          <div className="relative mb-6">
                            <pre className="bg-neutral-surface border border-neutral-border rounded-lg p-4 overflow-x-auto">
                              <code
                                className={`${className} text-neutral-text-primary text-sm`}
                              >
                                {children}
                              </code>
                            </pre>
                            <div className="mt-3">
                              <button
                                className="text-[#fff] bg-[#1F2937] dark:bg-[#612EBE] hover:bg-primary-hover text-primary-on px-4 py-2 rounded-lg transition-colors duration-200 poppins-regular"
                                onClick={() =>
                                  navigate(
                                    `/terminal-page?code=${encodedCode}`,
                                    { state: { fromLesson: true } }
                                  )
                                }
                              >
                                Try it yourself
                              </button>
                              <div className="text-sm mt-2 text-neutral-text-secondary">
                                Note: You'll be able to upload required files in
                                the terminal
                              </div>
                            </div>
                          </div>
                        );
                      }
                      if (language === "matlab") {
                        return (
                          <div className="relative mb-6">
                            <pre className="bg-neutral-surface border border-neutral-border rounded-lg p-4 overflow-x-auto">
                              <code
                                className={`${className} text-neutral-text-primary text-sm`}
                              >
                                {children}
                              </code>
                            </pre>
                            <div className="mt-3">
                              <a
                                href="https://www.mathworks.com/products/matlab-online.html"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-block bg-primary text-[#fff] bg-[#1F2937] dark:bg-[#612EBE] hover:bg-primary-hover text-primary-on px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                              >
                                Try on MATLAB Online
                              </a>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <pre className="bg-neutral-surface border border-neutral-border rounded-lg p-4 overflow-x-auto my-4">
                          <code
                            className={`${className} text-neutral-text-primary text-sm`}
                          >
                            {children}
                          </code>
                        </pre>
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
                ) : (
                  <div />
                )}
              </nav>
            )}
          </div>

          {!loading && headings.length > 0 && (
            <div className="markdownTableContainer">
              <div className="markdownTable bg-neutral-background rounded-lg p-4">
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li
                      key={`${heading.id}-${index}`}
                      className={`${heading.level === 2 ? "pl-4" : "pl-2"}`}
                    >
                      <button
                        onClick={() => handleScrollTo(heading.id)}
                        className="text-neutral-text-secondary hover:text-primary text-left w-full transition-colors duration-200 focus:outline-none text-sm py-1 rounded hover:bg-neutral-surface px-2 -mx-2"
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
    </div>
  );
}
