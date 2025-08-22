import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomToast from '../Components/CustomToast';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ success: boolean; message: string }>({
        success: true,
        message: "",
    });
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return { text: 'Weak', color: 'text-red-500' };
            case 2:
            case 3: return { text: 'Medium', color: 'text-yellow-500' };
            case 4:
            case 5: return { text: 'Strong', color: 'text-green-500' };
            default: return { text: 'Weak', color: 'text-red-500' };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!agreedToTerms) {
                alert('Please agree to the terms and conditions');
                return;
            }

            setIsLoading(true);


            // Simulate signup process
            const response = await axios.post(`${baseUrl}/api/user/signup`, formData)
            if (response.data.success) {
                localStorage.setItem("token", response.data.token)
                setToastConfig({ success: true, message: response.data.message });
                setShowToast(true);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2500);
            }
            else {
                setToastConfig({ success: true, message: response.data.message });
                setShowToast(true);
            }
        } catch (error: any) {
            console.log(error)
            setToastConfig({ success: false, message: error?.response?.data?.message });
            setShowToast(true)
            setIsLoading(false)
        }

    };

    const benefits = [
        'Access to advanced AI models',
        'Real-time data processing',
        'Enterprise-grade security',
        '24/7 customer support',
        'Custom integrations',
        'Analytics dashboard'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            {showToast && (
                <CustomToast
                    success={toastConfig.success}
                    message={toastConfig.message}
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                {/* Left Side - Benefits Section */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-left">
                    <div className="space-y-6">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Join the AI
                            <span className="block text-blue-600 mt-2">revolution today</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Create your free account and start transforming your business with
                            cutting-edge artificial intelligence in minutes.
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll get:</h3>
                        <div className="grid gap-3">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up-delayed">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">Trusted by over</p>
                            <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                            <p className="text-gray-700">companies worldwide</p>
                        </div>
                    </div>

                    {/* Floating Animation Elements */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full animate-float-slow"></div>
                        <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-400 rounded-full animate-float-medium"></div>
                        <div className="absolute top-1/3 right-10 w-12 h-12 bg-blue-500 rounded-full animate-float-fast"></div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="flex items-center justify-center animate-fade-in-right">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 lg:p-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                                <p className="text-gray-600">Start your AI journey today</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Fields */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="john@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Create a strong password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength <= 2 ? 'bg-red-500' :
                                                            passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium ${getPasswordStrengthText().color}`}>
                                                    {getPasswordStrengthText().text}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Terms and Conditions */}
                                <div className="flex items-start space-x-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !agreedToTerms}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">or sign up with</span>
                                    </div>
                                </div>

                                {/* Social Signup */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-yellow-300 transition-colors"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="ml-2 text-sm">Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-blue-300 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span className="ml-2 text-sm">Facebook</span>
                                    </button>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up-delayed {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-15px) rotate(180deg);
                    }
                }

                @keyframes float-medium {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-12px) rotate(-180deg);
                    }
                }

                @keyframes float-fast {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(180deg);
                    }
                }

                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out;
                }

                .animate-fade-in-right {
                    animation: fade-in-right 0.8s ease-out;
                }

                .animate-pulse-subtle {
                    animation: pulse-subtle 3s ease-in-out infinite;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-slide-up-delayed {
                    animation: slide-up-delayed 0.8s ease-out 0.6s both;
                }

                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Signup;
