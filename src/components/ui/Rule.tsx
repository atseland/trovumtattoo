export function Rule({ className = '' }: { className?: string }) {
  return <hr className={`h-px w-full border-none bg-rule-inner ${className}`} />
}
