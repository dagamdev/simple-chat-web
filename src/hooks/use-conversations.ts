import { useContext } from 'react'
import { ConversationsContext, type ConversationsContextData } from '@/contexts'

export function useConversations () {
  return useContext(ConversationsContext) as ConversationsContextData
}
