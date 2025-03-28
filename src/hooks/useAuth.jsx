
import React, { useState, useEffect, createContext, useContext } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      setUser({ ...data.user, role: profile?.role || 'user' })

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      return { data, error: null }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      })
      return { data: null, error }
    }
  }

  const register = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create profile with default role
      await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            role: 'user',
          }
        ])

      setUser({ ...data.user, role: 'user' })

      toast({
        title: "Registration successful",
        description: "Welcome to our platform!",
      })

      return { data, error: null }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      })
      return { data: null, error }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
