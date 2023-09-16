import type { Dispatch, SetStateAction } from 'react'

export type FunctionState<Type> = Dispatch<SetStateAction<Type>>

interface TimeDate {
  created_at: string
  updated_at: string
}

export interface User extends TimeDate {
  id: string
  email: string
  username: string
  is_staff: boolean
  avatar_url: string | null
}

export interface Message extends TimeDate {
  id: string
  read: boolean
  author: string
  content: string
  conversation: string
}

export interface Conversation extends TimeDate {
  id: string
  participants: User[]
}
