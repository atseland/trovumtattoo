import type { InputHTMLAttributes } from 'react'

interface BookingReferenceImagesSectionProps {
  error?: string
  fileNames: string[]
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function BookingReferenceImagesSection({
  error,
  fileNames,
  inputProps,
}: BookingReferenceImagesSectionProps) {
  return (
    <div>
      <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[6px]'>
        Referansebilder (maks 10)
        <span className='font-serif italic text-[12px] text-mast-left normal-case tracking-normal ml-[6px]'>
          valgfritt
        </span>
      </label>
      <div className='min-h-[80px] border border-dashed border-[rgba(237,233,230,0.18)] flex flex-col items-center justify-center p-5 transition-[border-color,background] duration-[200ms] hover:border-[rgba(237,233,230,0.30)] hover:bg-[rgba(237,233,230,0.03)]'>
        <label className='cursor-pointer font-sans text-[13px] text-mast-left hover:text-nav transition-colors duration-[200ms]'>
          Klikk for å velge filer
          <input {...inputProps} type='file' accept='image/jpeg,image/png,image/webp' multiple className='sr-only' />
        </label>
        {fileNames.length > 0 && (
          <ul className='mt-2 font-sans text-[12px] text-mast-left text-center'>
            {fileNames.map((name) => <li key={name}>— {name}</li>)}
          </ul>
        )}
      </div>
      {error && (
        <p className='font-sans text-[12px] mt-1 text-[#af8c87]'>{error}</p>
      )}
    </div>
  )
}
