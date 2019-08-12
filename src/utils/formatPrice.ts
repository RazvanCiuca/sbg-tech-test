export function formatPrice(price: any, format: string) {
  return format === 'fraction'
    ? `${price.num}/${price.den}`
    : `${Math.round(price.decimal * 100) / 100}`
}