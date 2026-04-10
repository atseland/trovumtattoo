import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'sm' | 'action' | 'action-primary' | 'action-cta'

interface BtnBaseProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

interface BtnButtonProps extends BtnBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never
}

interface BtnLinkProps extends BtnBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string
}

type BtnProps = BtnButtonProps | BtnLinkProps

const variantClasses: Record<Variant, string> = {
  default: [
    'inline-flex items-center justify-center',
    'min-h-[44px] px-5 py-3',
    'bg-transparent border border-[rgba(237,233,230,0.24)]',
    'text-paper font-sans text-[11px] tracking-[0.13em] uppercase',
    'transition-[background,border-color] duration-[250ms]',
    'hover:bg-[rgba(237,233,230,0.04)] hover:border-[rgba(237,233,230,0.40)]',
    'active:scale-[0.985]',
    'cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  sm: [
    'inline-flex items-center justify-center',
    'min-h-[40px] px-4 py-2',
    'bg-transparent border border-[rgba(237,233,230,0.12)]',
    'text-nav font-sans text-[10px] tracking-[0.12em] uppercase',
    'transition-[background,border-color,color] duration-[250ms]',
    'hover:text-paper hover:border-[rgba(237,233,230,0.22)] hover:bg-[rgba(237,233,230,0.03)]',
    'active:scale-[0.985]',
    'cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  action: [
    'flex items-center justify-center w-full',
    'min-h-[50px] px-5 py-3',
    'bg-transparent border border-[rgba(237,233,230,0.14)]',
    'text-paper font-sans text-[11px] tracking-[0.12em] uppercase',
    'transition-[background,border-color,transform] duration-[250ms]',
    'hover:bg-[rgba(237,233,230,0.04)] hover:border-[rgba(237,233,230,0.30)] hover:-translate-y-px',
    'active:scale-[0.985]',
    'cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  'action-primary': [
    'flex items-center justify-center w-full',
    'min-h-[50px] px-5 py-3',
    'bg-[rgba(237,233,230,0.025)] border border-[rgba(237,233,230,0.28)]',
    'text-paper font-sans text-[11px] tracking-[0.12em] uppercase',
    'transition-[background,border-color,transform] duration-[250ms]',
    'hover:bg-[rgba(237,233,230,0.04)] hover:border-[rgba(237,233,230,0.30)] hover:-translate-y-px',
    'active:scale-[0.985]',
    'cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  'action-cta': [
    'flex items-center justify-center w-full',
    'min-h-[52px] px-5 py-3.5',
    'bg-[rgba(237,233,230,0.06)] border border-[rgba(237,233,230,0.32)]',
    'shadow-[0_0_12px_rgba(237,233,230,0.03),0_0_2px_rgba(237,233,230,0.05)]',
    'text-paper font-sans text-[11.5px] tracking-[0.11em] uppercase',
    'transition-[background,border-color,transform] duration-[250ms]',
    'hover:bg-[rgba(237,233,230,0.05)] hover:border-[rgba(237,233,230,0.40)] hover:-translate-y-px',
    'active:scale-[0.985]',
    'cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

export function Btn(props: BtnProps) {
  const { variant = 'default', children, className = '', href, ...rest } = props
  const classes = cn(variantClasses[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
