import { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  withLine?: boolean
  className?: string
}

export function Eyebrow({ children, withLine = false, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[8px] tracking-[0.24em] uppercase text-index-num ${className}`}>
      {withLine && <span className='block w-4 h-px bg-index-num shrink-0' />}
      {children}
    </div>
  )
}
