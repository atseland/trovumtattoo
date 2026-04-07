import { Skeleton } from '@/components/ui/Skeleton'

export default function BookLoading() {
  return (
    <div className='mx-auto max-w-2xl px-pad py-12 flex flex-col gap-4'>
      <Skeleton className='h-[48px] w-[280px]' />
      <Skeleton className='h-[44px]' />
      <Skeleton className='h-[44px]' />
      <Skeleton className='h-[80px]' />
      <Skeleton className='h-[44px]' />
      <Skeleton className='h-[52px] max-w-xs' />
    </div>
  )
}
