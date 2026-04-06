export function Rule({ className = '' }: { className?: string }) {
  return <hr className={`w-full h-px bg-rule-inner border-none my-4 ${className}`} />
}
