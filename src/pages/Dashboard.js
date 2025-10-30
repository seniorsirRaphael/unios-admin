import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Get total students
      const { count: students } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Get total units
      const { count: units } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })

      // Get pending payments
      const { count: pendingPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setStats({
        students: students || 0,
        units: units || 0,
        pendingPayments: pendingPayments || 0,
        institutions: 1 // From your sample data
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UniOS Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Institutions</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.institutions}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.students}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Academic Units</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.units}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingPayments}</dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">
                Manage Students
              </button>
              <button className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700">
                Academic Setup
              </button>
              <button className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700">
                Financial Management
              </button>
              <button className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
