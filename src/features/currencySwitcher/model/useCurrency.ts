import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchNbuRates } from '@shared/api/currency';
import { setRates } from '@shared/currency/model/currencySlice';


export const useCurrency = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchNbuRates().then((rates) => {
      dispatch(setRates(rates));
    });
  }, [dispatch]);
};
