import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { useConversations, useUser } from '@/hooks'
import { IoSearch } from 'react-icons/io5'
import type { User } from '@/utils/types'
import type { ResultUser } from './search-result-card'
import { customFetch } from '@/utils/services'
import SearchResultCard from './search-result-card'

type SimpleUser = Pick<User, 'id' | 'username' | 'avatar_url'>

let lastFechingAt = 0

export default function ConversationsHeader () {
  const thisRef = useRef<HTMLHeadingElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()
  const { conversations } = useConversations()
  const [users, setUsers] = useState<SimpleUser[]>([])
  const [resultsUsers, setResultsUsers] = useState<ResultUser[]>([])

  useEffect(() => {
    const handleClick = (ev: MouseEvent) => {
      if (thisRef.current !== null && ev.target instanceof Node && !thisRef.current.contains(ev.target)) {
        setResultsUsers([])
        if (inputRef.current !== null) inputRef.current.value = ''
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleFocus = () => {
    const nowTime = Date.now()

    if (lastFechingAt + 60000 < nowTime) {
      customFetch<SimpleUser[]>('users/?fields=id,username,avatar_url', {
        token: true
      }).then(data => {
        // console.log(data)
        if (typeof data === 'object') {
          lastFechingAt = Date.now()
          setUsers(data)
        }
      }).catch(e => { console.error('Error in get users in searcher: ', e) })
    }
  }

  const handleChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    const value = currentTarget.value.trim()

    if (value.length !== 0) {
      const usersFilter = users.filter(u => u.id !== user?.id && u.username.toLowerCase().includes(value.toLowerCase()))

      if (usersFilter.length !== 0) {
        setResultsUsers(usersFilter.map(u => {
          const conversation = conversations.find(f => f.participants.some(p => p.id === u.id))

          return ({ ...u, conversationId: conversation === undefined ? null : conversation.id })
        }))
      } else if (resultsUsers.length !== 0) {
        setResultsUsers([])
      }
    } else if (resultsUsers.length !== 0) setResultsUsers([])
  }

  return (
    <header ref={thisRef} className='relative bg-gray-300 rounded-md z-10'>
      <label className='flex py-2 px-4 justify-between items-center relative z-10' htmlFor="search-user">
        <input className='bg-inherit outline-none border-none w-auto'
          ref={inputRef} onFocus={handleFocus} onChange={handleChange} type="text" id='search-user' placeholder='Busca una conversación'
        />
        <IoSearch className='text-xl cursor-pointer text-slate-800' />
      </label>
      <ul className={'absolute top-0 bg-gray-300 w-full rounded-md p-2 ' + (resultsUsers.length === 0
        ? ''
        : 'pt-[50px] after:absolute after:top-[40px] after:w-full after:h-px after:left-0 after:bg-gray-600'
      )}
      >{resultsUsers.map(ru => <SearchResultCard key={ru.id} resultUser={ru} closeResults={() => { setResultsUsers([]) }} />)}</ul>
    </header>
  )
}
