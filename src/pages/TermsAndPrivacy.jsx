import { useState } from 'react';
import { FileText, Shield, ChevronRight, Mail, User, Database, Lock, Eye, ChevronDown } from 'lucide-react';

export default function TermsAndPrivacy() {
    const [currentPage, setCurrentPage] = useState('terms');
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const TermsPage = () => (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#612EBE] rounded-3xl mb-8 shadow-lg">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Welcome to Virtual Lab - Your Educational Journey in Image Processing
                    </p>
                    <div className="mt-6 inline-flex items-center px-4 py-2 bg-white dark:bg-[#0f0f0f] rounded-full shadow-sm border border-gray-200 dark:border-[#292929]">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: June 15, 2025</span>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm border border-gray-200 dark:border-[#292929] p-8 mb-12">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Welcome to Virtual Lab, a graduation project designed to educate users about image processing techniques through interactive content, tutorials, and tools. These Terms of Service govern your use of our educational platform.
                    </p>
                    <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] border border-[#E9D5FF] dark:border-[#3d3d3d] rounded-2xl p-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-[#612EBE] rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#612EBE] dark:text-[#a78bfa] mb-2">Important Notice</h4>
                                <p className="text-[#6D28D9] dark:text-[#c4b5fd] text-sm leading-relaxed">
                                    By using or accessing Virtual Lab, you accept and agree to be bound by these Terms. If you do not agree with any part, you should not use the platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-8">
                    {[
                        {
                            id: 'about',
                            title: 'About Virtual Lab',
                            content: 'Virtual Lab is an academic, non-commercial platform developed as part of a university graduation project. Its purpose is purely educational. The platform is not officially published or maintained beyond the scope of the academic program.'
                        },
                        {
                            id: 'eligibility',
                            title: 'Eligibility',
                            content: (
                                <>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">To use Virtual Lab, you must:</p>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <ChevronRight className="w-5 h-5 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-lg">Be at least 16 years old, or</span>
                                        </div>
                                        <div className="flex items-start">
                                            <ChevronRight className="w-5 h-5 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-lg">Use it under the supervision of a parent, teacher, or guardian</span>
                                        </div>
                                    </div>
                                </>
                            )
                        },
                        {
                            id: 'platform-use',
                            title: 'Platform Use',
                            content: (
                                <>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">By using Virtual Lab, you agree to the following:</p>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <ChevronRight className="w-5 h-5 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-lg">The platform is for educational and personal use only</span>
                                        </div>
                                        <div className="flex items-start">
                                            <ChevronRight className="w-5 h-5 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-lg">You will not use the platform for commercial, promotional, or unauthorized activities</span>
                                        </div>
                                        <div className="flex items-start">
                                            <ChevronRight className="w-5 h-5 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-lg">You agree not to upload malicious content, interfere with system operations, or exploit vulnerabilities</span>
                                        </div>
                                    </div>
                                </>
                            )
                        },
                        {
                            id: 'content-ownership',
                            title: 'Content Ownership',
                            content: 'All content provided on Virtual Lab—including tutorials, exercises, videos, illustrations, UI/UX designs, and any interactive tools—is the intellectual property of the Virtual Lab team unless otherwise credited.'
                        },
                        {
                            id: 'other',
                            title: 'Additional Terms',
                            content: (
                                <div className="grid gap-8">
                                    {[
                                        {
                                            title: 'User Accounts',
                                            content: 'You are responsible for keeping login credentials secure and providing accurate information during registration.'
                                        },
                                        {
                                            title: 'Feedback and Contributions',
                                            content: 'Any feedback or suggestions you provide may be used to improve the project without granting you ownership or compensation.'
                                        },
                                        {
                                            title: 'Limitations of Liability',
                                            content: 'Virtual Lab is provided "as-is" with no guarantees of complete accuracy or continuous functionality.'
                                        },
                                        {
                                            title: 'Modifications',
                                            content: 'These Terms may be updated during the project lifecycle. Changes will be posted here.'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {item.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    ].map((section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm border border-gray-200 dark:border-[#292929] overflow-hidden"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between dark:hover:bg-[#1f1f1f] transition-colors duration-200"
                            >
                                <div className="flex items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="flex-shrink-0">
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections[section.id] ? 'transform rotate-180' : ''}`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[section.id] ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-5">
                                    <div className="pt-2 border-t border-gray-200 dark:border-[#3d3d3d]">
                                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const PrivacyPage = () => (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#612EBE] rounded-3xl mb-8 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Your privacy matters to us. Learn how we handle your information.
                    </p>
                    <div className="mt-6 inline-flex items-center px-4 py-2 bg-white dark:bg-[#0f0f0f] rounded-full shadow-sm border border-gray-200 dark:border-[#292929]">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: June 15, 2025</span>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm border border-gray-200 dark:border-[#292929] p-8 mb-12">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        This Privacy Policy outlines how we handle your information while you interact with Virtual Lab, our educational graduation project focused on image processing techniques.
                    </p>
                </div>

                {/* Privacy Sections */}
                <div className="space-y-8">
                    {[
                        {
                            id: 'project-context',
                            title: 'Project Context',
                            content: 'Virtual Lab is a graduation project, not a live product. It is not connected to any real users outside of academic reviewers, testers, or demonstration participants.'
                        },
                        {
                            id: 'data-collection',
                            title: 'What Data We Collect',
                            content: (
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#E9D5FF] dark:border-[#3d3d3d]">
                                            <div className="flex items-center mb-6">
                                                <User className="w-6 h-6 text-[#612EBE] dark:text-[#a78bfa] mr-3" />
                                                <h3 className="text-lg font-semibold text-[#612EBE] dark:text-[#a78bfa]">Personal Information</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Full Name or Nickname</span>
                                                </div>
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Email Address</span>
                                                </div>
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Academic Affiliation</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#E9D5FF] dark:border-[#3d3d3d]">
                                            <div className="flex items-center mb-6">
                                                <Database className="w-6 h-6 text-[#612EBE] dark:text-[#a78bfa] mr-3" />
                                                <h3 className="text-lg font-semibold text-[#612EBE] dark:text-[#a78bfa]">Technical Data</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Browser type and version</span>
                                                </div>
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Operating system</span>
                                                </div>
                                                <div className="flex items-center text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Time spent on pages</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] border border-[#E9D5FF] dark:border-[#3d3d3d] rounded-2xl p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 bg-[#612EBE] rounded-full flex items-center justify-center mr-3 mt-0.5">
                                                <span className="text-white text-xs font-bold">×</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[#612EBE] dark:text-[#a78bfa] mb-3">We do NOT collect:</h4>
                                                <div className="space-y-2 text-[#6D28D9] dark:text-[#c4b5fd]">
                                                    <div className="flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-[#612EBE] rounded-full mr-3"></span>
                                                        <span>Financial information</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-[#612EBE] rounded-full mr-3"></span>
                                                        <span>Sensitive personal data</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-[#612EBE] rounded-full mr-3"></span>
                                                        <span>Behavioral tracking for marketing</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            id: 'data-usage',
                            title: 'How We Use the Data',
                            content: (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#E9D5FF] dark:border-[#3d3d3d]">
                                        <h4 className="font-semibold text-[#612EBE] dark:text-[#a78bfa] mb-6 flex items-center">
                                            <Eye className="w-5 h-5 mr-2" />
                                            We use data for:
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">Providing access to learning content</span>
                                            </div>
                                            <div className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">Improving user experience</span>
                                            </div>
                                            <div className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">Academic project evaluation</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#F3E8FF] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#E9D5FF] dark:border-[#3d3d3d]">
                                        <h4 className="font-semibold text-[#612EBE] dark:text-[#a78bfa] mb-6 flex items-center">
                                            <Lock className="w-5 h-5 mr-2" />
                                            We will NOT:
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">Sell or share with third parties</span>
                                            </div>
                                            <div className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-[#612EBE] dark:text-[#a78bfa] mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">Use for advertising purposes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            id: 'other-privacy',
                            title: 'Additional Privacy Information',
                            content: (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[
                                        {
                                            title: 'Data Sharing',
                                            content: 'We do not share personal data except with university staff for project evaluation (in anonymized format).'
                                        },
                                        {
                                            title: 'Data Security',
                                            content: 'We use basic practices to protect user data, but do not guarantee enterprise-level security.'
                                        },
                                        {
                                            title: 'Data Retention',
                                            content: 'Data is retained only for the duration of the academic project and deleted after submission.'
                                        },
                                        {
                                            title: 'Your Rights',
                                            content: 'You may request access to, deletion of, or information about how your data was used.'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {item.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    ].map((section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm border border-gray-200 dark:border-[#292929] overflow-hidden"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between dark:hover:bg-[#1f1f1f] transition-colors duration-200"
                            >
                                <div className="flex items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="flex-shrink-0">
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSections[section.id] ? 'transform rotate-180' : ''}`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[section.id] ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-5">
                                    <div className="pt-2 border-t border-gray-200 dark:border-[#3d3d3d]">
                                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0f0f0f]">
            {/* Navigation */}
            <div className="z-50 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-6">
                        <div className="flex bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl p-1.5">
                            <button
                                onClick={() => handlePageChange('terms')}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${currentPage === 'terms'
                                    ? 'bg-[#F3E8FF] text-[#612EBE] border border-[#612EBE]'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#F3E8FF]'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                Terms of Service
                            </button>
                            <button
                                onClick={() => handlePageChange('privacy')}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${currentPage === 'privacy'
                                    ? 'bg-[#F3E8FF] text-[#612EBE] border border-[#612EBE]'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#F3E8FF]'
                                    }`}
                            >
                                <Shield className="w-5 h-5 mr-2" />
                                Privacy Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            {currentPage === 'terms' ? <TermsPage /> : <PrivacyPage />}
        </div>
    );
}