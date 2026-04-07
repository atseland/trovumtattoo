import { Skeleton } from '@/components/ui/Skeleton'

export default function SearchLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[52px]' />
    </div>
  )
}
