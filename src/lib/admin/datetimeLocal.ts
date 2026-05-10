function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function toDatetimeLocal(timestamp: number) {
  const date = new Date(timestamp)
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

export function fromDatetimeLocal(value: string) {
  return new Date(value).getTime()
}
