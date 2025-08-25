import  { useEffect, useState } from 'react';

import { Form, Button, Typography, Radio, Select, Input, Checkbox, Modal } from 'antd';
import type { OrderPayload } from '@shared/types/order';
import { useAppSelector } from '@store/hooks';
import { useNavigate } from 'react-router-dom';
import { AuthTabs } from '../../../widgets/AuthTabs';

const API_KEY: string = __NP_API_KEY__;


interface CheckoutFormValues {
  notes?: string;
  cityName: string;
  warehouseName: string;
  cityRef: string;
  warehouseRef: string;
  promoCode?: string;
  delivery: string;
  payment: string;
  agree: boolean;
}



interface Props {
  onSubmit: (order: OrderPayload) => void;
}
export const CheckoutForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user.user);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const [areas, setAreas] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [warehouses, setWarehouses] = useState<{ label: string; value: string }[]>([]);

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  useEffect(() => {
    const fetchAreas = async () => {
      const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod: 'getAreas',
          methodProperties: {},
        }),
      });
      const json = await res.json();
      const data = json.data.map((area: { Description: string; Ref: string }) => ({
        label: area.Description,
        value: area.Ref,
      }));
      setAreas(data);
    };

    fetchAreas();
  }, []);

  const fetchCities = async (areaRef: string) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {},
      }),
    });

    const json = await res.json();
    
    // Проверяем успешность запроса
    if (!json.success) {
      console.error('Nova Post API error:', json.errors);
      return;
    }

    // Фильтруем города по выбранной области на клиенте
    const data = json.data
      .filter((city: { Area: string }) => city.Area === areaRef)
      .map((city: { Description: string; Ref: string }) => ({
        label: city.Description,
        value: city.Ref,
      }));

    setCities(data);
  };

  const fetchWarehouses = async (cityRef: string) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
        },
      }),
    });

    const json = await res.json();
    const data = json.data.map((w:{ Number: string; ShortAddress?: string; Description: string; Ref: string }) => ({
      label: `№${w.Number}: ${w.ShortAddress || w.Description}`,
      value: w.Ref,
    }));
    setWarehouses(data);
  };

  const handleAreaChange = (areaRef: string) => {
    form.setFieldsValue({
      cityRef: null,
      warehouseRef: null,
      cityName: '',
      warehouseName: '',
    });
    setSelectedArea(areaRef);
    setSelectedCity(null);
    setCities([]);
    setWarehouses([]);
    fetchCities(areaRef);
  };

 const handleCityChange = (cityRef: string, option?: { label: string; value: string } | { label: string; value: string }[]) => {
  const selectedOption = Array.isArray(option) ? option[0] : option;
  if (!selectedOption) return;

   form.setFieldsValue({
    cityName: selectedOption.label,
    warehouseRef: null,
    warehouseName: '',
  });
     setSelectedCity(cityRef);
  setWarehouses([]);
  fetchWarehouses(cityRef);
  };

const handleWarehouseChange = (_: string, option?: { label: string; value: string } | { label: string; value: string }[]) => {
  const selectedOption = Array.isArray(option) ? option[0] : option;
  if (!selectedOption) return;

  form.setFieldsValue({ warehouseName: selectedOption.label });
};
  const handleFinish = (values: CheckoutFormValues)  => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

   
  const payload: OrderPayload = {
    UserId: user.id,
    Notes: values.notes,
    DeliveryAddress: `${values.cityName}, ${values.warehouseName}`,
    Items: items.map((item) => ({
      ProductId: item.product.id,
      Quantity: item.quantity,
    })),
    CityRef: values.cityRef,
    WarehouseRef: values.warehouseRef,
  };

  onSubmit(payload);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Typography.Title level={4}>Спосіб доставки</Typography.Title>
        <Form.Item
          name="delivery"
          rules={[{ required: true, message: 'Оберіть спосіб доставки' }]}
        >
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="np-branch">Доставка Новою Поштою</Radio>
            <Radio value="np-courier">Кур'єр Нової Пошти</Radio>
            <Radio value="self-pickup">Самовивіз</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="areaRef"
            rules={[{ required: true, message: 'Оберіть область' }]}
          >
            <Select
              options={areas}
              onChange={handleAreaChange}
              placeholder="Оберіть область *"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            name="cityRef"
            rules={[{ required: true, message: 'Оберіть місто' }]}
          >
            <Select
              options={cities}
              onChange={handleCityChange}
              placeholder="Оберіть місто *"
              showSearch
              optionFilterProp="label"
              disabled={!selectedArea}
            />
          </Form.Item>

          <Form.Item
            name="warehouseRef"
            rules={[{ required: true, message: 'Оберіть відділення' }]}
          >
            <Select
              options={warehouses}
              onChange={handleWarehouseChange}
              placeholder="Оберіть відділення *"
              showSearch
              optionFilterProp="label"
              disabled={!selectedCity}
            />
          </Form.Item>

          <Form.Item name="promoCode">
            <Input placeholder="Промокод" />
          </Form.Item>

          <Form.Item name="notes">
            <Input.TextArea placeholder="Коментар до замовлення" />
          </Form.Item>
        </div>

        <Form.Item name="cityName" hidden><input /></Form.Item>
        <Form.Item name="warehouseName" hidden><input /></Form.Item>

        <Typography.Title level={4}>Спосіб оплати</Typography.Title>
        <Form.Item
          name="payment"
          rules={[{ required: true, message: 'Оберіть спосіб оплати' }]}
        >
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="cash">Оплата при отриманні</Radio>
            <Radio value="card">Банківський переказ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Потрібно погодитися з умовами')),
            },
          ]}
        >
          <Checkbox>
            Я погоджуюсь з умовами:{' '}
            <a href="/policy" className="font-semibold">Політика конфіденційності</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="w-fit px-10">
            Оформити замовлення
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={showAuthModal}
        onCancel={() => setShowAuthModal(false)}
        footer={null}
        centered
        width={450}
        destroyOnHidden
      >
        <h3>Ви не авторизовані! Будь ласка, авторизуйтесь</h3>
        <AuthTabs onSuccess={() => setShowAuthModal(false)} />
      </Modal>
    </>
  );
};



