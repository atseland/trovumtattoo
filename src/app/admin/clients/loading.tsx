import { Skeleton } from '@/components/ui/Skeleton'

export default function ClientsLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[28px] w-[120px] mb-3' />
      <Skeleton className='h-[44px] max-w-[400px] mb-2' />
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className='h-[60px]' style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  )
}
