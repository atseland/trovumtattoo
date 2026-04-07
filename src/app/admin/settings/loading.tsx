import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsLoading() {
  return (
    <div className='max-w-2xl flex flex-col gap-6'>
      <Skeleton className='h-[28px] w-[160px]' />
      <Skeleton className='h-[100px]' />
      <Skeleton className='h-[100px]' />
    </div>
  )
}
