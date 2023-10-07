'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks'
import { useEffect } from 'react'

export default function Home () {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user !== undefined) router.push('/conversations')
  }, [user])

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className='flex flex-col max-w-600'>
        <h1 className={'font-bold text-2xl text-[#4A87C9]'}>Bienvenido{user === undefined ? '' : ' de nuevo'}</h1>
        <p className='mb-4'>{user === undefined
          ? 'Inicia seccion o registrate para empesar a chatear'
          : 'Te estamos Redirigiendo a tus conversaciones...'
        }</p>
        {user === undefined && <>
            <Link href={'/login'} className='button font-bold px-10 py-2 rounded-lg border-2 border-[#4A87C9] my-2 shadow-md text-center text-gray-900 bg-[#4A87C9]'>Iniciar sesión</Link>
            <Link href={'/signup'} className='button font-bold px-10 py-2 rounded-lg border-2 border-[#4A87C9] my-2 shadow-md text-center text-[#4A87C9]'>Resgistrarme</Link>
          </>
        }
      </section>
    </main>
  )
}
