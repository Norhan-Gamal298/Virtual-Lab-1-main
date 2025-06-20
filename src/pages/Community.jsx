import React from "react";
import community_screenshot from "../assets/community-screenshot.jpg";
import community_img from "../assets/community-img.png";

const Community = () => {
  return (
    <div className="bg-[#1e1f22] text-white font-sans">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="text-center md:text-left max-w-xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Join the Virtual Lab Discord
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
              Connect with other learners, ask questions, share your projects,
              and stay up-to-date — all in one place.
            </p>
            <a
              href="https://discord.gg/r7ggne83bD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5865F2] text-white px-6 py-3 rounded-2xl text-base sm:text-lg font-medium hover:bg-indigo-600 transition-colors duration-200 w-full sm:w-auto text-center"
            >
              Join Our Community
            </a>
          </div>
          <div className="max-w-2xl w-full">
            <img
              src={community_img}
              alt="Virtual Lab Discord Community"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-16 bg-[#2b2d31]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Join Our Discord?</h2>
          <p className="text-gray-300 mb-8 sm:mb-12 text-base sm:text-lg">
            A supportive space made for learners like you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            <div className="bg-[#1e1f22] p-5 sm:p-6 rounded-xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#5865F2]">
                🤝 Connect
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Meet students, developers, and tech lovers from across the
                country.
              </p>
            </div>
            <div className="bg-[#1e1f22] p-5 sm:p-6 rounded-xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#5865F2]">
                💬 Ask & Share
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Get help with projects, ask questions, or share your success.
              </p>
            </div>
            <div className="bg-[#1e1f22] p-5 sm:p-6 rounded-xl shadow-lg sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#5865F2]">
                📢 Stay Updated
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Announcements, events, and virtual sessions—all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Inside Our Community</h2>
          <p className="text-gray-300 mb-8 sm:mb-10 text-base sm:text-lg">
            Take a sneak peek at our Discord server.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <img
              src={community_screenshot}
              alt="Discord Community Screenshot 1"
              className="rounded-lg shadow-xl w-full h-auto"
            />
            <img
              src={community_screenshot}
              alt="Discord Community Screenshot 2"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-16 bg-[#2b2d31] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to dive in?</h2>
        <p className="text-gray-300 mb-6 text-base sm:text-lg">
          Join our server now and become part of something bigger.
        </p>
        <a
          href="https://discord.gg/r7ggne83bD"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#5865F2] text-white px-6 sm:px-8 py-3 rounded-2xl text-base sm:text-lg font-semibold hover:bg-indigo-600 transition-colors duration-200 w-full sm:w-auto"
        >
          Join the Discord Server
        </a>
      </section>
    </div>
  );
};

export default Community;