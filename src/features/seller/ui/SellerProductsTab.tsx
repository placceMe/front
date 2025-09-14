/*import React, { useEffect, useState } from 'react';
import { Button, Table, message, InputNumber, Space, Modal, Image } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@shared/request/useRequest';
import type { Product } from '@shared/types/api';
import { AddProductCard } from '@widgets/AddProductCard';


const GRID_CSS = `
.seller-products-tab .products-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  padding: 16px 0;
}

.seller-products-tab .product-item {
  background: rgba(244, 245, 234, 0.8);
  border: 1px solid #C9CFB8;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.seller-products-tab .product-item:hover {
  background: rgba(237, 238, 223, 0.9);
  box-shadow: 0 4px 12px rgba(43, 57, 36, 0.15);
}

.seller-products-tab .product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.seller-products-tab .product-title {
  font-size: 16px;
  font-weight: 600;
  color: #2b3924;
  margin-bottom: 8px;
  line-height: 1.3;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.seller-products-tab .product-price {
  font-size: 18px;
  font-weight: 700;
  color: #2b3924;
  margin-bottom: 12px;
}

.seller-products-tab .quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.seller-products-tab .product-actions {
  display: flex;
  gap: 8px;
}
`;

type SellerProductsTabProps = {
  sellerId: string;
};

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

export const SellerProductsTab: React.FC<SellerProductsTabProps> = ({ sellerId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState<Record<string, boolean>>({});
  const { request } = useRequest();
  const navigate = useNavigate();

  // Inject CSS
  React.useEffect(() => {
    const styleId = 'seller-products-tab-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(GRID_CSS));
    document.head.appendChild(style);
  }, []);

  const fetchProducts = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const response = await request<any>(`/api/products/seller/${sellerId}?limit=100&offset=0`);
      const items = Array.isArray(response?.products) ? response.products : [];
      setProducts(items);
    } catch (error) {
      message.error('Помилка завантаження товарів');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setUpdatingQuantity(prev => ({ ...prev, [productId]: true }));
    try {
      // Если нет отдельного endpoint'а для количества, используем полное обновление
      const currentProduct = await request<any>(`/api/products/${productId}`);
      
      const updatedProduct = {
        title: currentProduct.title,
        description: currentProduct.description,
        price: currentProduct.price,
        color: currentProduct.color,
        weight: currentProduct.weight,
        mainImageUrl: currentProduct.mainImageUrl,
        categoryId: currentProduct.categoryId,
        quantity: newQuantity
      };
      
      await request(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));
      message.success('Кількість оновлено');
    } catch (error) {
      message.error('Помилка оновлення кількості');
    } finally {
      setUpdatingQuantity(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const getImageUrl = (product: Product) => {
    if (!product.mainImageUrl) return '/assets/placeholder-product.png';
    if (product.mainImageUrl.startsWith('http')) return product.mainImageUrl;
    return `${FILES_BASE_URL}${product.mainImageUrl}`;
  };

  if (showAddProduct) {
    return (
      <div className="seller-products-tab">
        <div className="mb-4 flex items-center justify-between">
          <Button 
            onClick={() => setShowAddProduct(false)}
            icon={<EditOutlined />}
          >
            Повернутися до списку товарів
          </Button>
        </div>
        <AddProductCard sellerId={sellerId} />
      </div>
    );
  }

  return (
    <div className="seller-products-tab">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#2b3924] m-0">
          Мої товари ({products.length})
        </h3>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddProduct(true)}
          className="!bg-[#2b3924] hover:!bg-[#22301c] !border-[#2b3924] rounded-lg"
        >
          Додати новий товар
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-[#2b3924]">Завантаження товарів...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">У вас поки немає товарів</div>
          <Button 
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowAddProduct(true)}
            className="!bg-[#2b3924] hover:!bg-[#22301c] !border-[#2b3924] rounded-lg"
          >
            Створити перший товар
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <Image
                src={getImageUrl(product)}
                alt={product.title}
                className="product-image"
                fallback="/assets/placeholder-product.png"
                preview={{
                  mask: <div className="text-white text-xs">Переглянути</div>
                }}
              />
              
              <div className="product-title">{product.title}</div>
              
              <div className="product-price">{product.price} грн</div>
              
              <div className="quantity-controls">
                <span className="text-sm text-[#2b3924] font-medium">Кількість:</span>
                <InputNumber
                  size="small"
                  value={product.quantity || 0}
                  min={0}
                  style={{ width: 80 }}
                  onChange={(value) => value !== null && handleQuantityChange(product.id, value)}
              //    loading={updatingQuantity[product.id]}
                  controls={{
                    upIcon: <span>+</span>,
                    downIcon: <span>−</span>
                  }}
                />
                <span className={`text-xs ${(product.quantity || 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {(product.quantity || 0) > 0 ? 'В наявності' : 'Немає в наявності'}
                </span>
              </div>
              
              <div className="product-actions">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEditProduct(product.id)}
                  className="flex-1"
                >
                  Редагувати
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

*/
// Обновлённый SellerProductsTab с API /api/Products/{id}/quantity
import React, { useEffect, useState } from 'react';
import { Button, message, InputNumber, Modal, Image, Select } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@shared/request/useRequest';
import type { Product } from '@shared/types/api';
import { AddProductCard } from '@widgets/AddProductCard';
import Operation from 'antd/es/transfer/operation';

