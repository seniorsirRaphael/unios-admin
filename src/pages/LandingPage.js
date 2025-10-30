import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { Users, BookOpen, Building, GraduationCap } from 'lucide-react'

const LandingPage = () => {
  const [stats, setStats] = useState({})
  const [institution, setInstitution] = useState(null)

  useEffect(() => {
    fetchSystemData()
  }, [])

  const fetchSystemData = async () => {
    try {
      // Get institution data
      const { data: institutions } = await supabase
        .from('institutions')
        .select('*')
        .limit(1)
        .single()

      // Get stats
      const { count: students } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: programs } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true })

      const { count: staff } = await supabase
        .from('user_ranks')
        .select('*', { count: 'exact', head: true })
        .in('rank_id', [1, 2, 3, 4]) // Staff ranks

      setInstitution(institutions)
      setStats({
        students: students || 0,
        programs: programs || 0,
        staff: staff || 0,
        faculties: 3 // From your sample data
      })
    } catch (error) {
      console.error('Error fetching system data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">UniOS</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to {institution?.name || 'University Operating System'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform managing everything from academics and finance to campus life and healthcare. 
            Streamlining university operations for students, faculty, and administration.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Join as Student
            </Link>
            <Link 
              to="/login" 
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-medium text-lg"
            >
              Staff Login
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.students}+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.programs}+</div>
            <div className="text-gray-600">Programs</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Building className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.facilities}+</div>
            <div className="text-gray-600">Faculties</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <GraduationCap className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.staff}+</div>
            <div className="text-gray-600">Staff</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive University Management
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Academic Management', desc: 'Course registration, grading, transcripts' },
              { title: 'Financial System', desc: 'Fee payments, payroll, budgeting' },
              { title: 'Student Life', desc: 'Accommodation, clubs, elections' },
              { title: 'Health Services', desc: 'Medical records, appointments, chat' },
              { title: 'Communication Hub', desc: 'Real-time messaging, announcements' },
              { title: 'Administrative Tools', desc: 'Staff management, reporting' }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
