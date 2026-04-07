'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, forwardRef } from 'react'

const inputClasses = [
  'w-full min-h-[44px] px-4 py-3',
  'bg-[rgba(237,233,230,0.03)] border border-[rgba(237,233,230,0.14)]',
  'text-paper font-sans text-[14px] leading-[1.5]',
  'placeholder:text-mast-left placeholder:opacity-100',
  'transition-[border-color,background] duration-[200ms]',
  'focus:outline-none focus:border-[rgba(237,233,230,0.35)] focus:bg-[rgba(237,233,230,0.05)]',
  'disabled:opacity-40',
].join(' ')

const labelClasses = 'block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[6px]'
const errorClasses = 'font-sans text-[12px] mt-1 text-[#af8c87]'

interface LabelOptionalProps {
  children: ReactNode
}

function LabelOptional({ children }: LabelOptionalProps) {
  return (
    <span className='font-serif italic text-[12px] text-mast-left normal-case tracking-normal ml-[6px]'>
      {children}
    </span>
  )
}

interface FieldWrapperProps {
  label?: string
  optional?: boolean
  error?: string
  children: ReactNode
  className?: string
}

function FieldWrapper({ label, optional, error, children, className = '' }: FieldWrapperProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className={labelClasses}>
          {label}
          {optional && <LabelOptional>valgfritt</LabelOptional>}
        </label>
      )}
      {children}
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  )
}

// Text Input
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  optional?: boolean
  error?: string
  wrapperClassName?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, optional, error, wrapperClassName, className = '', ...props }, ref) => (
    <FieldWrapper label={label} optional={optional} error={error} className={wrapperClassName}>
      <input
        ref={ref}
        className={`${inputClasses} ${error ? 'border-[rgba(175,140,135,0.5)]' : ''} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
)
InputField.displayName = 'InputField'

// Textarea
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  optional?: boolean
  error?: string
  wrapperClassName?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, optional, error, wrapperClassName, className = '', ...props }, ref) => (
    <FieldWrapper label={label} optional={optional} error={error} className={wrapperClassName}>
      <textarea
        ref={ref}
        className={`${inputClasses} min-h-[120px] resize-y ${error ? 'border-[rgba(175,140,135,0.5)]' : ''} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
)
TextareaField.displayName = 'TextareaField'

// Select
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  optional?: boolean
  error?: string
  wrapperClassName?: string
  children: ReactNode
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, optional, error, wrapperClassName, className = '', children, ...props }, ref) => (
    <FieldWrapper label={label} optional={optional} error={error} className={wrapperClassName}>
      <div className='relative'>
        <select
          ref={ref}
          className={`${inputClasses} appearance-none pr-9 ${error ? 'border-[rgba(175,140,135,0.5)]' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {/* Custom chevron */}
        <svg
          className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          style={{ color: 'var(--nav)' }}
        >
          <path d='M2 4l4 4 4-4' />
        </svg>
      </div>
    </FieldWrapper>
  )
)
SelectField.displayName = 'SelectField'

// File upload
interface FileUploadFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  optional?: boolean
  error?: string
  wrapperClassName?: string
}

export const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(
  ({ label, optional, error, wrapperClassName, className = '', ...props }, ref) => (
    <FieldWrapper label={label} optional={optional} error={error} className={wrapperClassName}>
      <div
        className={`min-h-[80px] border border-dashed border-[rgba(237,233,230,0.18)] flex flex-col items-center justify-center p-5 cursor-pointer transition-[border-color,background] duration-[200ms] hover:border-[rgba(237,233,230,0.30)] hover:bg-[rgba(237,233,230,0.03)] ${error ? 'border-[rgba(175,140,135,0.5)]' : ''} ${className}`}
      >
        <input ref={ref} type='file' className='sr-only' {...props} />
        <span className='font-sans text-[12px] text-mast-left'>Klikk for å velge filer</span>
      </div>
    </FieldWrapper>
  )
)
FileUploadField.displayName = 'FileUploadField'
