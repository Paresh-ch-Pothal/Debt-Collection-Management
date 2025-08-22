import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomToast from '../Components/CustomToast';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ success: boolean; message: string }>({
        success: true,
        message: "",
    });
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/user/login`, {
                email,
                password,
            });
            console.log(response)

            if (response.data.success === true) {
                // ✅ login success
                localStorage.setItem("token", response.data.token);

                setToastConfig({ success: true, message: response.data.message });
                setShowToast(true);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2500);
            } else {
                setToastConfig({ success: false, message: response.data.message });
                setShowToast(true);
                setIsLoading(false);
            }
        } catch (error: any) {
            console.log(error)
            setToastConfig({ success: false, message: error?.response?.data?.message });
            setShowToast(true)
            setIsLoading(false)
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            {showToast && (
                <CustomToast
                    success={toastConfig.success}
                    message={toastConfig.message}
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-left">
                    <div className="space-y-6">

                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Welcome back to the
                            <span className="block text-blue-600 mt-2">future of AI</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Transform your business with cutting-edge artificial intelligence.
                            Join thousands of companies already using Flow AI to drive innovation.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-slide-up-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                                <span className="text-2xl font-bold text-blue-600">10,000+</span>
                            </div>
                            <p className="text-gray-600 font-medium">Active Users</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-slide-up-2">
                            <div className="flex items-center space-x-3 mb-3">
                                <Shield className="w-6 h-6 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">99.9%</span>
                            </div>
                            <p className="text-gray-600 font-medium">Uptime</p>
                        </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full animate-float-1"></div>
                        <div className="absolute bottom-32 left-32 w-24 h-24 bg-blue-400 rounded-full animate-float-2"></div>
                        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-500 rounded-full animate-float-3"></div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center justify-center animate-fade-in-right">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 lg:p-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
                                <p className="text-gray-600">Enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Enter your email"
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
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Enter your password"
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
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
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
                                        <span className="px-2 bg-white text-gray-500">or continue with</span>
                                    </div>
                                </div>

                                {/* Social Login */}
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

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/signup"
                                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                    >
                                        Sign up for free
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

                @keyframes bounce-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                @keyframes slide-up-1 {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up-2 {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float-1 {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes float-2 {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-15px) rotate(-180deg);
                    }
                }

                @keyframes float-3 {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(180deg);
                    }
                }

                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out;
                }

                .animate-fade-in-right {
                    animation: fade-in-right 0.8s ease-out;
                }

                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }

                .animate-slide-up-1 {
                    animation: slide-up-1 0.6s ease-out 0.2s both;
                }

                .animate-slide-up-2 {
                    animation: slide-up-2 0.6s ease-out 0.4s both;
                }

                .animate-float-1 {
                    animation: float-1 6s ease-in-out infinite;
                }

                .animate-float-2 {
                    animation: float-2 8s ease-in-out infinite;
                }

                .animate-float-3 {
                    animation: float-3 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;
