import { Brain, Link2, Menu, X } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem("token")
        navigate('/')
    }
    return (
        <div>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                Flow AI
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                            <Link to="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
                            <Link to="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                            <Link to="#demo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Demo</Link>
                            {localStorage.getItem("token") &&
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Dashboard</Link> }
                        </nav>

                        {/* Desktop Auth Buttons */}
                        {localStorage.getItem("token") ? (
                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (<div className="hidden md:flex space-x-4">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>)}



                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                            <nav className="flex flex-col space-y-4">
                                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                                <a href="#demo" className="text-gray-700 hover:text-blue-600 font-medium">Demo</a>
                                <div className="flex space-x-4 pt-4">
                                    <Link
                                        to="/login"
                                        className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </div>
    )
}

export default Header
