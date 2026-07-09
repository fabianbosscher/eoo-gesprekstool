const LONG_FORMATTER = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const SHORT_FORMATTER = new Intl.DateTimeFormat('nl-NL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatDateNL(input: Date | string, style: 'long' | 'short' = 'long'): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return style === 'long' ? LONG_FORMATTER.format(date) : SHORT_FORMATTER.format(date)
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000)
}
