import { useState, useEffect } from 'react'
import { customFetch } from '@/utils/services'
import type { Message } from '@/utils/types'
import MessageCard from './message-card'

export default function Messages ({ conversationId, socket }: {
  conversationId: string
  socket: WebSocket | undefined
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesBox, setMessagesBox] = useState<HTMLUListElement | null>(null)

  useEffect(() => {
    customFetch<Message[]>(`conversations/${conversationId}/messages/`, {
      token: true
    }).then(res => {
      if (typeof res !== 'undefined') setMessages(res)
    }).catch(e => { console.error('Error in get messages', e) })
  }, [])

  useEffect(() => {
    if (socket !== undefined) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message)
        setMessages(msgs => [...msgs, message])
      }
    }
  }, [socket])

  useEffect(() => {
    if (messagesBox !== null) {
      messagesBox.scrollTop = messagesBox.scrollHeight
    }
  }, [messagesBox, messages])

  return (
    <ul ref={setMessagesBox}
      className='bg-gray-300 flex-1 px-5 py-2 overflow-y-auto flex flex-col w-auto'>
      {messages.map((m, i) => {
        const prM = messages[i - 1]; const neM = messages[i + 1]
        const prevMessage = prM !== undefined
          ? {
              author: prM.author,
              created_at: prM.updated_at
            }
          : undefined

        const nextMessage = neM !== undefined
          ? {
              author: neM.author,
              created_at: neM.updated_at
            }
          : undefined

        return <MessageCard key={m.id} message={m} {...{ prevMessage, nextMessage }} />
      })}
    </ul>
  )
}
