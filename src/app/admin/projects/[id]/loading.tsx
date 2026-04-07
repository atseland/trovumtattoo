import { Skeleton } from '@/components/ui/Skeleton'

export default function ProjectDetailLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[40px] w-[160px]' />
      <Skeleton className='h-[52px]' />
      <Skeleton className='h-[140px]' />
      <Skeleton className='h-[180px]' />
    </div>
  )
}
