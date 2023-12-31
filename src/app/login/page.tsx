import AuthForm from '@/components/forms/auth-form'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'log in'
}

export default function LoginPage () {
  return (
    <main className='min-h-screen flex justify-center items-center bg-zinc-200'>
      <AuthForm type='login' />
    </main>
  )
}
