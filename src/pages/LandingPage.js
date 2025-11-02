import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { 
  Users, BookOpen, Building, GraduationCap, 
  ArrowRight, Shield, Zap, Globe, Clock,
  CheckCircle, Star, TrendingUp
} from 'lucide-react'

const LandingPage = () => {
  const [stats, setStats] = useState({})
  const [institution, setInstitution] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

      const { count: units } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })

      setInstitution(institutions)
      setStats({
        students: students || 1250,
        programs: programs || 45,
        units: units || 320,
        faculties: 8
      })
    } catch (error) {
      console.error('Error fetching system data:', error)
      // Fallback data
      setStats({
        students: 1250,
        programs: 45,
        units: 320,
        faculties: 8
      })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Academic Management',
      description: 'Complete course registration, grading system, and academic tracking',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Student Life',
      description: 'Clubs, elections, accommodation, and campus activities management',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Financial System',
      description: 'Secure fee payments, payroll, and financial reporting',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Health Services',
      description: 'Medical records, appointments, and emergency health services',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Globe,
      title: 'Communication Hub',
      description: 'Real-time messaging, announcements, and collaboration tools',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'Automated timetables, room allocation, and resource management',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const benefits = [
    'Reduce administrative workload by 60%',
    'Real-time data analytics and reporting',
    'Mobile-first responsive design',
    'Secure cloud-based infrastructure',
    '24/7 system availability',
    'Multi-campus support'
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UniOS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="nav-glass fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">UniOS</span>
                <p className="text-xs text-purple-200">University OS</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-purple-200 hover:text-white font-medium transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-8">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">Trusted by 50+ Universities</span>
            </div>
            
            <h1 className="hero-title text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-purple-400">
                UniOS
              </span>
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-purple-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              The all-in-one platform revolutionizing university management. 
              Streamline academics, finance, campus life, and healthcare in one seamless ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link 
                to="/signup" 
                className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-xl flex items-center justify-center space-x-2 group"
              >
                <span>Start as Student</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary text-lg px-8 py-4 rounded-xl border-white/30 hover:border-white/50 hover:bg-white/10"
              >
                Staff Portal
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Users, value: stats.students, label: 'Active Students', color: 'text-blue-400' },
                { icon: BookOpen, value: stats.programs, label: 'Academic Programs', color: 'text-green-400' },
                { icon: Building, value: stats.faculties, label: 'Faculties', color: 'text-purple-400' },
                { icon: GraduationCap, value: stats.units, label: 'Course Units', color: 'text-orange-400' }
              ].map((stat, index) => (
                <div key={index} className="stat-card animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <stat.icon className={`h-8 w-8 ${stat.color} mb-3 mx-auto`} />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}+</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything Your University Needs
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Comprehensive modules designed to streamline every aspect of university operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card animate-fadeInUp group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transform Your University Experience
              </h2>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                Join thousands of institutions that have revolutionized their operations with UniOS. 
                From small colleges to large universities, we provide scalable solutions that grow with you.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="card animate-pulse-slow">
                <div className="text-center p-8">
                  <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Proven Results</h3>
                  <p className="text-gray-600 mb-6">
                    Universities using UniOS report significant improvements in efficiency and student satisfaction
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">60%</div>
                      <div className="text-sm text-gray-600">Faster Processes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">45%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your University?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the future of education management today. Start your journey with UniOS and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-2xl"
            >
              Create Student Account
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Access Staff Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <GraduationCap className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">UniOS</span>
          </div>
          <p className="text-purple-200 mb-6">
            University Operating System - Powering the future of education
          </p>
          <p className="text-purple-300 text-sm">
            © 2024 UniOS. All rights reserved. Built for modern universities.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
