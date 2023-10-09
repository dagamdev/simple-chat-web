import { useUser } from '@/hooks'
import type { Message } from '@/utils/types'

type SimpleMessage = Pick<Message, 'author' | 'created_at'>

export default function MessageCard ({ message, prevMessage, nextMessage }: {
  message: Message
  prevMessage?: SimpleMessage
  nextMessage?: SimpleMessage
}) {
  const { user } = useUser()

  const createdAt = new Date(message.created_at)
  const prevMessageCreatedAt = prevMessage !== undefined
    ? new Date(prevMessage.created_at)
    : new Date()
  const nextMessageCreatedAt = nextMessage !== undefined
    ? new Date(nextMessage.created_at)
    : new Date()

  const isAuthor = user?.id === message.author

  return (
    <li className={'flex gap-x-2 py-[0.30rem] pl-4 pr-[0.60rem] rounded-2xl shadow-lg ' + (prevMessage !== undefined && message.author !== prevMessage.author
      ? 'mt-6 '
      : ''
    ) + (isAuthor
      ? 'bg-[#4A87C9] shadow-[#4A87C9]/60 self-end rounded-tr-md ml-10 ' + (createdAt.getTime() - prevMessageCreatedAt.getTime() > 6 * 60000
        ? 'mt-3 '
        : (prevMessage !== undefined && user?.id === prevMessage.author
            ? 'rounded-tr-none mt-px '
            : ''
          )
      ) + (nextMessageCreatedAt.getTime() - createdAt.getTime() > 6 * 60000 || user?.id !== nextMessage?.author
        ? ''
        : 'rounded-br-none'
      )
      : 'bg-slate-700 shadow-slate-700/60 self-start rounded-tl-md mr-10 ' + (createdAt.getTime() - prevMessageCreatedAt.getTime() > 6 * 60000
        ? 'mt-3 '
        : (prevMessage !== undefined && user?.id !== prevMessage.author
            ? 'rounded-tl-none mt-px '
            : ''
          )
      ) + (nextMessageCreatedAt.getTime() - createdAt.getTime() > 6 * 60000 || nextMessage === undefined || user?.id === nextMessage?.author
        ? ''
        : 'rounded-bl-none'
      )
    )}>
      <p className='text-gray-100 whitespace-pre-wrap'>{message.content}</p>
      <span className={'text-xs mt-1 float-right self-end ' + (user?.id === message.author
        ? 'text-gray-300'
        : 'text-gray-400'
      )}>{createdAt.toLocaleTimeString().slice(0, 5)}</span>
    </li>
  )
}
