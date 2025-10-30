import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../utils/supabaseClient'
import {
  Users, Building, DollarSign, BookOpen,
  BarChart3, Settings, LogOut, Bell,
  UserPlus, TrendingUp, AlertTriangle,
  GraduationCap, Heart, MessageSquare
} from 'lucide-react'

const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [systemStats, setSystemStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Get comprehensive system stats
      const [
        { count: totalStudents },
        { count: totalStaff },
        { count: totalUnits },
        { data: financialData },
        { data: recentUsers },
        { data: systemHealth }
      ] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_ranks').select('*', { count: 'exact', head: true })
          .in('rank_id', [1, 2, 3, 4]),
        supabase.from('units').select('*', { count: 'exact', head: true }),
        supabase.rpc('calculate_system_revenue'),
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.rpc('system_health_check')
      ])

      setSystemStats({
        totalStudents: totalStudents || 0,
        totalStaff: totalStaff || 0,
        totalUnits: totalUnits || 0,
        revenue: financialData?.revenue || 0,
        systemHealth: systemHealth || {}
      })

      setRecentActivity(recentUsers || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">UniOS Admin</h1>
              <p className="text-sm text-gray-600">System Administrator</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', name: 'System Overview', icon: BarChart3 },
            { id: 'users', name: 'User Management', icon: Users },
            { id: 'academics', name: 'Academic Setup', icon: BookOpen },
            { id: 'finance', name: 'Financial Admin', icon: DollarSign },
            { id: 'facilities', name: 'Facilities', icon: Building },
            { id: 'health', name: 'Health System', icon: Heart },
            { id: 'communications', name: 'Communications', icon: MessageSquare },
            { id: 'reports', name: 'Reports & Analytics', icon: TrendingUp },
            { id: 'system', name: 'System Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-semibold">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-600 truncate">System Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {activeTab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h1>
              <p className="text-gray-600">System Administration Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-semibold flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeTab === 'overview' && <AdminOverview data={systemStats} recentActivity={recentActivity} />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'academics' && <AcademicAdmin />}
          {activeTab === 'finance' && <FinancialAdmin />}
          {activeTab === 'system' && <SystemSettings />}
        </main>
      </div>
    </div>
  )
}

// Admin Tab Components
const AdminOverview = ({ data, recentActivity }) => (
  <div className="space-y-8">
    {/* System Health Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold mt-2">{data.totalStudents}</p>
            <p className="text-blue-200 text-sm mt-1">Active users</p>
          </div>
          <Users className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Staff Members</p>
            <p className="text-3xl font-bold mt-2">{data.totalStaff}</p>
            <p className="text-green-200 text-sm mt-1">Teaching & Admin</p>
          </div>
          <GraduationCap className="h-12 w-12 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Academic Units</p>
            <p className="text-3xl font-bold mt-2">{data.totalUnits}</p>
            <p className="text-purple-200 text-sm mt-1">Active courses</p>
          </div>
          <BookOpen className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Revenue</p>
            <p className="text-3xl font-bold mt-2">KES {data.revenue}</p>
            <p className="text-orange-200 text-sm mt-1">This semester</p>
          </div>
          <DollarSign className="h-12 w-12 text-orange-200" />
        </div>
      </div>
    </div>

    {/* Alerts and Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* System Alerts */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>System Alerts</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-800">Database Backup Required</p>
                <p className="text-yellow-700 text-sm">Last backup was 6 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Bell className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800">System Update Available</p>
                <p className="text-blue-700 text-sm">Version 2.1.0 ready for deployment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent User Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Recent User Registrations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((user, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-gray-600 text-sm">{user.digital_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Add New User', icon: UserPlus, color: 'blue', action: () => {} },
            { name: 'Generate Reports', icon: TrendingUp, color: 'green', action: () => {} },
            { name: 'System Backup', icon: Settings, color: 'purple', action: () => {} },
            { name: 'Broadcast Message', icon: MessageSquare, color: 'orange', action: () => {} }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-all hover:shadow-md border border-gray-200"
            >
              <action.icon className={`h-8 w-8 text-${action.color}-600 mx-auto mb-3`} />
              <p className="font-semibold text-gray-900">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const UserManagement = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">User Management</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-semibold flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">User Management Interface</h4>
        <p className="text-gray-600">Manage all system users, roles, and permissions</p>
      </div>
    </div>
  </div>
)

const AcademicAdmin = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">Academic Administration</h3>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Academic Setup</h4>
        <p className="text-gray-600">Manage faculties, departments, programs, and units</p>
      </div>
    </div>
  </div>
)

const FinancialAdmin = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">Financial Administration</h3>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Financial Management</h4>
        <p className="text-gray-600">Manage fee structures, payments, and financial reports</p>
      </div>
    </div>
  </div>
)

const SystemSettings = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">System Settings</h3>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">System Configuration</h4>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>
    </div>
  </div>
)

export default AdminDashboard
