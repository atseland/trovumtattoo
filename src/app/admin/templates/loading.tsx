import { Skeleton } from '@/components/ui/Skeleton'

export default function TemplatesLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[28px] w-[160px] mb-3' />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className='h-[80px]' style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  )
}
