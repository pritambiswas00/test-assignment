type ProductPriceProps = {
  amount: number
  className?: string
  currency?: string
  locale?: string
}

export default function ProductPrice({
  amount,
  className,
  currency = "USD",
  locale = "en-US",
}: ProductPriceProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  })

  return <p className={className}>{formatter.format(amount)}</p>
}
