import { useUser } from '@/hooks'
import type { Message } from '@/utils/types'

export default function MessageCard ({ message }: {
  message: Message
}) {
  const { user } = useUser()

  const createdAt = new Date(message.created_at)

  return (
    <li className={'flex my-3 ' + (user?.id === message.author
      ? 'justify-end'
      : ''
    )}>
      <div className={'py-2 px-3 rounded-xl shadow-lg ' + (user?.id === message.author
        ? 'bg-[#4A87C9] shadow-[#4A87C9]/80'
        : 'bg-slate-700 shadow-slate-700/80'
      )}>
        <p className='text-gray-100'>{message.content}</p>
        <div className='flex justify-end'>
          <p className={'text-xs mt-1 ' + (user?.id === message.author
            ? 'text-gray-300'
            : 'text-gray-400'
          )}>{createdAt.toLocaleTimeString().slice(0, 5)}</p>
        </div>
      </div>
    </li>
  )
}
