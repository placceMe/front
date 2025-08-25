export const formatPrice = (
  value: number,
  currency: string,
  rates: Record<string, number>
): string => {
  if (!rates || !rates[currency]) return `${value} ${currency}`;

  const converted = currency === 'UAH'
    ? value
    : value / rates[currency]; // делим, не умножаем!

  const symbol = currency === 'UAH' ? 'грн' : currency;

  // если цена меньше 1 — показываем 2 знака после запятой
  const formatted = converted < 1
    ? converted.toFixed(2)
    : Math.round(converted).toLocaleString();

  return `${formatted} ${symbol}`;
};
