'use client'

import '@/styles/conversation.css'
import Link from 'next/link'
import { useUser } from '@/hooks'
import ConversationList from '@/components/conversation/list'
import ConversationsProvider from '@/providers/conversations-provider'
import ConversationsHeader from '@/components/conversation/header'
import { HiOutlineLogout } from 'react-icons/hi'

export default function ConversationsLayout ({ children }: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  return (
    <main className='conversation-container flex'>
      <section className='conversation-list flex flex-col max-w-xs gap-y-4 bg-gray-600 p-4'>
        <ConversationsProvider>
          <ConversationsHeader />

          <ConversationList />
        </ConversationsProvider>

        <section className='flex items-center justify-between bg-gray-300 rounded-md py-2 px-4'>
          <Link className='flex gap-2 items-center' href={'/profile'}>
            <img className='rounded-full' src={user?.avatar_url ?? '/user.png'} alt='user avatar' width={30} height={30} />
            <strong>{user?.username}</strong>
          </Link>
          <HiOutlineLogout className='text-2xl cursor-pointer text-red-500' />
        </section>
      </section>

      {children}
    </main>
  )
}
