import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversations'
}

export default function ConversationsPage () {
  return (
    <section className='flex flex-1 items-center justify-center'>
      <strong >Seleciona o crea una conversación</strong>
    </section>
  )
}
