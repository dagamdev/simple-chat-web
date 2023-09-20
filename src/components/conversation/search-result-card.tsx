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
    <img className='rounded-full' src={resultUser.avatar_url ?? '/user.png'} alt={`Avatar de ${resultUser.username}`} width={34} height={34} />
    <div>
      <strong>{resultUser.username}</strong>
      <p>{resultUser.conversationId === null ? 'Crear conversación' : 'Conversación creada'}</p>
    </div>
  </>

  return (
    <li onClick={handleClick} className={'cursor-pointer ' + (resultUser.conversationId === null
      ? 'flex items-center gap-x-2'
      : ''
    )}>
      {resultUser.conversationId === null
        ? content
        : <Link href={`/conversations/${resultUser.conversationId}`}>
          {content}
        </Link>
      }
    </li>
  )
}
