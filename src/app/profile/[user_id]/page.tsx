'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useUser } from '@/hooks'
import type { User } from '@/utils/types'
import { customFetch } from '@/utils/services'
import { MAIN_COLOR } from '@/utils/config'
import { BiSave } from 'react-icons/bi'

export default function ProfilePAge ({ params: { user_id: userId } }: {
  params: { user_id: string }
}) {
  const { user, setUser } = useUser()
  const [userTarget, setUserTarget] = useState<User>()
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (user !== undefined && user.id !== userTarget?.id) {
      customFetch<User>(`users/${userId}/`, {
        token: true
      }).then(data => {
        if (typeof data === 'object') setUserTarget(data)
      }).catch(e => { console.error(e) })
    } else {
      setUserTarget(user)
    }
  }, [user])

  useEffect(() => {
    if (typeof userTarget?.avatar_url === 'string') {
      setAvatarUrl(userTarget.avatar_url)
    }
  }, [userTarget])

  const createdAt = userTarget?.created_at === undefined ? new Date() : new Date(userTarget.created_at)

  const handleChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    const value = currentTarget.value.trim()
    setAvatarUrl(value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (user !== undefined) {
      customFetch<User>(`users/${userId}/`, {
        method: 'PATCH',
        token: true,
        body: {
          avatar_url: avatarUrl.length === 0 ? null : avatarUrl
        }
      }).then(data => {
        if (typeof data.id === 'string') setUser(data)
      }).catch(e => { console.error('Error in update avatar', e) })
    }
  }

  return (
    <main className='flex items-center justify-center'>
      <section className='p-4 rounded-lg shadow-lg bg-slate-200'>
        <header className='flex gap-x-2 mb-4'>
          <img className={avatarUrl.length === 0
            ? 'rounded-full bg-gray-200'
            : 'rounded-md border border-slate-400'
          }
            src={avatarUrl.length === 0 ? '/user.png' : avatarUrl} alt={`Avatar de ${userTarget?.username ?? 'usuario'}`} width={64} height={64}
          />
          <p>
            <strong className={`text-[${MAIN_COLOR}]`}>{userTarget?.username}</strong>
            <p>{userTarget?.email}</p>
          </p>
        </header>

        <p className='flex whitespace-pre-line flex-col'>
          <strong>Miembro desde:</strong>
          <i className='text-gray-800'>{createdAt.toLocaleDateString()}, {createdAt.toLocaleTimeString()}</i>
        </p>

        {user?.id === userId && <form onSubmit={handleSubmit} className='mt-3'>
            <input onChange={handleChange}
              className='w-full min-w-[260px] px-2 py-1 rounded-md outline-none border-none bg-gray-300'
              type='url' placeholder='Ingresa la url de tu avatar' required={avatarUrl.length > 0} value={avatarUrl}
            />
            {(avatarUrl !== (user.avatar_url ?? '')) && <button
              className={`flex items-center justify-center mt-2 shadow-md hover:shadow-none transition duration-300 gap-x-2 h-full px-2 py-1 w-full rounded bg-[${MAIN_COLOR}] text-slate-200`}>
              <BiSave /> Guardar cambios
            </button>}
          </form>
        }
      </section>
    </main>
  )
}
