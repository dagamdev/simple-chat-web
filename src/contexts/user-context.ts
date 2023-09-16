import { createContext } from 'react'
import type { User, FunctionState } from '../utils/types'

export interface UserContextData {
  user: User | undefined
  setUser: FunctionState<User | undefined>
}

export const UserContext = createContext<UserContextData | undefined>(undefined)
