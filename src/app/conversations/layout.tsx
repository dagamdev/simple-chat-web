'use client'

import '@/styles/conversation.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useUser } from '@/hooks'
import ConversationList from '@/components/conversation/list'
import ConversationsProvider from '@/providers/conversations-provider'
import ConversationsHeader from '@/components/conversation/header'
import { HiOutlineLogout } from 'react-icons/hi'
import { VERSION } from '@/utils/config'

export default function ConversationsLayout ({ children }: {
  children: React.ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { user, setUser } = useUser()
  const router = useRouter()

  const openModal = () => {
    if (dialogRef.current !== null) dialogRef.current.showModal()
  }

  const closeModal = () => {
    if (dialogRef.current !== null) dialogRef.current.close()
  }

  const signOut = () => {
    closeModal()
    localStorage.removeItem('token')
    setUser(undefined)
    router.push('/')
  }

  return (
    <main className='conversation-container flex'>
      <dialog className='p-4 rounded-lg shadow-lg backdrop:bg-gray-700/60 bg-slate-200'
        ref={dialogRef}
      >
        <p className='text-center font-bold'>¿Está seguro de que desea cerrar sesión?</p>
        <section className='flex gap-x-3 mt-5'>
          <button className='p-2 font-bold min-w-[160px] rounded-md hover:brightness-125 bg-green-500 text-slate-200'
            onClick={signOut}
          >Continuar</button>
          <button className='p-2 font-bold min-w-[160px] rounded-md hover:brightness-125 bg-red-500 text-slate-200'
            onClick={closeModal}
          >Cancelar</button>
        </section>
      </dialog>

      <section className='conversation-list flex flex-col gap-y-4 bg-gray-600 p-4 relative'>
        <ConversationsProvider>
          <ConversationsHeader />

          <ConversationList />
        </ConversationsProvider>

        <section className='flex items-center justify-between bg-gray-300 rounded-md py-2 px-4'>
          <Link className='flex gap-2 items-center' href={'/profile/' + user?.id}>
            <img className={'rounded-full ' + (user?.avatar_url === null
              ? ''
              : 'border border-gray-400'
            )} src={user?.avatar_url ?? '/user.png'} alt='user avatar' width={32} height={32} />
            <strong>{user?.username}</strong>
          </Link>
          <button className='text-2xl text-red-500' onClick={openModal}>
            <HiOutlineLogout/>
          </button>
        </section>

        <span className='absolute left-1/2 -translate-x-1/2 bottom-0 text-xs font-bold text-slate-300'>V{VERSION}</span>
      </section>

      {children}
    </main>
  )
}
