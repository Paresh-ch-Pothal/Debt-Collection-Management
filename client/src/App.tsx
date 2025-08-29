import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './Components/Footer'
import Header from './Components/Header'
import Dashboard from './Pages/Dashboard'
import MetricsDashboard from './Pages/MetricsDashboard'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/metrics/:recordId" element={<MetricsDashboard />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
