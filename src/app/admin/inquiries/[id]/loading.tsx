import { Skeleton } from '@/components/ui/Skeleton'

export default function InquiryDetailLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-3'>
      <Skeleton className='h-[44px] w-[200px]' />
      <Skeleton className='h-[48px]' />
      <Skeleton className='h-[180px]' />
      <Skeleton className='h-[120px]' />
    </div>
  )
}
