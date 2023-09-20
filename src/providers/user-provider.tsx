'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { UserContext } from '../contexts'
import { type User } from '@/utils/types'
import { customFetch } from '@/utils/services'

export default function UserProvider ({ children }: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    customFetch<User>('users/me', { token: true }).then(res => {
      if (res?.id !== undefined) setUser(res)
    }).catch(e => { console.error(e) })
  }, [])

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  )
}
