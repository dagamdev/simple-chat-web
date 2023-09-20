'use client'

import Link from 'next/link'
import type { Conversation } from '@/utils/types'
import { useUser } from '@/hooks'

export default function ConversationCard ({ conversation }: {
  conversation: Conversation
}) {
  const { user } = useUser()
  const conversationUser = conversation.participants.find(f => f.id !== user?.id)

  const imageZise = 40

  return (
    <li className='p-2 hover:bg-gray-500 w-full rounded-md'>
      <Link className='no-underline flex items-center gap-3' href={`/conversations/${conversation.id}`}>
        <img className='rounded-full'
          src={conversationUser?.avatar_url ?? '/user.png'} alt={`Convarsation ${conversation.id} avatar`} width={imageZise} height={imageZise} />
        <strong className='text-gray-300'>{conversationUser?.username}</strong>
      </Link>
    </li>
  )
}
