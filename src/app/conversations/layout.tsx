'use client'

import Link from 'next/link'
import { useUser } from '@/hooks'
import ConversationList from '@/components/conversation/list'
import ConversationsProvider from '@/providers/conversations-provider'
import ConversationsHeader from '@/components/conversation/header'

export default function ConversationsLayout ({ children }: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  return (
    <main className='flex'>
      <section className='flex flex-col max-w-xs gap-y-4 bg-gray-600 p-4'>
        <ConversationsProvider>
          <ConversationsHeader />

          <ConversationList />
        </ConversationsProvider>

        <section className='bg-gray-300 rounded-md py-2 px-4'>
          <Link className='flex gap-3 items-center' href={'/profile'}>
            <img src={user?.avatar_url ?? '/user.png'} alt='user avatar' width={30} height={30} />
            {user?.username}
          </Link>
        </section>
      </section>
      {children}
    </main>
  )
}
