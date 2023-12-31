import AuthForm from '@/components/forms/auth-form'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign up'
}

export default function SignupPage () {
  return (
    <main className='min-h-screen flex justify-center items-center bg-zinc-200'>
      <AuthForm type='signup' />
    </main>
  )
}