/*

interface Props {
  onSubmit: (order: OrderPayload) => void;
}

interface Area {
  Description: string;
  Ref: string;
}

interface City {
  Description: string;
  Ref: string;
  Area: string;
}

interface Warehouse {
  Number: string;
  ShortAddress?: string;
  Description: string;
  Ref: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface CityOption extends SelectOption {}
interface WarehouseOption extends SelectOption {}

export const CheckoutForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user.user);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  useEffect(() => {
    const fetchAreas = async () => {
      const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod: 'getAreas',
          methodProperties: {},
        }),
      });
      const json = await res.json();
      const data = json.data.map((area: Area) => ({
        label: area.Description,
        value: area.Ref,
      }));
      setAreas(data);
    };

    fetchAreas();
  }, []);

  const fetchCities = async (areaRef: string) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {},
      }),
    });

    const json = await res.json();
    if (!json.success) {
      console.error('Nova Post API error:', json.errors);
      return;
    }

    const data = json.data
      .filter((city: City) => city.Area === areaRef)
      .map((city: City) => ({
        label: city.Description,
        value: city.Ref,
      }));

    setCities(data);
  };

  const fetchWarehouses = async (cityRef: string) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
        },
      }),
    });

    const json = await res.json();
    const data = json.data.map((w: Warehouse) => ({
      label: `№${w.Number}: ${w.ShortAddress || w.Description}`,
      value: w.Ref,
    }));
    setWarehouses(data);
  };

  const handleAreaChange = (areaRef: string) => {
    form.setFieldsValue({
      cityRef: null,
      warehouseRef: null,
      cityName: '',
      warehouseName: '',
    });
    setSelectedArea(areaRef);
    setSelectedCity(null);
    setCities([]);
    setWarehouses([]);
    fetchCities(areaRef);
  };

  const handleCityChange = (cityRef: string, option: CityOption) => {
    form.setFieldsValue({
      cityName: option.label,
      warehouseRef: null,
      warehouseName: '',
    });
    setSelectedCity(cityRef);
    setWarehouses([]);
    fetchWarehouses(cityRef);
  };

  const handleWarehouseChange = (_: string, option: WarehouseOption) => {
    form.setFieldsValue({ warehouseName: option.label });
  };

  const handleFinish = (values: {
    notes?: string;
    cityName: string;
    warehouseName: string;
    cityRef: string;
    warehouseRef: string;
  }) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const payload: OrderPayload = {
      UserId: user.id,
      Notes: values.notes,
      DeliveryAddress: `${values.cityName}, ${values.warehouseName}`,
      Items: items.map((item): OrderItemPayload => ({
        ProductId: item.product.id,
        Quantity: item.quantity,
      })),
      CityRef: values.cityRef,
      WarehouseRef: values.warehouseRef,
    };

    onSubmit(payload);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Typography.Title level={4}>Спосіб доставки</Typography.Title>
        <Form.Item name="delivery" rules={[{ required: true, message: 'Оберіть спосіб доставки' }]}>
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="np-branch">Доставка Новою Поштою</Radio>
            <Radio value="np-courier">Кур'єр Нової Пошти</Radio>
            <Radio value="self-pickup">Самовивіз</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="areaRef" rules={[{ required: true, message: 'Оберіть область' }]}>
            <Select
              options={areas}
              onChange={handleAreaChange}
              placeholder="Оберіть область *"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item name="cityRef" rules={[{ required: true, message: 'Оберіть місто' }]}>
            <Select
              options={cities}
              onChange={handleCityChange}
              placeholder="Оберіть місто *"
              showSearch
              optionFilterProp="label"
              disabled={!selectedArea}
            />
          </Form.Item>

          <Form.Item name="warehouseRef" rules={[{ required: true, message: 'Оберіть відділення' }]}>
            <Select
              options={warehouses}
              onChange={handleWarehouseChange}
              placeholder="Оберіть відділення *"
              showSearch
              optionFilterProp="label"
              disabled={!selectedCity}
            />
          </Form.Item>

          <Form.Item name="promoCode">
            <Input placeholder="Промокод" />
          </Form.Item>

          <Form.Item name="notes">
            <Input.TextArea placeholder="Коментар до замовлення" />
          </Form.Item>
        </div>

        <Form.Item name="cityName" hidden><input /></Form.Item>
        <Form.Item name="warehouseName" hidden><input /></Form.Item>

        <Typography.Title level={4}>Спосіб оплати</Typography.Title>
        <Form.Item name="payment" rules={[{ required: true, message: 'Оберіть спосіб оплати' }]}>
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="cash">Оплата при отриманні</Radio>
            <Radio value="card">Банківський переказ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Потрібно погодитися з умовами')),
            },
          ]}
        >
          <Checkbox>
            Я погоджуюсь з умовами:{' '}
            <a href="/policy" className="font-semibold">Політика конфіденційності</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="w-fit px-10">
            Оформити замовлення
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={showAuthModal}
        onCancel={() => setShowAuthModal(false)}
        footer={null}
        centered
        width={450}
        destroyOnClose
      >
        <h3>Ви не авторизовані! Будь ласка, авторизуйтесь</h3>
        <AuthTabs onSuccess={() => setShowAuthModal(false)} />
      </Modal>
    </>
  );
};
*/