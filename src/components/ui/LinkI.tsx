import { AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

interface LinkIProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  children: ReactNode
  className?: string
}

export function LinkI({ href, children, className = '', ...rest }: LinkIProps) {
  return (
    <Link
      href={href}
      className={`font-serif italic text-[14px] text-accent border-b border-[rgba(160,148,136,0.28)] no-underline transition-colors duration-[200ms] hover:text-paper ${className}`}
      {...rest}
    >
      {children}
    </Link>
  )
}
