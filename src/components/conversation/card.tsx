import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Conversation } from '@/utils/types'
import { useUser } from '@/hooks'
import { type MouseEvent } from 'react'

export default function ConversationCard ({ conversation }: {
  conversation: Conversation
}) {
  const { user } = useUser()
  const path = usePathname()
  const conversationUser = conversation.participants.find(f => f.id !== user?.id)
  const imageZise = 50

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 500) {
      const conversationContainer = document.querySelector('.conversation-container')

      if (conversationContainer !== null) {
        conversationContainer.scrollLeft = conversationContainer.scrollWidth / 2
      }
    }
  }

  return (
    <li className='w-full'>
      <Link onClick={handleClick} className={'p-2 no-underline flex rounded-md items-center gap-x-3 hover:bg-gray-500 ' + (path.includes(conversation.id)
        ? 'bg-gray-500'
        : ''
      )} href={`/conversations/${conversation.id}`}>
        <img className={'rounded-full ' + (conversationUser?.avatar_url === null
          ? 'bg-gray-500'
          : ''
        )}
          src={conversationUser?.avatar_url ?? '/user.png'} alt={`Convarsation ${conversation.id} avatar`} width={imageZise} height={imageZise} />
        <strong className='text-gray-300 text-lg'>{conversationUser?.username}</strong>
      </Link>
    </li>
  )
}
