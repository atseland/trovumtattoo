import { Skeleton } from '@/components/ui/Skeleton'

export default function NotificationsLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-2'>
      <Skeleton className='h-[28px] w-[120px] mb-3' />
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className='h-[64px]' style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  )
}
