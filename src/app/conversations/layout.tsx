'use client'

import '@/styles/conversation.css'
import Link from 'next/link'
import { useUser } from '@/hooks'
import ConversationList from '@/components/conversation/list'
import ConversationsProvider from '@/providers/conversations-provider'
import ConversationsHeader from '@/components/conversation/header'
import { HiOutlineLogout } from 'react-icons/hi'
import { VERSION } from '@/utils/config'

export default function ConversationsLayout ({ children }: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  return (
    <main className='conversation-container flex'>
      <section className='conversation-list flex flex-col gap-y-4 bg-gray-600 p-4 relative'>
        <ConversationsProvider>
          <ConversationsHeader />

          <ConversationList />
        </ConversationsProvider>

        <section className='flex items-center justify-between bg-gray-300 rounded-md py-2 px-4'>
          <Link className='flex gap-2 items-center' href={'/profile/' + user?.id}>
            <img className='rounded-full' src={user?.avatar_url ?? '/user.png'} alt='user avatar' width={30} height={30} />
            <strong>{user?.username}</strong>
          </Link>
          <HiOutlineLogout className='text-2xl cursor-pointer text-red-500' />
        </section>

        <span className='absolute left-1/2 -translate-x-1/2 bottom-0 text-xs font-bold text-slate-300'>V{VERSION}</span>
      </section>

      {children}
    </main>
  )
}
