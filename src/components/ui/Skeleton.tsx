interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`bg-[rgba(237,233,230,0.04)] animate-pulse ${className}`}
      style={style}
    />
  )
}
