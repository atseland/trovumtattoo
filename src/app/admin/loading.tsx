import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className='flex flex-col gap-3 pt-1'>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className='h-[72px]' style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  )
}