const GRID_CSS = `
.seller-products-tab .products-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  padding: 16px 0;
}

.seller-products-tab .product-item {
  background: rgba(237, 238, 223, 0.9);
  border: 1px solid #C9CFB8;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.seller-products-tab .product-item:hover {
  background: rgba(244, 245, 234, 0.95);
  box-shadow: 0 4px 12px rgba(43, 57, 36, 0.15);
}

.seller-products-tab .product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  margin-bottom: 12px;
  display: block;
}


.seller-products-tab .product-title {
  font-size: 16px;
  font-weight: 600;
  color: #2b3924;
  margin-bottom: 8px;
  line-height: 1.3;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.seller-products-tab .product-price {
  font-size: 18px;
  font-weight: 700;
  color: #2b3924;
  margin-bottom: 12px;
}

.seller-products-tab .quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.seller-products-tab .product-actions {
  display: flex;
  gap: 8px;
}
`;

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

export const SellerProductsTab: React.FC<{ sellerId: string }> = ({ sellerId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const { request } = useRequest();
  const navigate = useNavigate();
  const [operation,setOperation] = useState("add");

  useEffect(() => {
    const styleId = 'seller-products-tab-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.appendChild(document.createTextNode(GRID_CSS));
      document.head.appendChild(style);
    }
  }, []);

  const fetchProducts = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const response = await request<any>(`/api/products/seller/${sellerId}?limit=100&offset=0`);
      setProducts(Array.isArray(response?.products) ? response.products : []);
    } catch {
      message.error('Помилка завантаження товарів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleOpenQuantityModal = (product: Product) => {
    setEditingProductId(product.id);
    setTempQuantity(product.quantity || 0);
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = async () => {
    if (!editingProductId) return;
    try {
      await request(`/api/products/${editingProductId}/quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: operation,
          quantity: tempQuantity
        })
      });
      message.success('Кількість оновлено');
      setQuantityModalVisible(false);
      fetchProducts();
    } catch {
      message.error('Помилка оновлення кількості');
    }
  };

  const getImageUrl = (product: Product) => {
    if (!product.mainImageUrl) return '/assets/placeholder-product.png';
    return product.mainImageUrl.startsWith('http') ? product.mainImageUrl : `${FILES_BASE_URL}${product.mainImageUrl}`;
  };

  if (showAddProduct) {
    return (
      <div className="seller-products-tab">
        <div className="mb-4 flex items-center justify-between">
          <Button onClick={() => setShowAddProduct(false)} icon={<EditOutlined />}>Назад</Button>
        </div>
        <AddProductCard sellerId={sellerId} />
      </div>
    );
  }

  return (
    <div className="seller-products-tab">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#2b3924]">Мої товари ({products.length})</h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowAddProduct(true)}
          className="!bg-[#2b3924] hover:!bg-[#22301c] !border-[#2b3924] rounded-lg"
        >
          Додати новий товар
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[#2b3924]">Завантаження товарів...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">У вас поки немає товарів</div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => setShowAddProduct(true)}
            className="!bg-[#2b3924] hover:!bg-[#22301c] !border-[#2b3924] rounded-lg"
          >
            Створити перший товар
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <Image
                src={getImageUrl(product)}
                alt={product.title}
                className="product-image"
                fallback="/assets/placeholder-product.png"
              />
              <div className="product-title">{product.title}</div>
              <div className="product-price">{product.price} грн</div>
              <div className="quantity-controls">
                <span className="text-sm text-[#2b3924] font-medium">Кількість:</span>
                <span className="text-sm font-bold">{product.quantity ?? 0}</span>
              </div>
              <div className="product-actions">
<Button
  size="small"
  icon={<EditOutlined />}
  onClick={() => handleEditProduct(product.id)}
  className="flex-1"
  style={{
    background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 250%), #E5AC30`,
    backgroundBlendMode: 'multiply',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    padding: '18px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }}
>
  Редагувати
</Button>


<Button
  size="small"
  onClick={() => handleOpenQuantityModal(product)}
  className="flex-1"
  style={{
    background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 250%), #8D8C5F`,
    backgroundBlendMode: 'multiply',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    padding: '18px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }}
>
  Змінити к-сть
</Button>




              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Змінити кількість"
        open={quantityModalVisible}
        onCancel={() => setQuantityModalVisible(false)}
        onOk={handleConfirmQuantity}
        okText="Зберегти"
        cancelText="Скасувати"
      >
        <Select value={operation} onChange={setOperation} options={[{
          value: "set", label: "Встановити к-сть"
        },
        {
          value: 'minus', label: 'Відняти'
        },
        { 
          value: 'add', label: 'Додати' 
        }
        ]}
        />
        <InputNumber
          min={0}
          value={tempQuantity}
          onChange={(value) => setTempQuantity(value || 0)}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  );
};