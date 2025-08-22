import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Brain, Zap, Shield, Users, ArrowRight, Play, CheckCircle, Menu, X } from 'lucide-react';

const Home = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [currentCompany, setCurrentCompany] = useState(0);
    const testimonialsPerPage = 3;

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "CTO, TechCorp",
            content: "Flow AI transformed our workflow. The AI insights are incredibly accurate and have boosted our productivity by 300%.",
            rating: 5,
            avatar: "SC"
        },
        {
            name: "Marcus Johnson",
            role: "CEO, DataFlow Solutions",
            content: "The most intuitive AI platform we've used. Implementation was seamless and results were immediate.",
            rating: 5,
            avatar: "MJ"
        },
        {
            name: "Elena Rodriguez",
            role: "Head of Innovation, FutureTech",
            content: "Flow AI's predictive capabilities have revolutionized our decision-making process. Absolutely game-changing.",
            rating: 5,
            avatar: "ER"
        }
    ];

    const companies = [
        { name: "TechCorp", logo: "TC", industry: "Technology" },
        { name: "DataFlow Solutions", logo: "DS", industry: "Analytics" },
        { name: "FutureTech", logo: "FT", industry: "Innovation" },
        { name: "AI Dynamics", logo: "AD", industry: "Artificial Intelligence" },
        { name: "CloudSync", logo: "CS", industry: "Cloud Computing" },
        { name: "NeuralNet Pro", logo: "NP", industry: "Machine Learning" }
    ];

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Advanced AI Processing",
            description: "Cutting-edge neural networks that understand context and deliver precise results with enterprise-grade accuracy."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast Performance",
            description: "Process complex data in milliseconds with our optimized AI infrastructure and cloud-native architecture."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Enterprise Security",
            description: "Bank-level encryption and security protocols with SOC 2 compliance to protect your sensitive data."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Built-in collaboration tools with role-based access and real-time sharing capabilities."
        }
    ];

    const benefits = [
        "Increase productivity by up to 300%",
        "Reduce processing time by 85%",
        "99.9% accuracy in AI predictions",
        "24/7 automated insights and monitoring",
        "Seamless integration with existing tools",
        "Real-time data analysis and reporting"
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCompany((prev) => (prev + 1) % companies.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
                        Transform Your Business with
                        <span className="block text-blue-600 mt-2">Flow AI</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Experience the future of artificial intelligence with our enterprise-grade platform.
                        Streamline operations, gain insights, and drive innovation with cutting-edge AI solutions.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors inline-flex items-center justify-center">
                            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 text-lg font-semibold rounded-lg transition-colors inline-flex items-center justify-center">
                            <Play className="w-5 h-5 mr-2" /> Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                            <div className="text-gray-600 font-medium">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                            <div className="text-gray-600 font-medium">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600 font-medium">Enterprise Clients</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Powerful Features for Modern Businesses
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive AI platform provides everything you need to transform your operations and drive growth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-8 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 group">
                                <div className="text-blue-600 mb-6 group-hover:text-blue-700 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            How Flow AI Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get started in minutes with our simple three-step process designed for seamless integration.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {['Connect Your Data', 'AI Processing', 'Get Insights'].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                                    {index + 1}
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{step}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {index === 0 && "Securely connect your existing data sources through our robust API integrations and enterprise connectors."}
                                    {index === 1 && "Our advanced AI algorithms analyze and process your data using machine learning and neural networks."}
                                    {index === 2 && "Receive actionable insights, predictions, and automated reports to drive informed business decisions."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose Flow AI?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of businesses that trust our platform to deliver measurable results.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <span className="text-lg text-gray-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="px-6 py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Industry Leaders
                        </h2>
                        <p className="text-xl text-gray-600">
                            Leading organizations worldwide rely on our AI solutions
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {companies.map((company, index) => (
                            <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                                    {company.logo}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                                <p className="text-sm text-gray-600">{company.industry}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            What Our Clients Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Real feedback from real customers who've transformed their businesses
                        </p>
                    </div>

                    <div className="relative">
                        {/* Testimonials Grid - Shows 3 testimonials per page */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {testimonials
                                .slice(currentTestimonial * testimonialsPerPage, (currentTestimonial + 1) * testimonialsPerPage)
                                .map((testimonial, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-center">
                                            {/* Avatar */}
                                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                                                {testimonial.avatar}
                                            </div>

                                            {/* Star Rating */}
                                            <div className="flex justify-center mb-6">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                ))}
                                            </div>

                                            {/* Testimonial Content */}
                                            <p className="text-lg italic mb-6 text-gray-700 leading-relaxed">
                                                "{testimonial.content}"
                                            </p>

                                            {/* Author Info */}
                                            <div>
                                                <p className="font-semibold text-lg text-gray-900">{testimonial.name}</p>
                                                <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Navigation Buttons - Only show if more than 3 testimonials */}
                        {testimonials.length > testimonialsPerPage && (
                            <>
                                <button
                                    onClick={prevTestimonial}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={nextTestimonial}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Pagination Dots - Only show if more than 3 testimonials */}
                    {testimonials.length > testimonialsPerPage && (
                        <div className="flex justify-center space-x-2">
                            {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;