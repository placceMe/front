/*import { useAppSelector } from '../../../app/store/hooks';
import { Button, Checkbox, Form, Input, Radio, Typography } from 'antd';
import type { OrderPayload } from '@shared/types/order';
import type { CheckoutFormData } from '../model/checkoutSlice';

interface Props {
  onSubmit: (order: OrderPayload) => void;
}

export const CheckoutForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();
  const items = useAppSelector(state => state.cart.items);
const user = JSON.parse(localStorage.getItem('user') || '{}');

const handleFinish = (values: CheckoutFormData) => {
  console.log("cart items", items);
  const payload: OrderPayload = {
   userId: user.id || '', 
    items: items.map(item => ({
  productId: item.product?.id ?? "",
  productName: item.product?.title ?? "",
  price: item.product?.price ?? 0,
  quantity: item.quantity,
  mainImageUrl: item.product.mainImageUrl,
}))
,
    deliveryAddress: `${values.city}, ${values.address}`,
    paymentMethod: values.paymentMethod,
    agree: values.agree
  };
  onSubmit(payload);
  
};



  return (
    <Form
  form={form}
  layout="vertical"
  onFinish={handleFinish}
  className="space-y-6"
>
 
  <div>
    <Typography.Title level={4}>Спосіб доставки</Typography.Title>
    <Form.Item name="delivery" rules={[{ required: true, message: 'Оберіть спосіб доставки' }]}>
      <Radio.Group className="flex flex-col gap-2">
        <Radio value="np-branch">Доставка Новою поштою</Radio>
        <Radio value="np-courier">Доставка Укрпоштою</Radio>
        <Radio value="self-pickup">Самовивіз</Radio>
      </Radio.Group>
    </Form.Item>
  </div>

 
  <div className="grid grid-cols-2 gap-4">
    <Form.Item
      name="city"
      rules={[{ required: true, message: 'Вкажіть місто' }]}
    >
      <Input placeholder="Місто *" />
    </Form.Item>
    <Form.Item
      name="address"
      rules={[{ required: true, message: 'Вкажіть адресу або № відділення' }]}
    >
      <Input placeholder="Адреса / № відділення *" />
    </Form.Item>
  </div>


  <div>
    <Typography.Title level={4}>Спосіб оплати</Typography.Title>
    <Form.Item name="payment" rules={[{ required: true, message: 'Оберіть спосіб оплати' }]}>
      <Radio.Group className="flex flex-col gap-2">
        <Radio value="cash">Оплата при отриманні</Radio>
        <Radio value="card">Банківський переказ</Radio>
      </Radio.Group>
    </Form.Item>
  </div>

 
  <Form.Item
    name="agree"
    valuePropName="checked"
    rules={[{
      validator: (_, value) =>
        value ? Promise.resolve() : Promise.reject(new Error('Потрібно погодитися з умовами')),
    }]}
  >
    <Checkbox>
      Я погоджуюсь з умовами: <a href="/policy" className="font-semibold">Політика конфіденційності</a>
    </Checkbox>
  </Form.Item>


  <Form.Item>
 <Button type="primary" htmlType="submit" size="large" className="w-fit px-10">
          Оформити замовлення
        </Button>
        </Form.Item>
</Form>
  );
};

*/
import { Button, Checkbox, Form, Input, Radio, Typography } from 'antd';
import { useAppSelector } from '../../../app/store/hooks';
import type { OrderPayload } from '@shared/types/order';

interface Props {
  onSubmit: (order: OrderPayload) => void;
}

export const CheckoutForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();
  const items = useAppSelector(state => state.cart.items);
  // Предполагается, что авторизация уже есть и user лежит в localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

const handleFinish = (values: any) => {
  const payload: OrderPayload = {
    user_id: user.id,
    items: items.map(item => ({
      product_id: item.product?.id, 
      quantity: Number(item.quantity)
    })),
    delivery_address: `${values.city}, ${values.address}`,
    // promo_code: values.promo_code || undefined,
  };
  onSubmit(payload);
};


  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <div>
        <Typography.Title level={4}>Спосіб доставки</Typography.Title>
        <Form.Item name="delivery" rules={[{ required: true, message: 'Оберіть спосіб доставки' }]}>
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="np-branch">Доставка Новою поштою</Radio>
            <Radio value="np-courier">Доставка Укрпоштою</Radio>
            <Radio value="self-pickup">Самовивіз</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="city" rules={[{ required: true, message: 'Вкажіть місто' }]}>
          <Input placeholder="Місто *" />
        </Form.Item>
        <Form.Item name="address" rules={[{ required: true, message: 'Вкажіть адресу або № відділення' }]}>
          <Input placeholder="Адреса / № відділення *" />
        </Form.Item>
      </div>
      <div>
        <Typography.Title level={4}>Спосіб оплати</Typography.Title>
        <Form.Item name="payment" rules={[{ required: true, message: 'Оберіть спосіб оплати' }]}>
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="cash">Оплата при отриманні</Radio>
            <Radio value="card">Банківський переказ</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <Form.Item
        name="agree"
        valuePropName="checked"
        rules={[{
          validator: (_, value) =>
            value ? Promise.resolve() : Promise.reject(new Error('Потрібно погодитися з умовами')),
        }]}
      >
        <Checkbox>
          Я погоджуюсь з умовами: <a href="/policy" className="font-semibold">Політика конфіденційності</a>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" className="w-fit px-10">
          Оформити замовлення
        </Button>
      </Form.Item>
    </Form>
  );
};
