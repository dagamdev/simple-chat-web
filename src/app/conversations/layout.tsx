'use client'

import ConversationList from '@/components/conversation/list'
import { useUser } from '@/hooks'
import Link from 'next/link'

import { IoSearch } from 'react-icons/io5'

export default function ConversationsLayout ({ children }: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  return (
    <main className='flex'>
      <section className='flex flex-col gap-y-4 bg-slate-500 p-4'>
        <header className='bg-gray-400 rounded-md'>
          <label className='flex py-2 px-6 items-center' htmlFor="search-user">
            <input className='bg-inherit outline-none border-none'
              type="text" id='search-user' placeholder='Search' />
            <IoSearch className='text-lg' />
          </label>
        </header>

        <ConversationList />

        <section className='bg-gray-400 rounded-md p-2'>
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
