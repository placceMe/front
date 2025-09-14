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
  Switch,
  Space,
} from "antd";
import { InboxOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useRequest } from "@shared/request/useRequest";

type UUID = string;

type ProductEditForm = {
  Title: string;
  Description?: string;
  Price: number;
  Color?: string;
  Weight?: number;
  CategoryId: UUID;
  Quantity?: number;
  Producer?: string;
  IsNew?: boolean;
  Characteristics?: Array<{
    id: string;
    value: string;
  }>;
};

type Category = { id: UUID; name: string };

type CharacteristicDict = {
  id: string;
  name: string;
  description?: string;
};

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

// Оливковые стили для адаптивности
const EDIT_STYLES = `
.edit-product-form {
  background: #F4F5EA;
  min-height: 100vh;
}

.edit-product-form .form-card {
  background: #EDEEDF;
  border: 1px solid #C9CFB8;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 16px;
}

.edit-product-form .form-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2b3924;
  border-bottom: 2px solid #C9CFB8;
  padding-bottom: 8px;
}

.edit-product-form .compact-upload .ant-upload-drag {
  padding: 24px 16px !important;
  border: 2px dashed #8D8C5F !important;
  border-radius: 10px !important;
  background: #F4F5EA !important;
  min-height: 120px !important;
  transition: all 0.3s ease !important;
}

.edit-product-form .compact-upload .ant-upload-drag:hover {
  border-color: #6B6A42 !important;
  background: #EDEEDF !important;
}

.edit-product-form .compact-upload .ant-upload-drag-icon {
  margin-bottom: 8px !important;
  font-size: 24px !important;
  color: #8D8C5F;
}

.edit-product-form .compact-upload .ant-upload-text {
  font-size: 14px !important;
  color: #2b3924 !important;
  margin: 0 !important;
}

.edit-product-form .field-input {
  border-radius: 10px !important;
  border: 1px solid #8D8C5F !important;
  background: #F4F5EA !important;
  transition: all 0.3s ease !important;
}

.edit-product-form .field-input:hover {
  border-color: #6B6A42 !important;
  background: #F4F5EA !important;
}

.edit-product-form .field-input:focus,
.edit-product-form .field-input.ant-input-focused {
  border-color: #6B6A42 !important;
  background: #F4F5EA !important;
  box-shadow: 0 0 0 2px rgba(139, 140, 95, 0.2) !important;
}

.edit-product-form .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
  border-color: #6B6A42 !important;
  background: #F4F5EA !important;
}

.edit-product-form .ant-select-focused .ant-select-selector {
  border-color: #6B6A42 !important;
  background: #F4F5EA !important;
  box-shadow: 0 0 0 2px rgba(139, 140, 95, 0.2) !important;
}

.edit-product-form .ant-select-selector {
  background: #F4F5EA !important;
  border: 1px solid #8D8C5F !important;
  border-radius: 10px !important;
}

.edit-product-form .ant-input-number {
  background: #F4F5EA !important;
  border: 1px solid #8D8C5F !important;
  border-radius: 10px !important;
}

.edit-product-form .ant-input-number:hover {
  border-color: #6B6A42 !important;
}

.edit-product-form .ant-input-number-focused {
  border-color: #6B6A42 !important;
  box-shadow: 0 0 0 2px rgba(139, 140, 95, 0.2) !important;
}

.edit-product-form .ant-switch-checked {
  background-color: #8D8C5F !important;
}

.edit-product-form .ant-switch:hover:not(.ant-switch-disabled) {
  background-color: #C9CFB8 !important;
}

.edit-product-form .ant-switch-checked:hover:not(.ant-switch-disabled) {
  background-color: #6B6A42 !important;
}

.edit-product-form .action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #C9CFB8;
}

.edit-product-form .save-button {
  background: #2b3924 !important;
  border-color: #2b3924 !important;
  color: white !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  min-width: 120px;
}

.edit-product-form .save-button:hover {
  background: #22301c !important;
  border-color: #22301c !important;
}

.edit-product-form .cancel-button {
  background: #EDEEDF !important;
  border: 1px solid #8D8C5F !important;
  color: #2b3924 !important;
  border-radius: 10px !important;
  min-width: 100px;
}

.edit-product-form .cancel-button:hover {
  background: #C9CFB8 !important;
  border-color: #6B6A42 !important;
}

.edit-product-form .ant-btn {
  border-radius: 10px !important;
}

.edit-product-form .ant-btn:not(.save-button):not(.cancel-button) {
  background: #EDEEDF !important;
  border-color: #8D8C5F !important;
  color: #2b3924 !important;
}

.edit-product-form .ant-btn:not(.save-button):not(.cancel-button):hover {
  background: #C9CFB8 !important;
  border-color: #6B6A42 !important;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .edit-product-form .form-card {
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .edit-product-form .form-card h3 {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .edit-product-form .compact-upload .ant-upload-drag {
    min-height: 100px !important;
    padding: 16px 12px !important;
  }
  
  .edit-product-form .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .edit-product-form .save-button,
  .edit-product-form .cancel-button {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .edit-product-form .form-card {
    padding: 12px;
    border-radius: 8px;
  }
}
`;

