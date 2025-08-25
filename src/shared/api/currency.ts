export const fetchNbuRates = async () => {
  const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
  const data = await res.json();

  const result = { UAH: 1, USD: 0, EUR: 0 };

  for (const item of data) {
    if (item.cc === 'USD') result.USD = item.rate;
    if (item.cc === 'EUR') result.EUR = item.rate;
  }

  return result;
};
