'use client'

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import type { Conversation } from '@/utils/types'
import { customFetch } from '@/utils/services'
import { useUser } from '@/hooks'
import Messages from '@/components/conversation/messages'
import { API_WS_ENDPOINT } from '@/utils/config'
import { PiChatsFill } from 'react-icons/pi'
import { BiSolidSend } from 'react-icons/bi'

export default function ConversationPage ({ params }: {
  params: { conversationId: string }
}) {
  const [conversation, setConversation] = useState<Conversation>()
  const [socket, setSocket] = useState<WebSocket>()
  const { user } = useUser()

  const conversationUser = conversation?.participants.find(f => f.id !== user?.id)
  const imageZise = 56

  useEffect(() => {
    customFetch<Conversation>(`conversations/${params.conversationId}/`, {
      token: true
    }).then(res => {
      if (typeof res !== 'undefined') setConversation(res)
    }).catch(e => { console.error('Error in get conversation', e) })

    let socketConnected = false
    const intervalo = setInterval(() => {
      if (!socketConnected) {
        socket?.close()
        const socketConection = new WebSocket(`${API_WS_ENDPOINT}conversation/${params.conversationId}/`)

        socketConection.onopen = (event) => {
          console.log('🟢 Connected to websocket')
          socketConnected = true
          setSocket(socketConection)
        }

        socketConection.onclose = (event) => {
          console.log('⭕ Socket connection closed')
          socketConnected = false
        }
      }
    }, 6000)

    return () => {
      clearInterval(intervalo)
    }
  }, [])

  useEffect(() => {
    return () => {
      socket?.close()
    }
  }, [socket])

  useEffect(() => {
    if (window.innerWidth < 400) {
      const conversationContainer = document.querySelector('.conversation-container')

      if (conversationContainer !== null) {
        conversationContainer.scrollLeft = conversationContainer.scrollWidth / 2
      }
    }
  }, [conversation])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const content = e.currentTarget.message.value

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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const scrollHeight = event.currentTarget.scrollHeight

    if (scrollHeight < 310) {
      event.currentTarget.style.height = 'auto'
      event.currentTarget.style.height = event.currentTarget.scrollHeight + 'px'
    }
  }

  const handleClick = () => {
    const conversationContainer = document.querySelector('.conversation-container')

    if (conversationContainer !== null) {
      conversationContainer.scrollLeft = 0
    }
  }

  return (
    <section className='messages flex flex-col flex-1 h-screen'>
      <header className='flex items-center bg-gray-600 p-4'>
        <PiChatsFill onClick={handleClick} className='chats-icon text-4xl text-gray-400 mr-6' />
        <section className='flex items-center gap-x-3'>
          <img className='rounded-xl' src={conversationUser?.avatar_url ?? '/user.png'} alt={`Avatar de ${conversationUser?.username ?? 'conversacion'}`} width={imageZise} height={imageZise} />
          <h2 className='text-xl font-bold text-gray-300' >{conversationUser?.username ?? 'Conversación'}</h2>
        </section>
      </header>

      <Messages conversationId={params.conversationId} socket={socket} />

      <form onSubmit={handleSubmit} className='flex items-center bg-gray-600 p-4 gap-x-2'>
        <textarea onChange={handleChange}
          className='py-2 px-3 rounded-lg bg-gray-300 w-full h-auto border-none outline-none resize-none'
          style={{ scrollbarWidth: 'none' }}
          rows={1} id='message' name='message' maxLength={2000} placeholder={`Enviar mensaje a ${conversationUser?.username}`} />
        <button className='flex items-center h-[39px] px-6 rounded-lg bg-green-600 text-gray-100' >
          <BiSolidSend className='sm:hidden text-2xl' />
          <span className='max-sm:hidden' >Enviar</span>
        </button>
      </form>
    </section>
  )
}
