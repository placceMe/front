
import { Button, Checkbox, Form, Input, Radio, Typography } from 'antd';
import { useAppSelector } from '../../../app/store/hooks';
import type { OrderPayload } from '@shared/types/order';

interface Props {
  onSubmit: (order: OrderPayload) => void;
}

export const CheckoutForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();
  const items = useAppSelector(state => state.cart.items);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleFinish = (values: any) => {
  const payload: OrderPayload = {
  UserId: user.id,
  Notes: values.notes,
  DeliveryAddress: `${values.city}, ${values.address}`,
  Items: items.map((item: any) => ({
    ProductId: item.product.id,
    Quantity: item.quantity,
  })),
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
        <Form.Item name="promoCode">
          <Input placeholder="Промокод" />
        </Form.Item>
        <Form.Item name="notes">
          <Input.TextArea placeholder="Коментар до замовлення" />
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
