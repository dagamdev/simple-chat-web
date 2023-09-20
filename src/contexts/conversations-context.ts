import { createContext } from 'react'
import type { Conversation, FunctionState } from '../utils/types'

export interface ConversationsContextData {
  conversations: Conversation[]
  setConversations: FunctionState<Conversation[]>
}

export const ConversationsContext = createContext<ConversationsContextData | undefined>(undefined)
