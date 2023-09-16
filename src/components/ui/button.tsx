import { type ButtonHTMLAttributes } from 'react'
import { MAIN_COLOR } from '@/utils/config'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: 'default' | 'main'
}

export default function Button ({ styleType, ...props }: ButtonProps) {
  const borderColor = `border-[${MAIN_COLOR}]`
  // console.log(borderColor)

  return (
    <button className={'font-bold px-10 py-2 rounded-lg shadow border-2 m-2 ' + (styleType === 'main'
      ? `bg-[${MAIN_COLOR}] ${borderColor}`
      : ('border-2 ' + borderColor)
    )}
      {...props}>
    </button>
  )
}
