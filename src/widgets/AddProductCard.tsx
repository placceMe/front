import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload, Row, Col, Select, message } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import type { Category } from "@shared/types/api";
 import { useRequest } from '@shared/request/useRequest';
 import type { UploadFile } from 'antd/es/upload/interface';




// Стили блюра
const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

type AddProductCardProps = { sellerId: string; };

export const AddProductCard = ({ sellerId }: AddProductCardProps) => {
  const [mainImage, setMainImage] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form] = Form.useForm();
const { request } = useRequest();
const handleMainImageChange = (info: any) => {
  const file = info.fileList[0]?.originFileObj;
  setMainImage(file || null);
};



useEffect(() => {
  request<Category[]>('/api/category')
    .then((data) => {
      if (data) {
        setCategories(data.filter(cat => cat.status === "Active"));
      }
    });
}, []);


const handleGalleryChange = (info: any) => {
  const files = info.fileList
    .map((file: any) => file.originFileObj)
    .filter(Boolean); // Убираем undefined
  setGallery(files);
};


const onFinish = async (values: any) => {
  setLoading(true);
  try {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      formData.append(k, String(v ?? ""));
    });
    formData.append("SellerId", sellerId);
    if (mainImage) formData.append("MainImage", mainImage);
    gallery.forEach((file) => formData.append("Gallery", file));

    const response = await request("/api/products/with-files", {
      method: "POST",
      body: formData,
    });

    if (response) {
      message.success("Товар успішно додано");
      form.resetFields();
      setMainImage(null);
      setGallery([]);
    } else {
      message.error("Помилка при додаванні товару");
    }
  } catch {
    message.error("Помилка при додаванні товару");
  }
  setLoading(false);
};

  return (
    <div
      className="p-8 rounded-xl shadow-xl max-w-[1000px] mx-auto mt-8 my-10"
      style={BLUR_STYLE}
    >
      <h2 className="text-2xl font-bold mb-6">Додати новий товар</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ Quantity: 1 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Назва"
              name="Title"
              rules={[{ required: true, message: "Введіть назву товару" }]}
            >
              <Input style={BLUR_STYLE} className="rounded-xl font-semibold h-10" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Категорія"
              name="CategoryId"
              rules={[{ required: true, message: "Оберіть категорію" }]}
            >
              <Select
                style={{
                  ...BLUR_STYLE,
                  //background: 'transparent',
                  // border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                className="rounded-xl font-semibold h-10"
                placeholder="Оберіть категорію"
                options={categories.map((cat: any) => ({ value: cat.id, label: cat.name }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Ціна" name="Price" rules={[{ required: true, message: "Вкажіть ціну" }]}>
              <InputNumber
                min={0}
                style={{ ...BLUR_STYLE, width: "100%", }}
                className="rounded-xl font-semibold h-10"
                addonAfter="₴"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Кількість" name="Quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ ...BLUR_STYLE, width: "100%" }} className="rounded-xl font-semibold h-10" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Колір" name="Color">
              <Input style={BLUR_STYLE} className="rounded-xl font-semibold h-10" placeholder="Оливковий" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Вага" name="Weight">
              <Input style={BLUR_STYLE} className="rounded-xl font-semibold h-10" placeholder="0.5 кг" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Опис" name="Description">
              <Input.TextArea
                rows={3}
                style={BLUR_STYLE}
                className="rounded-xl font-semibold"
                placeholder="Опис товару"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Головне зображення"
              name="MainImage"
              valuePropName="file"
              rules={[{ required: true, message: "Завантажте основне зображення" }]}
            >
           <Upload.Dragger
  name="main"
  accept="image/*"
  beforeUpload={() => false}
  onChange={handleMainImageChange}
  showUploadList={true}
  maxCount={1}
  fileList={
    mainImage
      ? [{ uid: '-1', name: mainImage.name, status: 'done' } as UploadFile]
      : []
  }
  style={BLUR_STYLE}
>
  <p className="ant-upload-drag-icon">🖼️</p>
  <p className="ant-upload-text">Завантажити головне зображення</p>
</Upload.Dragger>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Галерея (додаткові фото)">
              <Upload.Dragger
  name="gallery"
  accept="image/*"
  multiple
  beforeUpload={() => false}
  onChange={handleGalleryChange}
  showUploadList={true}
  fileList={gallery.map((file, index) => ({
    uid: String(index),
    name: file.name,
    status: 'done',
  })) as UploadFile[]}
  style={BLUR_STYLE}
>
  <p className="ant-upload-drag-icon">📸</p>
  <p className="ant-upload-text">Завантажити галерею зображень</p>
</Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-green-700 hover:bg-green-800 rounded-xl px-8"
            loading={loading}
          >
            Додати товар
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductCard;
