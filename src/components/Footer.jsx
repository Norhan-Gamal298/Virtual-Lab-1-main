import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import { useTheme } from "../ThemeProvider";
import darkLogo from "../assets/darkLogo.png";
import lightLogo from "../assets/lightLogo.png";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <footer className="bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-[#323232] mt-auto transition-all duration-300 poppins-regular">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <img
                                className="p-[0.5rem] h-[60px] w-auto navLogo transition-all duration-300"
                                src={isDark ? darkLogo : lightLogo}
                                alt="logo"
                            />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                            Empowering learners with interactive quizzes, comprehensive documentation,
                            and a vibrant community. Join us on your learning journey.
                        </p>
                        <div className="flex space-x-4">
                            {/* <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a> */}
                            <a
                                href="mailto:virtual.image.lab@gmail.com"
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/docs"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/quizzes"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Quizzes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community & Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Community
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/community"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terminal-page"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    Terminal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-600 dark:text-gray-400 hover:text-[#612EBE] transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-[#323232] pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                            <span>by Virual Lab</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <p>&copy; {currentYear} Virtual Lab. All rights reserved.</p>
                            <div className="flex space-x-6">
                                <Link to="/privacy" className="hover:text-[#612EBE] dark:hover:text-[#612EBE] transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="hover:text-[#612EBE] dark:hover:text-[#612EBE] transition-colors">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}