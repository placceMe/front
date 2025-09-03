/*import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload, Row, Col, Select, message } from "antd";
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
*/



/////////////////////////////////////////////////////////
/*

import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload, Row, Col, Select, message } from "antd";
import type { UploadFile } from 'antd/es/upload/interface';
import { useRequest } from '@shared/request/useRequest';
import type { Category, CharacteristicDict } from "@shared/types/api";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

type AddProductCardProps = {
  sellerId: string;
};

export const AddProductCard = ({ sellerId }: AddProductCardProps) => {
  const [mainImage, setMainImage] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [characteristics, setCharacteristics] = useState<CharacteristicDict[]>([]);
  const [form] = Form.useForm();
  const { request } = useRequest();

  useEffect(() => {
    request<Category[]>('/api/category')
      .then(data => {
        if (data) setCategories(data.filter(cat => cat.status === "Active"));
      });
  }, []);

  useEffect(() => {
    const categoryId = form.getFieldValue("CategoryId");
    if (!categoryId) return;

    request<CharacteristicDict[]>(`/api/characteristicdict/category/${categoryId}`)
      .then((data) => {
        if (data) {
          setCharacteristics(data);
          const charValues = data.map(c => ({
            characteristicId: c.id,
            value: ""
          }));
          form.setFieldsValue({ Characteristics: charValues });

        } else {
          setCharacteristics([]);
          form.setFieldValue("Characteristics", []);
        }
      });
  }, [form.getFieldValue("CategoryId")]);

  const handleMainImageChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    setMainImage(file || null);
  };

  const handleGalleryChange = (info: any) => {
    const files = info.fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);
    setGallery(files);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === "Characteristics") {
          formData.append("Characteristics", JSON.stringify(v));
        } else {
          formData.append(k, String(v ?? ""));
        }
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
        setCharacteristics([]);
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
                style={BLUR_STYLE}
                className="rounded-xl font-semibold h-10"
                placeholder="Оберіть категорію"
                options={categories.map((cat: any) => ({ value: cat.id, label: cat.name }))}
           onChange={(value) => {
  request<CharacteristicDict[]>(`/api/characteristicdict/category/${value}`)
    .then((data) => {
      if (data) {
        setCharacteristics(data);
        const charValues = data.map(c => ({
          characteristicId: c.id,
          value: ""
        }));
        form.setFieldsValue({ Characteristics: charValues });
      }
                      });
                  
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {characteristics.length > 0 && (
          <>
            <h3 className="text-xl font-bold mt-6 mb-2">Характеристики</h3>
            <Form.List name="Characteristics">
              {(fields) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={field.key} gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label={characteristics[index]?.name}
                          name={[index, "value"]}
                          rules={[{ required: true, message: "Заповніть значення" }]}
                        >
                          <Input
                            style={BLUR_STYLE}
                            className="rounded-xl font-semibold h-10"
                            placeholder={characteristics[index]?.name}
                          />
                        </Form.Item>
                      </Col>
                     <Form.Item name={[field.name, "characteristicId"]} noStyle>
  <Input type="hidden" />
</Form.Item>

                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </>
        )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Ціна" name="Price" rules={[{ required: true, message: "Вкажіть ціну" }]}>
              <InputNumber
                min={0}
                style={{ ...BLUR_STYLE, width: "100%" }}
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
              rules={[{ required: true, message: "Завантажте зображення" }]}
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
*/

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Row,
  Col,
  Select,
  message,
  Space,
  Switch,
} from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useRequest } from "@shared/request/useRequest";
import type { Category, CharacteristicDict } from "@shared/types/api";
import addProductImg from "../assets/pages/add_product.png";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

type AddProductCardProps = {
  sellerId: string;
};

type CharacteristicValue = {
  characteristicDictId: string;
  value: string;
};

type FormValues = {
  Title: string;
  Description?: string;
  CategoryId: string;
  Color?: string;
  Weight?: number;
  Price: number;
  Quantity?: number;
  Characteristics?: CharacteristicValue[];
  AdditionalImages?: File[];
  Producer?: string;
  IsNew?: boolean;
};

