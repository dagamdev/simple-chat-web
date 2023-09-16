'use client'

import { useState, useEffect, type FormEvent } from 'react'
import type { Conversation } from '@/utils/types'
import { customFetch } from '@/utils/services'
import { useUser } from '@/hooks'
import Messages from '@/components/conversation/messages'
import { API_WS_ENDPOINT } from '@/utils/config'

export default function ConversationPage ({ params }: {
  params: { conversationId: string }
}) {
  const [conversation, setConversation] = useState<Conversation>()
  const [socket, setSocket] = useState<WebSocket>()
  const { user } = useUser()

  const conversationUser = conversation?.participants.find(f => f.id !== user?.id)

  const imageZise = 50

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      customFetch<Conversation>(`conversations/${params.conversationId}/`, {
        token
      }).then(res => {
        if (typeof res !== 'undefined') setConversation(res)
      }).catch(e => { console.error('Error in get conversation', e) })
    }

    const preSocket = new WebSocket(`${API_WS_ENDPOINT}conversation/${params.conversationId}/`)

    preSocket.onopen = (event) => {
      console.log('Socket connection', event)

      setSocket(preSocket)
    }

    preSocket.onclose = (event) => {
      console.log('Socket close', event)
    }

    return () => {
      preSocket.close()
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const content = e.currentTarget.message.value
    console.log(content)

    if (user !== undefined) {
      const newMessage = {
        content,
        author: user.id,
        conversation: params.conversationId
      }
      socket?.send(JSON.stringify(newMessage))
    }

    e.currentTarget.message.value = ''
  }

  return (
    <section className='flex flex-col flex-1 h-screen'>
      <header className='flex items-center bg-slate-500 p-3 gap-x-3'>
        <img className='rounded-full border-2 border-slate-800' src={conversationUser?.avatar_url ?? '/user.png'} alt={`Avatar de ${conversationUser?.username ?? 'conversacion'}`} width={imageZise} height={imageZise} />
        <h2 className='text-xl font-bold' >{conversationUser?.username ?? 'Conversación'}</h2>
        <p>{params.conversationId}</p>
      </header>

      <Messages conversationId={params.conversationId} socket={socket} />

      <form onSubmit={handleSubmit} className='flex'>
        <label className='flex-1' htmlFor='message'>
          <input className='py-3 px-4 bg-gray-800 w-full text-gray-100 border-none outline-none'
            type="text" id='message' name='message' maxLength={2000} placeholder='Sen a message' />
        </label>
        <button className='py-3 px-6 bg-green-500 text-gray-100' >Enviar</button>
      </form>
    </section>
  )
}
