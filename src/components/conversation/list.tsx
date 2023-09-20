'use client'

import ConversationCard from './card'
import { useConversations } from '@/hooks'

export default function ConversationList () {
  const { conversations } = useConversations()

  return (
    <nav className='flex flex-1'>
      {conversations.length === 0
        ? <p className='text-center text-slate-300'><strong>Sin conversaciones</strong>, busca a un usuario para iniciar una conversación</p>
        : <ul className='flex flex-col w-full'>
        {conversations.map(c => <ConversationCard key={c.id} conversation={c} />)}
      </ul>}
    </nav>
  )
}