export const AddProductCard = ({ sellerId }: AddProductCardProps) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [characteristics, setCharacteristics] = useState<CharacteristicDict[]>([]);
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [categorySelected, setCategorySelected] = useState(false);

  useEffect(() => {
    request<Category[]>("/api/category").then((data) => {
      if (data) setCategories(data.filter((cat) => cat.status === "Active"));
    });
  }, []);

  const onCategoryChange = async (categoryId: string) => {
    setCategorySelected(true);
    const data = await request<CharacteristicDict[]>(`/api/characteristicdict/category/${categoryId}`);
    if (data) {
      setCharacteristics(data);
      const charValues = data.map((c) => ({ characteristicDictId: c.id, value: "" }));
      form.setFieldsValue({
        ...form.getFieldsValue(),     // 👈 безопасный мердж
        Characteristics: charValues,
      });
    } else {
      setCharacteristics([]);
    }
  };


  const handleMainImageChange = (info: UploadChangeParam<UploadFile>) => {
    const file = info.fileList[0]?.originFileObj;
    setMainImage(file || null);
  };

  const onFinish = async (values: FormValues) => {
    const formData = new FormData();

    // Характеристики
    if (values.Characteristics?.length) {
      values.Characteristics.forEach((item, index) => {
        formData.append(`Characteristics[${index}].CharacteristicDictId`, item.characteristicDictId);
        formData.append(`Characteristics[${index}].Value`, item.value);
      });
    }

    formData.append("Title", values.Title);
    formData.append("CategoryId", values.CategoryId);
    formData.append("Price", String(values.Price));
    formData.append("SellerId", sellerId);
    formData.append("Quantity", String(values.Quantity));


    if (values.Color) formData.append("Color", values.Color);
    if (values.Weight !== undefined) formData.append("Weight", String(values.Weight));
    if (values.Description) formData.append("Description", values.Description);
    if (values.Producer && values.Producer.trim()) {
      formData.append("Producer", values.Producer.trim());
    }
    formData.append("IsNew", String(values.IsNew ?? false));
    if (mainImage) formData.append("MainImage", mainImage);
    if (values.AdditionalImages?.length) {
      values.AdditionalImages.forEach((file) => formData.append("AdditionalImages", file));
    }
    console.log("Producer value from form:", values.Producer);
    console.log("Producer type:", typeof values.Producer);
    console.log("All form values:", values);
    console.log("Final characteristics sent:", values.Characteristics);

    const response = await request("/api/products/with-files", {
      method: "POST",
      body: formData,
    });

    if (response) {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      message.success("Товар успішно додано");
      form.resetFields();
      setMainImage(null);
      setCharacteristics([]);
      setCategorySelected(false);
    } else {
      message.error("Помилка при додаванні товару");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ Quantity: 1, IsNew: true, Producer: "" }}
      onValuesChange={(changed) => {
        if ("Producer" in changed) {
          console.log("Producer changed →", changed.Producer);
        }
      }}
      className="max-w-[1280px] mx-auto mt-10"
    >
      <Row gutter={32}>
        <Col span={8}>
          <Form.Item
            label="Назва товару"
            name="Title"
            rules={[{ required: true, message: "Введіть назву товару" }]}
          >
            <Input style={BLUR_STYLE} className="rounded-xl font-semibold h-10" />
          </Form.Item>

          {categorySelected && (
            <> <Form.Item label="Опис" name="Description">
              <Input.TextArea
                rows={3}
                style={BLUR_STYLE}
                className="rounded-xl font-semibold"
                placeholder="Опис товару"
              />
            </Form.Item>
              <Form.Item
                label="Головне фото"
                name="MainImage"
                rules={[{ required: true, message: "Завантажте головне фото" }]}
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
                      ? [{ uid: "-1", name: mainImage.name, status: "done" } as UploadFile]
                      : []
                  }
                  style={BLUR_STYLE}
                >
                  <p className="ant-upload-drag-icon">🖼️</p>
                  <p className="ant-upload-text">Завантажити головне зображення</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.List name="AdditionalImages">
                {(fields, { add, remove }) => (
                  <>
                    <Button type="dashed" onClick={() => add()} block>
                      Додати ще фото
                    </Button>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {fields.map((field) => (
                        <Form.Item
                          key={field.key}
                          name={field.name}
                          valuePropName="file"
                          getValueFromEvent={(e: UploadChangeParam<UploadFile>) =>
                            e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj
                          }
                        >
                          <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            maxCount={1}
                            onRemove={() => remove(field.name)}
                            showUploadList={{ showPreviewIcon: false }}
                          >
                            <div>+</div>
                          </Upload>
                        </Form.Item>
                      ))}
                    </div>
                  </>
                )}
              </Form.List>
            </>
          )}
        </Col>

        <Col span={8}>
          <Form.List name="Characteristics">
            {(fields) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline">
                    <Form.Item
                      name={[name, "characteristicDictId"]}
                      initialValue={characteristics[name]?.id}
                      hidden
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={characteristics[name]?.name || "Характеристика"}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Заповніть значення" }]}
                    >
                      <Input placeholder="Введіть значення" />
                    </Form.Item>
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          {categorySelected && (
            <>
              <Form.Item
                label="Виробник"
                name="Producer"
                normalize={(v) => (typeof v === "string" ? v.trim() : v)}
              >
                <Input placeholder="Напр., Salomon" style={BLUR_STYLE} />
              </Form.Item>


              <Form.Item label="Новий товар" name="IsNew" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="Колір" name="Color">
                <Input placeholder="Оливковий" style={BLUR_STYLE} />
              </Form.Item>

              <Form.Item label="Вага" name="Weight">
                <Input placeholder="0.5 кг" style={BLUR_STYLE} />
              </Form.Item>

              <Form.Item label="Ціна" name="Price">
                <InputNumber
                  min={0}
                  style={{ ...BLUR_STYLE, width: "100%" }}
                  addonAfter="грн"
                  className="rounded-xl font-semibold h-10"
                />
              </Form.Item>
              <Form.Item
                label="Кількість"
                name="Quantity"
                rules={[{ required: true, message: "Вкажіть кількість" }]}
              >
                <InputNumber
                  min={0}
                  step={1}
                  style={{ ...BLUR_STYLE, width: "100%" }}
                  className="rounded-xl font-semibold h-10"
                />
              </Form.Item>


            </>
          )}
        </Col>

        <Col span={8}>
          <Form.Item
            label="Категорія"
            name="CategoryId"
            rules={[{ required: true, message: "Оберіть категорію" }]}
          >
            <Select
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Оберіть категорію"
              className="rounded-xl font-semibold h-10"
              style={BLUR_STYLE}
              onChange={onCategoryChange}
            />
          </Form.Item>

          <div className="mt-auto pt-8">
            <img src={addProductImg} alt="preview" className="w-full object-contain" />
          </div>
        </Col>
      </Row>

      {categorySelected && (
        <Form.Item className="text-center mt-8">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-green-700 hover:bg-green-800 rounded-xl px-8"
          >
            Зберегти
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};
