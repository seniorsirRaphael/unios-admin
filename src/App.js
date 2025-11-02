import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SystemProvider } from './context/SystemContext'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import StaffDashboard from './pages/dashboards/StaffDashboard'
import StudentDashboard from './pages/dashboards/StudentDashboard'
import NotFound from './pages/NotFound'
import LoadingScreen from './components/LoadingScreen'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], requiredPermissions = [] }) => {
  const { user, loading, userRanks, hasPermission } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const userRoles = userRanks.map(rank => rank.organizational_ranks?.user_type)
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role))
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )
    
    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />
    }
  }
  
  return children
}

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <SystemProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['teaching_staff', 'non_teaching_staff']} requiredPermissions={['admin_access']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/*" 
                element={
                  <ProtectedRoute allowedRoles={['teaching_staff', 'non_teaching_staff']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/*" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Routes */}
              <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="/unauthorized" element={<NotFound type="unauthorized" />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </SystemProvider>
  )
}

export default App
