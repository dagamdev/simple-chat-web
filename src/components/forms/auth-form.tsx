'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, type FormEvent, type MouseEvent } from 'react'
import { useUser } from '@/hooks'
import { customFetch } from '@/utils/services'
import { BsX } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { type User } from '@/utils/types'
import { MAIN_COLOR, PROJECT_NAME } from '@/utils/config'

interface AuthUserData {
  user: User
  token: string
}

export default function AuthForm ({ type }: { type: 'login' | 'signup' }) {
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [showConfir, setShowConfir] = useState(false)
  const { user, setUser } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user !== undefined) router.push('/conversations')
  }, [])

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fields = Object.fromEntries(new window.FormData(e.currentTarget))

    if (type === 'login') {
      customFetch<AuthUserData>('login/', {
        method: 'POST',
        body: fields
      }).then(res => {
        if (res.token !== undefined) {
          localStorage.setItem('token', res.token)
          setUser(res.user)
          router.push('/')
        }
      }).catch(() => {
        console.error('Error in login')
      })
    } else {
      if (fields.password !== fields.confirmPassword) {
        setError('Las contraseñas son diferentes')
        return
      }

      customFetch<AuthUserData>('signup/', {
        method: 'POST',
        body: fields
      }).then(res => {
        if (res.token !== undefined) {
          localStorage.setItem('token', res.token)
          setUser(res.user)
          router.push('/')
        }
      }).catch(() => {
        console.error('Error in register')
      })
    }
  }

  const togglePassword = ({ currentTarget: { id } }: MouseEvent<SVGElement>) => {
    if (id === 'password') setShow(s => !s)
    else setShowConfir(sc => !sc)
  }

  const closeError = () => {
    setError('')
  }

  const handlerChange = () => {
    if (error.length > 0) setError('')
  }

  return (
    <form className='space-y-4 max-w-md bg-neutral-100 p-4 rounded-xl shadow-xl'
      onSubmit={handlerSubmit}
    >
      <section className='flex items-center justify-center gap-x-2 my-2'>
        <img className='' src={'/icon.png'} alt='icon' width={50} height={50} />
        <h2 className={`text-[${MAIN_COLOR}] font-bold text-3xl`}>{PROJECT_NAME}</h2>
      </section>

      {type === 'signup' && (
        <section className=''>
          <label className='flex flex-col font-medium text-gray-900'
            htmlFor='username'
          >
            Nombre de usuario
            <input className={'bg-transparent mt-1 border-2 border-gray-500 rounded-md py-1 px-3 outline-none ring-1 focus:ring-[#4A87C9] focus:border-[#4A87C9] valid:border-[#4A87C9]'}
              onChange={handlerChange} type="text"
              id='username' name='username' placeholder='&nbsp;' pattern="^[a-zA-Z0-9_-]+$" minLength={4} required
            />
          </label>
          <p className='text-sm text-neutral-700 px-1'>Su nombre de usuario debe de ser unico y tener entre <strong>4</strong> y <strong>30</strong> caracteres, y no debe contener espacios, caracteres especiales ni emojis.</p>
        </section>
      )}

      <label htmlFor="email" className='flex flex-col font-medium text-gray-900'>
        Correo
        <input className='bg-transparent mt-1 border-2 border-gray-500 rounded-md py-1 px-3 outline-none ring-1 focus:ring-[#4A87C9] focus:border-[#4A87C9] valid:border-[#4A87C9]'
          onChange={handlerChange} id='email' type="email" name='email' placeholder='&nbsp;' required />
      </label>

      <section className=''>
        <label className='flex flex-col relative font-medium text-gray-900' htmlFor="password">
          Contraseña
          <input className='bg-transparent mt-1 border-2 border-gray-500 rounded-md py-1 px-3 outline-none ring-1 focus:ring-[#4A87C9] focus:border-[#4A87C9] valid:border-[#4A87C9]'
            onChange={handlerChange} type={show ? 'text' : 'password'} id='password' name='password' placeholder='&nbsp;' minLength={8} maxLength={20} required
          />
          {show
            ? <AiOutlineEye className='absolute right-3 bottom-2 cursor-pointer text-lg' id='password' onClick={togglePassword} />
            : <AiOutlineEyeInvisible className='absolute right-3 bottom-2 cursor-pointer text-lg' id='password' onClick={togglePassword} />
          }
        </label>
        {type === 'signup' &&
          <p className='text-sm text-neutral-700 px-1'>Su contraseña debe tener entre <strong>8</strong> y <strong>20</strong> caracteres, contener letras y números, y no debe contener espacios, caracteres especiales ni emojis.</p>
        }
      </section>

      {type === 'signup' && <section className=''>
        <label className='flex flex-col font-medium text-gray-900 relative' htmlFor='confirmPassword'>
          Confirmar contraseña
          <input className='bg-transparent mt-1 border-2 border-gray-500 rounded-md py-1 px-3 outline-none ring-1 focus:ring-[#4A87C9] focus:border-[#4A87C9] valid:border-[#4A87C9]'
            onChange={handlerChange} type={showConfir ? 'text' : 'password'} name='confirmPassword' placeholder='&nbsp;' minLength={8} maxLength={20} required
          />
          {showConfir
            ? <AiOutlineEye className='absolute right-3 bottom-2 cursor-pointer text-lg' id='confirmPassword' onClick={togglePassword} />
            : <AiOutlineEyeInvisible className='absolute right-3 bottom-2 cursor-pointer text-lg' id='confirmPassword' onClick={togglePassword} />
          }
        </label>
      </section>}

      {error.length > 0 && <section className='relative px-3 py-2 rounded-md bg-red-200 border border-red-400 text-red-500 font-medium'>
        <BsX className='absolute top-2 right-3 text-2xl cursor-pointer' onChange={handlerChange} onClick={closeError} />
        <p className=''>{error}</p>
      </section>}

      <button className='w-full text-neutral-50 bg-[#4A87C9] hover:brightness-125 rounded-md py-2.5 text-center'
      >{type === 'login' ? 'Iniciar sección' : 'Registrarse'}</button>

      <p className='text-center text-gray-800'>{type === 'login'
        ? 'Aun no tienes una cuenta'
        : 'Ya tienes una cuenta'}?, <Link className={`text-[${MAIN_COLOR}] underline hover:no-underline underline-offset-2`}
        href={`/${type === 'login'
          ? 'signup'
          : 'login'
        }`}>{type === 'login'
          ? 'registrate'
          : 'inicia sesión'
        }</Link></p>
    </form>
  )
}
