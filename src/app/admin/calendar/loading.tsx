import { Skeleton } from '@/components/ui/Skeleton'

export default function CalendarLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-6'>
      {[1, 2].map((i) => (
        <div key={i} className='flex flex-col gap-2'>
          <Skeleton className='h-[16px] w-[180px]' />
          <Skeleton className='h-[64px]' />
          <Skeleton className='h-[64px]' />
        </div>
      ))}
    </div>
  )
}
