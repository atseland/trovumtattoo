import { Skeleton } from '@/components/ui/Skeleton'

export default function ClientDetailLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[40px] w-[160px]' />
      <Skeleton className='h-[160px]' />
      <Skeleton className='h-[100px]' />
    </div>
  )
}
