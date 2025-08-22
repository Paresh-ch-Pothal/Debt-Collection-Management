import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, Brain } from 'lucide-react';

interface FooterProps {
    companyName?: string;
    year?: number;
    tagline?: string;
    showBackToTop?: boolean;
}

const Footer: React.FC<FooterProps> = ({
    companyName = "Flow AI",
    year = 2025,
    tagline = "Transforming businesses through intelligent automation.",
    showBackToTop = true
}) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "API Documentation", href: "#api" },
            { name: "Integrations", href: "#integrations" },
            { name: "Enterprise Solutions", href: "#enterprise" }
        ],
        company: [
            { name: "About Us", href: "#about" },
            { name: "Careers", href: "#careers" },
            { name: "News & Press", href: "#news" },
            { name: "Contact Us", href: "#contact" },
            { name: "Partner Program", href: "#partners" }
        ],
        support: [
            { name: "Help Center", href: "#help" },
            { name: "Technical Support", href: "#support" },
            { name: "System Status", href: "#status" },
            { name: "Community Forum", href: "#community" },
            { name: "Training Resources", href: "#training" }
        ],
        legal: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
            { name: "Security", href: "#security" },
            { name: "Compliance", href: "#compliance" }
        ]
    };

    return (
        <footer className="bg-gray-50 border-t border-gray-200">

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16">
                    {/* Company Information */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {companyName}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            {tagline} We provide cutting-edge artificial intelligence solutions that help businesses optimize their operations, enhance decision-making, and drive sustainable growth in the digital age.
                        </p>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h4>
                            <div className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span>contact@Flowai.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span>123 Innovation Drive, San Francisco, CA 94105</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Product
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-1"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Company
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-1"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Support
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-1"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Legal
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-1"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="bg-white rounded-xl p-8 border border-gray-200 mb-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            Stay Ahead with AI Insights
                        </h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Subscribe to our newsletter for the latest AI industry insights, product updates, best practices, and exclusive resources delivered to your inbox monthly.
                        </p>
                        <div className="flex flex-col sm:flex-row max-w-lg mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
                            <input
                                type="email"
                                placeholder="Enter your business email"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                            />
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                        {/* Copyright and Company Info */}
                        <div className="flex-1">
                            <div className="text-gray-600 mb-2">
                                © {year} {companyName}. All rights reserved.
                            </div>
                            <div className="text-sm text-gray-500">
                                Built with ❤️ in San Francisco. Serving businesses worldwide.
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                            <a href="#linkedin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                LinkedIn
                            </a>
                            <a href="#twitter" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                Twitter
                            </a>
                            <a href="#github" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                GitHub
                            </a>
                            <a href="#blog" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                Blog
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;