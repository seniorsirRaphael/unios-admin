import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../utils/supabaseClient'
import { 
  GraduationCap, BookOpen, Calendar, DollarSign, 
  Home, Users, Heart, MessageSquare, Bell, LogOut,
  User, Settings
} from 'lucide-react'

const StudentDashboard = () => {
  const { user, profile, userRanks, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [academicData, setAcademicData] = useState({})
  const [financialData, setFinancialData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Get academic data
      const { data: registrations } = await supabase
        .from('unit_registrations')
        .select(`
          *,
          units (name, code, credits),
          unit_grades (final_grade, grade_points)
        `)
        .eq('user_id', user.id)

      // Get financial data
      const { data: balance } = await supabase
        .rpc('calculate_student_balance', { student_id: user.id })

      // Get upcoming classes
      const { data: schedules } = await supabase
        .from('unit_schedules')
        .select(`
          *,
          units (name, code),
          venues (name),
          timetable_slots (day_of_week, start_time, end_time)
        `)
        .limit(5)

      setAcademicData({
        registrations: registrations || [],
        schedules: schedules || []
      })
      setFinancialData(balance || {})
    } catch (error) {
      console.error('Error fetching student data:', error)
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
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">UniOS</h1>
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', name: 'Overview', icon: User },
            { id: 'academics', name: 'Academics', icon: BookOpen },
            { id: 'finance', name: 'Finance', icon: DollarSign },
            { id: 'schedule', name: 'Schedule', icon: Calendar },
            { id: 'accommodation', name: 'Accommodation', icon: Home },
            { id: 'health', name: 'Health', icon: Heart },
            { id: 'messages', name: 'Messages', icon: MessageSquare },
            { id: 'clubs', name: 'Clubs & Events', icon: Users }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-600 truncate">{profile?.digital_id}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab.replace('_', ' ')}
              </h1>
              <p className="text-gray-600">Welcome back, {profile?.first_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeTab === 'overview' && <OverviewTab data={{ academicData, financialData, profile }} />}
          {activeTab === 'academics' && <AcademicsTab data={academicData} />}
          {activeTab === 'finance' && <FinanceTab data={financialData} />}
          {activeTab === 'schedule' && <ScheduleTab data={academicData.schedules} />}
          {/* Add other tabs as needed */}
        </main>
      </div>
    </div>
  )
}

// Tab Components
const OverviewTab = ({ data }) => (
  <div className="space-y-6">
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current GPA</p>
            <p className="text-2xl font-bold text-gray-900">3.75</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              KES {data.financialData?.balance || 0}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Registered Units</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.academicData?.registrations?.length || 0}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Attendance</p>
            <p className="text-2xl font-bold text-gray-900">92%</p>
          </div>
          <User className="h-8 w-8 text-orange-600" />
        </div>
      </div>
    </div>

    {/* Recent Activity & Upcoming Classes */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
        <div className="space-y-3">
          {data.academicData.schedules?.slice(0, 3).map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{schedule.units?.name}</p>
                <p className="text-sm text-gray-600">{schedule.venues?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {schedule.timetable_slots?.start_time}
                </p>
                <p className="text-xs text-gray-600">Today</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Register Units', icon: BookOpen, color: 'blue' },
            { name: 'View Results', icon: GraduationCap, color: 'green' },
            { name: 'Pay Fees', icon: DollarSign, color: 'purple' },
            { name: 'Book Appointment', icon: Heart, color: 'red' }
          ].map((action, index) => (
            <button
              key={index}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
            >
              <action.icon className={`h-6 w-6 text-${action.color}-600 mx-auto mb-2`} />
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const AcademicsTab = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Registered Units</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {data.registrations?.map((registration, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{registration.units?.name}</p>
                <p className="text-sm text-gray-600">{registration.units?.code} • {registration.units?.credits} credits</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {registration.unit_grades?.[0]?.final_grade || 'In Progress'}
                </p>
                <p className="text-xs text-gray-600">
                  {registration.unit_grades?.[0]?.grade_points || '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const FinanceTab = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Total Invoiced</p>
            <p className="text-2xl font-bold text-gray-900">KES {data.total_invoiced || 0}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">KES {data.total_paid || 0}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-red-600">Balance</p>
            <p className="text-2xl font-bold text-gray-900">KES {data.balance || 0}</p>
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
          Make Payment
        </button>
      </div>
    </div>
  </div>
)

const ScheduleTab = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Class Schedule</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {data?.map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{schedule.units?.name}</p>
                  <p className="text-sm text-gray-600">{schedule.venues?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{schedule.timetable_slots?.start_time} - {schedule.timetable_slots?.end_time}</p>
                <p className="text-sm text-gray-600">Room {schedule.venues?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default StudentDashboard
