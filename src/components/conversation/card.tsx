'use client'

import Link from 'next/link'
import type { Conversation } from '@/utils/types'
import { useUser } from '@/hooks'

export default function ConversationCard ({ conversation }: {
  conversation: Conversation
}) {
  const { user } = useUser()
  const conversationUser = conversation.participants.find(f => f.id !== user?.id)

  const imageZise = 50

  return (
    <li className='p-3 bg-slate-400 w-full rounded-md'>
      <Link className='no-underline flex items-center gap-4' href={`/conversations/${conversation.id}`}>
        <img className='rounded-full border-2 border-slate-600'
          src={conversationUser?.avatar_url ?? '/user.png'} alt={`Convarsation ${conversation.id} avatar`} width={imageZise} height={imageZise} />
        <strong>{conversationUser?.username}</strong>
      </Link>
    </li>
  )
}
