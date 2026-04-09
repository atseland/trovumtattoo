import { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  withLine?: boolean
  className?: string
}

export function Eyebrow({ children, withLine = false, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[9px] tracking-[0.22em] uppercase text-index-num ${className}`}>
      {withLine && <span className='block h-px w-5 shrink-0 bg-index-num' />}
      {children}
    </div>
  )
}
