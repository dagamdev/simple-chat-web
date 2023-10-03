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
      if (typeof data.length === 'number') {
        setConversations(data.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }))
      }
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
