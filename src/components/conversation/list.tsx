'use client'

import { type Conversation } from '@/utils/types'
import ConversationCard from './card'
import { useState, useEffect } from 'react'
import { customFetch } from '@/utils/services'

export default function ConversationList () {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      customFetch<Conversation[]>('conversations/', {
        token
      }).then(res => {
        if (typeof res === 'object') setConversations(res)
      }).catch(e => { console.error('Error in get conversations', e) })
    }
  }, [])

  return (
    <nav className='flex flex-1 bg-gray-600'>
      <ul className='flex flex-col w-full'>
        {conversations.map(c => <ConversationCard key={c.id} conversation={c} />)}
      </ul>
    </nav>
  )
}
