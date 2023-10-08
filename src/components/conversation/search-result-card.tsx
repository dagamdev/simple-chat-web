import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useConversations, useUser } from '@/hooks'
import { customFetch } from '@/utils/services'
import type { Conversation, User } from '@/utils/types'

export interface ResultUser extends Pick<User, 'id' | 'username' | 'avatar_url'> {
  conversationId: string | null
}

export default function SearchResultCard ({ resultUser, closeResults }: {
  resultUser: ResultUser
  closeResults: () => void
}) {
  const { user } = useUser()
  const { setConversations } = useConversations()
  const router = useRouter()

  const handleClick = () => {
    closeResults()

    if (resultUser.conversationId === null) {
      if (user !== undefined) {
        customFetch<Conversation>('conversations/', {
          method: 'POST',
          token: true,
          body: {
            participants: [
              user.id,
              resultUser.id
            ]
          }
        }).then(data => {
          if (typeof data === 'object') {
            router.push(`/conversations/${data.id}`)
            setConversations(cs => [...cs, data])
          }
        }).catch(e => { console.error('Error in create conversation: ', e) })
      }
    }
  }

  const content = <>
    <picture>
      <img className={'rounded-full' + (resultUser.avatar_url === null
        ? ''
        : ' border border-gray-400'
      )} src={resultUser.avatar_url ?? '/user.png'} alt={`Avatar de ${resultUser.username}`} width={36} height={36} />
    </picture>
    <section className='flex flex-col'>
      <strong>{resultUser.username}</strong>
      <i className='text-sm'>{resultUser.conversationId === null ? 'Crear conversación' : 'Conversación creada'}</i>
    </section>
  </>

  return (
    <li onClick={handleClick} className={'cursor-pointer rounded p-2 hover:bg-gray-400 ' + (resultUser.conversationId === null
      ? 'flex items-center gap-x-2'
      : ''
    )}>
      {resultUser.conversationId === null
        ? content
        : <Link className='flex items-center gap-x-2' href={`/conversations/${resultUser.conversationId}`}>
          {content}
        </Link>
      }
    </li>
  )
}
