import { useState, useEffect } from 'react'
import { customFetch } from '@/utils/services'
import type { Message } from '@/utils/types'
import MessageCard from './message-card'

export default function Messages ({ conversationId, socket }: {
  conversationId: string
  socket: WebSocket | undefined
}) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      customFetch<Message[]>(`conversations/${conversationId}/messages/`, {
        token
      }).then(res => {
        if (typeof res !== 'undefined') setMessages(res)
      }).catch(e => { console.error('Error in get messages', e) })
    }
  }, [])

  useEffect(() => {
    if (socket !== undefined) {
      socket.onmessage = (event) => {
        // console.log('msg: ', event)
        const message = JSON.parse(event.data)
        console.log(message)
        // setMessages(msgs => [...msgs, message])
      }
    }
  }, [socket])

  return (
    <ul className='bg-slate-400 flex-1 px-3'>
      {messages.map(m => <MessageCard key={m.id} message={m} />)}
    </ul>
  )
}
