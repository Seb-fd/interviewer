import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

interface MockContextValue {
  useMockData: boolean
  setUseMockData: (value: boolean) => void
  isConfigured: boolean
}

const MockContext = createContext<MockContextValue | null>(null)

export function MockProvider({ children }: { children: ReactNode }) {
  const [useMockData, setUseMockData] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      setUseMockData(false)
    }
  }, [])

  return (
    <MockContext.Provider value={{ useMockData, setUseMockData, isConfigured: isSupabaseConfigured }}>
      {children}
    </MockContext.Provider>
  )
}

export function useMockData() {
  const context = useContext(MockContext)
  if (!context) {
    throw new Error('useMockData must be used within a MockProvider')
  }
  return context
}
