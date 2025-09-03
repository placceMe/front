import { Button, InputNumber } from 'antd';
import type { CartItem } from '@shared/types/cart';
import { useState } from 'react';
import { formatPrice } from '@shared/lib/formatPrice';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';

interface Props {
  item: CartItem;
  onChangeQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const FILES_BASE_URL = __BASE_URL__ + '/api/files/';

//const FILES_BASE_URL = "http://31.42.190.94:8080/api/files/";





// TODO useRerequest 

export const CartItemCard = ({ item, onChangeQuantity, onRemove }: Props) => {
  const { product, quantity } = item;
  const { current, rates } = useSelector((state: RootState) => state.currency);
  const formatted = formatPrice(product.price, current, rates);


  const imgUrl = product.mainImageUrl
    ? FILES_BASE_URL + product.mainImageUrl
    : '/no-photo.jpg';

  const [imgSrc, setImgSrc] = useState(imgUrl);

  return (
    <div className="flex items-center justify-between border-b py-4 gap-4">

      <img
        src={imgSrc}
        alt={product.title || 'Фото товару'}
        className="w-20 h-20 object-cover rounded"
        onError={() => setImgSrc('/no-photo.jpg')}
      />

      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{product.title || 'Без назви'}</div>
        <div className="text-gray-500 truncate">{product.description || ''}</div>
        <div className="mt-1 font-bold">{formatted} </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <InputNumber
          min={1}
          value={quantity}
          onChange={value => onChangeQuantity(product.id, value || 1)}
        />
        <Button danger type="text" onClick={() => onRemove(product.id)}>
          ✕
        </Button>
      </div>
    </div>
  );
};
