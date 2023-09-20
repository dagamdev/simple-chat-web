import { useState, useEffect } from 'react'
import { ConversationsContext } from '@/contexts'
import { customFetch } from '@/utils/services'
import type { Conversation } from '@/utils/types'

export default function ConversationsProvider ({ children }: {
  children: React.ReactNode
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    customFetch<Conversation[]>('conversations/', {
      token: true
    }).then(data => {
      if (typeof data.length === 'number') setConversations(data)
    }).catch(e => { console.error('Error in get conversations: ', e) })
  }, [])

  return (
    <ConversationsContext.Provider value={{
      conversations,
      setConversations
    }}>
      {children}
    </ConversationsContext.Provider>
  )
}
