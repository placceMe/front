// src/pages/EditProductPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useRequest } from "@shared/request/useRequest";

type UUID = string;

type ProductEditDTO = {
  title: string;
  description?: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  categoryId: UUID;
  quantity?: number;
};

type Category = { id: UUID; name: string };

const WRAP_STYLE: React.CSSProperties = {
  background: "#EDEEDF", // ніжно-оливковий фон секції
  border: "1px solid #C9CFB8",
  borderRadius: 10,
};

const FIELD_BG = "#F4F5EA";
const FIELD_BORDER = "#8D8C5F";

const labelReq = (label: string) => (
  <span className="font-semibold text-[#2b3924]">
    {label} <span className="text-red-500">*</span>
  </span>
);

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`; // якщо в тебе так прийнято


const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { request } = useRequest();
  const [form] = Form.useForm<ProductEditDTO>();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  console.log(loading)
  // завантажити категорії
useEffect(() => {
    request<Category[]>("/api/categories")
      .then((res) => setCategories(res ?? []))
      .catch(() => setCategories([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    request<any>(`/api/products/${productId}`)
      .then((p) => {
        if (!p) return;
        const dto: ProductEditDTO = {
          title: p.title ?? "",
          description: p.description ?? "",
          price: p.price ?? 0,
          color: p.color ?? "",
          weight: p.weight ?? undefined,
          mainImageUrl: p.mainImageUrl ?? "",
          categoryId: p.categoryId,
          quantity: p.quantity ?? 0,
        };
        form.setFieldsValue(dto);

        if (dto.mainImageUrl) {
          setFileList([{
            uid: "-1",
            name: dto.mainImageUrl,
            status: "done",
            url: `${FILES_BASE_URL}${dto.mainImageUrl}`,
          } as UploadFile]);
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
    const { file } = info;
    if (file.status === "uploading") return;
    if (file.status === "done") {
      const resp = (file.response || {}) as { fileName?: string; url?: string };
      const nameFromServer =
        resp.fileName ||
        (Array.isArray(resp) && (resp[0]?.fileName as string)) ||
        file.name;
      form.setFieldsValue({ mainImageUrl: nameFromServer });
      message.success("Головне фото завантажено");
    } else if (file.status === "error") {
      message.error("Помилка завантаження фото");
    }
  };

  const onFinish = async (values: ProductEditDTO) => {
    if (!productId) return;
    setSaving(true);
    try {
      await request(`/api/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      message.success("Товар оновлено");
      navigate(-1);
    } catch {
      message.error("Не вдалося оновити товар");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="mb-4 flex items-center gap-2">
        <Button onClick={() => navigate(-1)}>&larr; Назад</Button>
        <h2 className="m-0 text-2xl font-bold text-[#2b3924]">Редагувати товар</h2>
      </div>

      <div className="p-5" style={WRAP_STYLE}>
        {/* ✅ ОДНА форма на всю страницу */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ price: 0, quantity: 1 }}
        >
          <Row gutter={[24, 24]}>
            {/* Левый столбец */}
            <Col xs={24} md={14} className="space-y-4">
              <Form.Item
                label={labelReq("Назва товару")}
                name="title"
                rules={[{ required: true, message: "Введіть назву" }]}
              >
                <Input
                  size="large"
                  placeholder="Назва товару"
                  style={{ background: FIELD_BG, borderColor: FIELD_BORDER, height: 48, borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item label={<span className="font-semibold text-[#2b3924]">Опис</span>} name="description">
                <Input.TextArea
                  rows={5}
                  placeholder="Опис товару"
                  style={{ background: FIELD_BG, borderColor: FIELD_BORDER, borderRadius: 8 }}
                />
              </Form.Item>

              <div className="mb-2 font-semibold text-[#2b3924]">
                <span className="text-red-500 mr-1">*</span>Головне фото
              </div>
              <Upload.Dragger
                name="file"
                multiple={false}
                action={`${__BASE_URL__}/api/files/upload`}
                headers={{} as Record<string,string>}
                accept="image/*"
                onChange={handleUploadChange}
                fileList={fileList}
                maxCount={1}
                listType="picture"
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Завантажити головне зображення</p>
              </Upload.Dragger>

              {/* скрытое поле для mainImageUrl */}
              <Form.Item name="mainImageUrl" hidden>
                <Input />
              </Form.Item>
            </Col>

            {/* Правый столбец */}
            <Col xs={24} md={10}>
              <Form.Item
                label={labelReq("Категорія")}
                name="categoryId"
                rules={[{ required: true, message: "Оберіть категорію" }]}
              >
                <Select
                  size="large"
                  placeholder="Оберіть категорію"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  style={{ background: FIELD_BG, borderColor: FIELD_BORDER }}
                />
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label={<span className="font-semibold text-[#2б3924]">Колір</span>} name="color">
                    <Input
                      placeholder="Напр., Оливковий"
                      style={{ background: FIELD_BG, borderColor: FIELD_BORDER, borderRadius: 8, height: 40 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span className="font-semibold text-[#2b3924]">Вага</span>} name="weight">
                    <InputNumber placeholder="кг" min={0} style={{ width: "100%" }} addonAfter="кг" controls={false} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label={labelReq("Ціна")}
                    name="price"
                    rules={[{ required: true, message: "Вкажіть ціну" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} addonAfter="грн" controls={false} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={labelReq("Кількість")}
                    name="quantity"
                    rules={[{ required: true, message: "Вкажіть кількість" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} controls={false} />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex gap-10 items-center mt-2">
                <Button size="large" type="primary" htmlType="submit" loading={saving}
                        className="!bg-[#2b3924] hover:!bg-[#22301c] !border-[#2b3924] rounded-[10px] px-8">
                  Зберегти
                </Button>
                <Button size="large" onClick={() => navigate(-1)}>Скасувати</Button>
              </div>

              <div className="hidden md:block mt-8">
                <img src="/assets/illustrations/edit-product.png" alt="edit-illustration" className="w-full rounded-lg shadow-sm" />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default EditProductPage;