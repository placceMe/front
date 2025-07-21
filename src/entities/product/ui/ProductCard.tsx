/*import { Card, Image, Button, Rate } from 'antd';
import type { Product } from '@shared/types/api';

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: Props) => {
  const image = product.attachments[0]?.filePath;

  return (
    <Card
      hoverable
      cover={<Image alt={product.title} src={image} height={200} />}
      style={{ width: 300, margin: 8 }}
    >
      <Card.Meta title={product.title} description={product.description} />
      <div style={{ marginTop: 12 }}>
        <strong>{product.price} ₴</strong>
        <Rate disabled defaultValue={4} />
        <Button type="primary" onClick={() => onAddToCart?.(product)} block>
          Додати в кошик
        </Button>
      </div>
    </Card>
  );
};
*/