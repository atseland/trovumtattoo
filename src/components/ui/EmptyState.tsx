import { ReactNode } from 'react'
import { Btn } from './Btn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  text?: string
  action?: { label: string; onClick: () => void }
  variant?: 'default' | 'error'
  className?: string
}

export function EmptyState({ icon, title, text, action, variant = 'default', className = '' }: EmptyStateProps) {
  const iconColor = variant === 'error' ? '#af8c87' : 'var(--nav)'
  const iconOpacity = variant === 'error' ? 0.35 : 0.25

  return (
    <div className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      <div
        className='w-12 h-12 mb-4'
        style={{ color: iconColor, opacity: iconOpacity }}
      >
        {icon}
      </div>
      <p className='font-serif italic text-[18px] text-nav mb-[6px]'>{title}</p>
      {text && (
        <p className='font-sans text-[13px] text-mast-left max-w-[32ch] leading-[1.6] mb-4'>{text}</p>
      )}
      {action && (
        <Btn variant='sm' onClick={action.onClick}>
          {action.label}
        </Btn>
      )}
    </div>
  )
}