const labelReq = (label: string) => (
  <span className="font-semibold text-[#2b3924]">
    {label} <span className="text-red-500">*</span>
  </span>
);

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { request } = useRequest();
  const [form] = Form.useForm<ProductEditForm>();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [characteristics, setCharacteristics] = useState<CharacteristicDict[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  // Inject CSS
  React.useEffect(() => {
    const styleId = 'edit-product-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(EDIT_STYLES));
    document.head.appendChild(style);
  }, []);

  // Загрузить категории
  useEffect(() => {
    request<Category[]>("/api/category")
      .then((res) => setCategories(res ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Загрузить данные товара
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    request<any>(`/api/products/${productId}`)
      .then((response) => {
        const product = response?.data || response;
        if (!product) return;

        const formData: ProductEditForm = {
          Title: product.title ?? "",
          Description: product.description ?? "",
          Price: product.price ?? 0,
          Color: product.color ?? "",
          Weight: product.weight ?? undefined,
          CategoryId: product.categoryId,
          Quantity: product.quantity ?? 0,
          Producer: product.producer ?? "",
          IsNew: product.isNew ?? false,
          Characteristics: product.characteristics?.map((char: any) => ({
            id: char.id,
            value: char.value,
          })) ?? [],
        };

        form.setFieldsValue(formData);

        // Установить главное изображение
        if (product.mainImageUrl) {
          setFileList([{
            uid: "-1",
            name: product.mainImageUrl,
            status: "done",
            url: `${FILES_BASE_URL}${product.mainImageUrl}`,
          } as UploadFile]);
        }

        // Загрузить характеристики для категории
        if (product.categoryId) {
          loadCharacteristics(product.categoryId);
        }
      })
      .catch(() => {
        message.error("Помилка завантаження товару");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const loadCharacteristics = async (categoryId: string) => {
    try {
      const data = await request<CharacteristicDict[]>(`/api/characteristicdict/category/${categoryId}`);
      if (data) {
        setCharacteristics(data);
        // Обновляем характеристики в форме при смене категории
        const existingChars = form.getFieldValue('Characteristics') || [];
        const newChars = data.map((char, index) => ({
          id: char.id,
          value: existingChars[index]?.value || ''
        }));
        form.setFieldValue('Characteristics', newChars);
      }
    } catch (error) {
      console.error('Error loading characteristics:', error);
    }
  };

  const onCategoryChange = (categoryId: string) => {
    loadCharacteristics(categoryId);
  };

  const handleMainImageChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
    const file = info.fileList[0]?.originFileObj;
    setMainImageFile(file || null);
  };

  const onFinish = async (values: ProductEditForm) => {
    if (!productId) return;
    setSaving(true);

    try {
      const formData = new FormData();
      
      // Основные поля
      formData.append("Title", values.Title);
      formData.append("Price", String(values.Price));
      formData.append("CategoryId", values.CategoryId);
      formData.append("Quantity", String(values.Quantity ?? 0));
      formData.append("IsNew", String(values.IsNew ?? false));

      if (values.Description) formData.append("Description", values.Description);
      if (values.Color) formData.append("Color", values.Color);
      if (values.Weight !== undefined) formData.append("Weight", String(values.Weight));
      if (values.Producer && values.Producer.trim()) {
        formData.append("Producer", values.Producer.trim());
      }

      // Характеристики
      if (values.Characteristics?.length) {
        values.Characteristics.forEach((char, index) => {
          formData.append(`Characteristics[${index}].Id`, char.id);
          formData.append(`Characteristics[${index}].Value`, char.value);
        });
      }

      // Файлы
      if (mainImageFile) {
        formData.append("MainImage", mainImageFile);
      }

      await request(`/api/products/${productId}/web`, {
        method: "PUT",
        body: formData,
      });

      message.success("Товар успішно оновлено");
      navigate(-1);
    } catch (error) {
      console.error('Error updating product:', error);
      message.error("Не вдалося оновити товар");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-form min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-[#2b3924] mb-2">Завантаження...</div>
          <div className="text-sm text-gray-500">Завантажуємо дані товару</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-form py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Хедер */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate(-1)}
            className="mb-4"
            icon={<ArrowLeftOutlined />}
          >
            Назад
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2b3924] m-0">
            Редагувати товар
          </h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ Price: 0, Quantity: 1, IsNew: false }}
        >
          <Row gutter={[16, 0]}>
            {/* Левый столбец - основная информация */}
            <Col xs={24} lg={14}>
              {/* Основная информация */}
              <div className="form-card">
                <h3>Основна інформація</h3>
                
                <Form.Item
                  label={labelReq("Назва товару")}
                  name="Title"
                  rules={[{  message: "Введіть назву товару" }]}
                >
                  <Input
                    size="large"
                    placeholder="Введіть назву товару"
                    className="field-input"
                  />
                </Form.Item>

                <Form.Item 
                  label={<span className="font-semibold text-[#2b3924]">Опис товару</span>} 
                  name="Description"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Детальний опис товару"
                    className="field-input"
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={labelReq("Категорія")}
                      name="CategoryId"
                      rules={[{  message: "Оберіть категорію" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Оберіть категорію"
                        options={categories.map((c) => ({ value: c.id, label: c.name }))}
                        onChange={onCategoryChange}
                        className="field-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<span className="font-semibold text-[#2b3924]">Виробник</span>}
                      name="Producer"
                    >
                      <Input
                        size="large"
                        placeholder="Наприклад: Nike, Adidas"
                        className="field-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Головне фото */}
              <div className="form-card">
                <h3>Головне зображення</h3>
                <div className="compact-upload">
                  <Upload.Dragger
                    name="file"
                    multiple={false}
                    beforeUpload={() => false}
                    accept="image/*"
                    onChange={handleMainImageChange}
                    fileList={fileList}
                    maxCount={1}
                    listType="picture"
                  >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Натисніть або перетягніть зображення</p>
                    <p className="text-xs text-gray-400 mt-1">Підтримуються: JPG, PNG до 5MB</p>
                  </Upload.Dragger>
                </div>
              </div>

              {/* Характеристики */}
              {characteristics.length > 0 && (
                <div className="form-card">
                  <h3>Характеристики товару</h3>
                  <Form.List name="Characteristics">
                    {(fields) => (
                      <Row gutter={[16, 16]}>
                        {characteristics.map((char, index) => (
                          <Col xs={24} sm={12} key={char.id}>
                            <Form.Item
                              label={char.name}
                              name={[index, "value"]}
                            >
                              <Input 
                                placeholder={`Введіть ${char.name.toLowerCase()}`}
                                className="field-input"
                              />
                              <Form.Item name={[index, "id"]} hidden initialValue={char.id}>
                                <Input />
                              </Form.Item>
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Form.List>
                </div>
              )}
            </Col>

            {/* Правый столбец - детали товара */}
            <Col xs={24} lg={10}>
              <div className="form-card">
                <h3>Деталі та ціноутворення</h3>
                
                <Form.Item 
                  label={<span className="font-semibold text-[#2b3924]">Новий товар</span>} 
                  name="IsNew" 
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label={<span className="font-semibold text-[#2b3924]">Колір</span>} 
                      name="Color"
                    >
                      <Input
                        placeholder="Червоний"
                        className="field-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label={<span className="font-semibold text-[#2b3924]">Вага (кг)</span>} 
                      name="Weight"
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        placeholder="0.5"
                        style={{ width: "100%" }}
                        className="field-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={labelReq("Ціна (грн)")}
                      name="Price"
                      rules={[{  message: "Вкажіть ціну" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="1000"
                        className="field-input"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        //parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={labelReq("Кількість")}
                      name="Quantity"
                      rules={[{ message: "Вкажіть кількість" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="10"
                        className="field-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Кнопки действий */}
                <div className="action-buttons">
                  <Button 
                    onClick={() => navigate(-1)}
                    className="cancel-button"
                    size="large"
                  >
                    Скасувати
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={saving}
                    className="save-button"
                    size="large"
                  >
                    {saving ? 'Збереження...' : 'Зберегти зміни'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default EditProductPage;