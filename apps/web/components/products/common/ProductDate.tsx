type ProductDateProps = {
  value: string
  className?: string
  locale?: string
}

export default function ProductDate({ value, className, locale = "en-US" }: ProductDateProps) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  })

  return <p className={className}>{formatter.format(parsedDate)}</p>
}
