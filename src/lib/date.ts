export function formatIsoDateToBrazilian(value?: string | null) {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  return year && month && day ? `${day}/${month}/${year}` : ""
}

export function parseBrazilianDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)

  if (!match) return null

  const [, day, month, year] = match
  const isoDate = `${year}-${month}-${day}`
  const date = new Date(`${isoDate}T00:00:00Z`)

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  )
    return null

  return isoDate
}

export function formatBrazilianDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)

  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join("/")
}
