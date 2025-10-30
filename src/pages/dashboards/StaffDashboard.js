import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../utils/supabaseClient'
import {
  Users, BookOpen, Calendar, BarChart3,
  MessageSquare, Settings, LogOut, Bell,
  GraduationCap, CheckCircle, Clock
} from 'lucide-react'

const StaffDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [staffData, setStaffData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaffData()
  }, [])

  const fetchStaffData = async () => {
    try {
      // Get staff-specific data
      const [
        { data: assignedUnits },
        { data: pendingGrades },
        { data: upcomingClasses }
      ] = await Promise.all([
        supabase.from('unit_schedules').select(`
          *,
          units (name, code, credits),
          venues (name)
        `).eq('instructor_id', user.id),
        supabase.from('unit_registrations').select(`
          *,
          units (name, code),
          user_profiles (first_name, last_name, digital_id)
        `).eq('status', 'registered').limit(10),
        supabase.from('unit_schedules').select(`
          *,
          units (name, code),
          venues (name),
          timetable_slots (day_of_week, start_time, end_time)
        `).eq('instructor_id', user.id).gte('schedule_date', new Date().toISOString()).limit(5)
      ])

      setStaffData({
        assignedUnits: assignedUnits || [],
        pendingGrades: pendingGrades || [],
        upcomingClasses: upcomingClasses || []
      })
    } catch (error) {
      console.error('Error fetching staff data:', error)
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
          <p className="mt-4 text-gray-600">Loading staff dashboard...</p>
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
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Staff Portal</h1>
              <p className="text-sm text-gray-600">Teaching Staff</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'my_units', name: 'My Units', icon: BookOpen },
            { id: 'grading', name: 'Grading', icon: CheckCircle },
            { id: 'schedule', name: 'Schedule', icon: Calendar },
            { id: 'students', name: 'Students', icon: Users },
            { id: 'communications', name: 'Communications', icon: MessageSquare },
            { id: 'reports', name: 'Reports', icon: BarChart3 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-green-600 text-white shadow-lg'
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-600 truncate">Lecturer</p>
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
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {activeTab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h1>
              <p className="text-gray-600">Staff Management Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'overview' && <StaffOverview data={staffData} />}
          {activeTab === 'my_units' && <MyUnits data={staffData.assignedUnits} />}
          {activeTab === 'grading' && <Grading data={staffData.pendingGrades} />}
          {activeTab === 'schedule' && <StaffSchedule data={staffData.upcomingClasses} />}
        </main>
      </div>
    </div>
  )
}

// Staff Tab Components
const StaffOverview = ({ data }) => (
  <div className="space-y-8">
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Assigned Units</p>
            <p className="text-2xl font-bold text-gray-900">{data.assignedUnits?.length || 0}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Grades</p>
            <p className="text-2xl font-bold text-gray-900">{data.pendingGrades?.length || 0}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Today's Classes</p>
            <p className="text-2xl font-bold text-gray-900">{data.upcomingClasses?.length || 0}</p>
          </div>
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
      </div>
    </div>

    {/* Today's Schedule */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {data.upcomingClasses?.slice(0, 3).map((classItem, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{classItem.units?.name}</p>
                  <p className="text-sm text-gray-600">{classItem.venues?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {classItem.timetable_slots?.start_time} - {classItem.timetable_slots?.end_time}
                </p>
                <p className="text-sm text-gray-600">{classItem.timetable_slots?.day_of_week}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const MyUnits = ({ data }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">My Teaching Units</h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {data?.map((unit, index) => (
          <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{unit.units?.name}</p>
                <p className="text-gray-600">{unit.units?.code} • {unit.units?.credits} credits</p>
                <p className="text-sm text-gray-500 mt-1">{unit.venues?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold">
                Manage Unit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Grading = ({ data }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">Pending Grading</h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {data?.map((registration, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="font-semibold text-gray-900">
                {registration.user_profiles?.first_name} {registration.user_profiles?.last_name}
              </p>
              <p className="text-sm text-gray-600">{registration.units?.name} • {registration.user_profiles?.digital_id}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold">
              Enter Grade
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const StaffSchedule = ({ data }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">Teaching Schedule</h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {data?.map((schedule, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{schedule.units?.name}</p>
                <p className="text-sm text-gray-600">{schedule.venues?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {schedule.timetable_slots?.start_time} - {schedule.timetable_slots?.end_time}
              </p>
              <p className="text-sm text-gray-600">Room {schedule.venues?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default StaffDashboard
