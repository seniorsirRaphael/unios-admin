import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userRanks, setUserRanks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await getProfile()
      } else {
        setProfile(null)
        setUserRanks([])
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getProfile = async () => {
    try {
      const user = supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', (await user).data.user?.id)
        .single()

      const { data: ranks } = await supabase
        .from('user_ranks')
        .select(`
          *,
          organizational_ranks (*)
        `)
        .eq('user_id', (await user).data.user?.id)
        .eq('is_active', true)

      setProfile(profile)
      setUserRanks(ranks || [])
    } catch (error) {
      console.error('Error getting profile:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (!error && data.user) {
      // Call your create_user_profile function
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        user_id: data.user.id,
        email: email,
        first_name: userData.first_name,
        last_name: userData.last_name
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAdmin = () => {
    return userRanks.some(rank => rank.organizational_ranks?.rank_level <= 2)
  }

  const isStudent = () => {
    return userRanks.some(rank => rank.organizational_ranks?.user_type === 'student')
  }

  const isStaff = () => {
    return userRanks.some(rank => 
      ['teaching_staff', 'non_teaching_staff'].includes(rank.organizational_ranks?.user_type)
    )
  }

  const value = {
    user,
    profile,
    userRanks,
    signUp,
    signIn,
    signOut,
    loading,
    isAdmin,
    isStudent,
    isStaff
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
