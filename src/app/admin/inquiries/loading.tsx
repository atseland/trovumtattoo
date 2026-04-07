import { Skeleton } from '@/components/ui/Skeleton'

export default function InquiriesLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[28px] w-[160px] mb-3' />
      <div className='flex gap-2 mb-3'>
        {[80, 60, 120, 100].map((w, i) => (
          <Skeleton key={i} className='h-[44px]' style={{ width: w }} />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className='h-[60px]' style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  )
}
