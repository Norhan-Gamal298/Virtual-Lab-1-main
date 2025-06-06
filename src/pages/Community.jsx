import React from "react";
import community_screenshot from "../assets/community-screenshot.jpg";
import community_img from "../assets/community-img.png";

const Community = () => {
  return (
    <div className="bg-[#1e1f22] text-white font-sans">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the Virtual Lab Discord
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Connect with other learners, ask questions, share your projects,
              and stay up-to-date — all in one place.
            </p>
            <a
              href="https://discord.gg/r7ggne83bD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5865F2] text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-indigo-600 transition"
            >
              Join Our Community
            </a>
          </div>
          <div className="max-w-2xl">
            <img src={community_img} alt="" />
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 px-6 md:px-16 bg-[#2b2d31]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Join Our Discord?</h2>
          <p className="text-gray-300 mb-12">
            A supportive space made for learners like you.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#1e1f22] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-[#5865F2]">
                🤝 Connect
              </h3>
              <p className="text-gray-300">
                Meet students, developers, and tech lovers from across the
                country.
              </p>
            </div>
            <div className="bg-[#1e1f22] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-[#5865F2]">
                💬 Ask & Share
              </h3>
              <p className="text-gray-300">
                Get help with projects, ask questions, or share your success.
              </p>
            </div>
            <div className="bg-[#1e1f22] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-[#5865F2]">
                📢 Stay Updated
              </h3>
              <p className="text-gray-300">
                Announcements, events, and virtual sessions—all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Inside Our Community</h2>
          <p className="text-gray-300 mb-10">
            Take a sneak peek at our Discord server.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={community_screenshot}
              alt="Screenshot 1"
              className="rounded-lg shadow-xl"
            />
            <img
              src={community_screenshot}
              alt="Screenshot 2"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-16 bg-[#2b2d31] text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
        <p className="text-gray-300 mb-6">
          Join our server now and become part of something bigger.
        </p>
        <a
          href="https://discord.gg/r7ggne83bD"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#5865F2] text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-indigo-600 transition"
        >
          Join the Discord Server
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1f22] py-10 px-6 md:px-16 border-t border-gray-700 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 mb-2">
            © 2025 Virtual Lab. All rights reserved.
          </p>
          <div className="text-gray-500 text-sm space-x-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/community" className="hover:underline">
              Community
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Community;
