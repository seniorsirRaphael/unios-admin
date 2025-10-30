import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import StaffDashboard from './pages/dashboards/StaffDashboard'
import StudentDashboard from './pages/dashboards/StudentDashboard'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAdmin, isStaff, isStudent } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const hasRole = 
      (allowedRoles.includes('admin') && isAdmin()) ||
      (allowedRoles.includes('staff') && isStaff()) ||
      (allowedRoles.includes('student') && isStudent())
    
    if (!hasRole) {
      return <Navigate to="/unauthorized" />
    }
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes with Role-Based Access */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/*" 
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Routes */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
