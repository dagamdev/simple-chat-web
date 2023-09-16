'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState, type MouseEvent } from 'react'
import { useUser } from '@/hooks'
import { customFetch } from '@/utils/services'
import { BsX } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { type User } from '@/utils/types'
import { PROJECT_NAME } from '@/utils/config'
import Button from '../ui/button'

interface AuthUserData {
  user: User
  token: string
}

export default function AuthForm ({ type }: { type: 'login' | 'signup' }) {
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [showConfir, setShowConfir] = useState(false)
  const { setUser } = useUser()
  const router = useRouter()

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fields = Object.fromEntries(new window.FormData(e.currentTarget))

    if (type === 'login') {
      customFetch<AuthUserData>('login/', {
        method: 'POST',
        body: fields
      }).then(res => {
        // if (res.status === 401) { setError('Campos inválidos\nEl coreo o la contraseña es invalida.'); return }

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
        // if (res.status === 400) {
        //   if (res.message.includes('llave duplicada') && res.message.includes('user_name')) { setError('El nombre de usuario que ingresaste ya ha sido utilizado por otro usuario.\nIngresa otro nombre de usuario'); return }
        //   if (res.message.includes('llave duplicada') && res.message.includes('email')) { setError('El correo que ingresaste pertenece a otro usuario.\nIngresa otro correo.'); return }
        // }

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
    <form className='flex flex-col gap-y-4 max-w-md' onSubmit={handlerSubmit} >
      <section className='flex items-center gap-x-2'>
        <img className='' src={'/icon.png'} alt='icon' width={40} height={40} />
        <h2 className='font-bold text-2xl text-gray-900'>{PROJECT_NAME}</h2>
      </section>

      {type === 'signup' && (
        <section className=''>
          <label htmlFor='username'>
            <span className=''>Nombre de usuario</span>
            <input className='' onChange={handlerChange} type="text"
              id='username' name='username' placeholder='&nbsp;' pattern="^[a-zA-Z0-9_-]+$" minLength={4} required
            />
          </label>
          <p className=''>Su nombre de usuario debe de ser unico y tener entre <strong>4</strong> y <strong>30</strong> caracteres, y no debe contener espacios, caracteres especiales ni emojis.</p>
        </section>
      )}

      <label htmlFor="email" className='flex flex-col'>
        <span className=''>Correo</span>
        <input className='' onChange={handlerChange} id='email' type="email" name='email' placeholder='&nbsp;' required />
      </label>

      <section className=''>
        <label htmlFor="password">
          <span className=''>Contraseña</span>
          <input className=''
            onChange={handlerChange} type={show ? 'text' : 'password'} id='password' name='password' placeholder='&nbsp;' minLength={8} maxLength={20} required
          />
        </label>
        {show ? <AiOutlineEye className='' id='password' onClick={togglePassword} /> : <AiOutlineEyeInvisible className='' id='password' onClick={togglePassword} />}
        {type === 'signup' &&
          <p className=''>Su contraseña debe tener entre <strong>8</strong> y <strong>20</strong> caracteres, contener letras y números, y no debe contener espacios, caracteres especiales ni emojis.</p>
        }
      </section>

      {type === 'signup' && <section className=''>
        <div>
          <input className='' onChange={handlerChange} type={showConfir ? 'text' : 'password'} name='confirmPassword' placeholder='&nbsp;' minLength={8} maxLength={20} required />
          <span className=''>Confirmar contraseña</span>
        </div>
        {showConfir ? <AiOutlineEye className='' id='confirmPassword' onClick={togglePassword} /> : <AiOutlineEyeInvisible className='' id='confirmPassword' onClick={togglePassword} />}
      </section>}

      {error.length > 0 && <section className=''>
        <BsX className='' onChange={handlerChange} onClick={closeError} />
        <p className=''>{error}</p>
      </section>}

      <Button >{type === 'login' ? 'Iniciar sección' : 'Registrarse'}</Button>

      {
        type === 'login'
          ? <p className=''>Aun no tienes una cuenta?, <Link className='' href={'/register'}>registrate</Link></p>
          : <p className=''>Ya tienes una cuenta?, <Link className='' href={'/login'}>inicia sesión</Link></p>
      }
    </form>
  )
}
