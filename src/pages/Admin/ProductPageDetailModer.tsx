// src/pages/admin/ProductPageDetailModer.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Descriptions,
  Image,
  Button,
  Tag,
  message,
  Card,
  Row,
  Col,
  Space,
  Spin,
  Badge,
  Statistic,
  Avatar,
  Tooltip,
  Modal,
  Grid,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  InboxOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  TagsOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useRequest } from "@shared/request/useRequest";

/** ===== Типи (узгоджені з беком) ===== */
type ProductDetails = {
  id: string;
  title: string;
  description?: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  // может прийти не строка
  additionalImageUrls?: Array<{
    id: string;
    url: string;
    fileName?: string;
    size?: number;
    contentType?: string;
    productId?: string;
    createdAt?: string;
  }> | string[] | string;
  categoryId: string;
  category?: { id: string; name?: string; title?: string; } | null;
  sellerId?: string;
  quantity: number;
  state?: string;
  characteristics?: Array<{
    characteristicDictId: string;
    value: string;
    name?: string;
    characteristicDict?: { name?: string; code?: string; type?: string; };
  }>;
};

const API_PRODUCTS = "/api/products";


/** ===== Безопасная нормализация значения в строку пути ===== */
const coerceToPathString = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const cand =
      (v as any).url ?? (v as any).href ?? (v as any).path ?? (v as any).value;
    if (typeof cand === "string") return cand;
  }
  return v == null ? "" : String(v);
};

/** ===== additionalImageUrls может быть чем угодно: делаем список строк =====
const splitMaybeCommaList = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map(coerceToPathString)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  const s = coerceToPathString(val);
  if (!s) return [];
  // если пришла строка с запятыми
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};
 */
const splitMaybeCommaList = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    // Уже массив - просто очищаем и фильтруем
    return val
      .map(coerceToPathString)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  const s = coerceToPathString(val);
  if (!s) return [];
  // Строка с запятыми
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

/** ===== Статус-бейдж ===== */
const statusTag = (s?: string) => {
  switch (s) {
    case "Active":
      return <Tag color="green">Активний</Tag>;
    case "Blocked":
      return <Tag color="red">Заблокований</Tag>;
    case "Archived":
      return <Tag color="blue">В архіві</Tag>;
    case "Moderation":
      return <Tag color="gold">Модерація</Tag>;
    case "Deleted":
      return <Tag>Видалений</Tag>;
    default:
      return <Tag>{s || "—"}</Tag>;
  }
};

const ProductModerationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const { request: requestProduct, loading: loadingProduct } = useRequest();
  const { request: requestDelete } = useRequest();
  const [loadingState, setLoadingState] = useState(false);

  // Додаємо стан для модального вікна
  const [modalVisible, setModalVisible] = useState(false);
  const [currentState, setCurrentState] = useState('');
  const [currentConfig, setCurrentConfig] = useState<any>(null);

  const [item, setItem] = useState<ProductDetails | null>(null);

  const fetchItem = async () => {
    if (!id) return;

    const loadingKey = `fetching-${Date.now()}`;

    try {
      // Show loading notification for slow connections
      const loadingTimeout = setTimeout(() => {
        message.loading({
          content: 'Завантаження даних товару...',
          key: loadingKey,
          duration: 0
        });
      }, 500);

      const r = await requestProduct(`/api/products/${id}`);

      // Clear loading notification
      clearTimeout(loadingTimeout);
      message.destroy(loadingKey);

      if (!r.id) throw new Error(`Товар з ID ${id} не знайдено`);

      setItem(r);

      // Show success notification
      message.success({
        content: `Дані товару "${r.title}" успішно завантажено`,
        duration: 2
      });

    } catch (error: any) {
      message.destroy(loadingKey);

      const errorMessage = error.message || "Не вдалося завантажити товар";
      message.error({
        content: `Помилка завантаження: ${errorMessage}`,
        duration: 5
      });

      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    console.log('Component mounted, id from params:', id);
    fetchItem();
  }, [id]);

  const changeState = async (state: string) => {

    // Простий тест - показуємо alert щоб переконатися що функція викликається

    if (!id) {
      console.error('No ID provided');
      return;
    }

    // Define state-specific messages and configurations
    const stateConfigs = {
      Active: {
        title: '✅ Схвалення товару',
        content: `Ви збираєтеся схвалити товар "${item?.title}". Після схвалення товар стане доступним для покупців у магазині.`,
        successMessage: '🎉 Товар успішно схвалено! Тепер він доступний для покупців.',
        okText: 'Схвалити товар',
        icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
        okType: 'primary' as const
      },
      Blocked: {
        title: '🚫 Блокування товару',
        content: `Ви збираєтеся заблокувати товар "${item?.title}". Після блокування товар не буде доступний для покупців.`,
        successMessage: '⚠️ Товар заблоковано. Покупці більше не можуть його придбати.',
        okText: 'Заблокувати товар',
        icon: <StopTwoTone twoToneColor="#ff4d4f" />,
        okType: 'danger' as const
      },
      Archived: {
        title: '📦 Архівування товару',
        content: `Ви збираєтеся архівувати товар "${item?.title}". Архівовані товари приховуються від покупців, але зберігаються в системі.`,
        successMessage: '📦 Товар переміщено в архів. Його можна буде відновити пізніше.',
        okText: 'Архівувати товар',
        icon: <InboxOutlined />,
        okType: 'default' as const
      },
      Moderation: {
        title: '⏳ Повернення на модерацію',
        content: `Ви збираєтеся повернути товар "${item?.title}" на модерацію. Товар буде очікувати повторного розгляду.`,
        successMessage: '⏳ Товар повернуто на модерацію. Він очікує повторного розгляду.',
        okText: 'Повернути на модерацію',
        icon: <ExclamationCircleOutlined />,
        okType: 'default' as const
      }
    };

    const config = stateConfigs[state as keyof typeof stateConfigs];
    if (!config) {
      message.error('Невідомий статус товару');
      return;
    }

    console.log('About to show modal with config:', config);

    // Замість Modal.confirm використаємо useState підхід
    setCurrentState(state);
    setCurrentConfig(config);
    setModalVisible(true);
  };

  const deleteProduct = async () => {
    console.log('deleteProduct called, id:', id, 'item:', item);

    if (!id || !item) {
      console.error('Missing id or item:', { id, item });
      return;
    }

    Modal.confirm({
      title: '🗑️ Видалення товару',
      content: (
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph strong style={{ color: '#ff4d4f', marginBottom: 16 }}>
            ⚠️ УВАГА: Ця дія незворотна!
          </Typography.Paragraph>
          <Typography.Paragraph style={{ marginBottom: 16 }}>
            Ви збираєтеся повністю видалити товар "{item.title}" з системи.
            Всі дані, включаючи зображення, характеристики та історію, будуть втрачені назавжди.
          </Typography.Paragraph>

          <div style={{
            padding: '16px',
            background: '#fff2f0',
            borderRadius: '6px',
            border: '1px solid #ffccc7'
          }}>
            <Typography.Text strong>Інформація про товар:</Typography.Text>
            <br />
            <Typography.Text>ID: {item.id}</Typography.Text>
            <br />
            <Typography.Text>Назва: {item.title}</Typography.Text>
            <br />
            <Typography.Text>Статус: {statusTag(item.state)}</Typography.Text>
            <br />
            <Typography.Text>Ціна: {item.price} ₴</Typography.Text>
            <br />
            <Typography.Text>Продавець: {item.sellerId || 'Невідомо'}</Typography.Text>
          </div>

          <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
            <Typography.Text strong>
              Для підтвердження введіть назву товару нижче:
            </Typography.Text>
          </Typography.Paragraph>
        </div>
      ),
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText: 'Видалити назавжди',
      okType: 'danger',
      cancelText: 'Скасувати',
      width: 580,
      onOk: async () => {
        // Additional confirmation step
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: '🔒 Остаточне підтвердження',
            content: (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Typography.Title level={4} style={{ color: '#ff4d4f' }}>
                  Останній шанс зупинитися!
                </Typography.Title>
                <Typography.Paragraph>
                  Натисніть "Підтверджую видалення", щоб остаточно видалити товар.
                </Typography.Paragraph>
              </div>
            ),
            icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
            okText: 'Підтверджую видалення',
            okType: 'danger',
            cancelText: 'Ні, залишити товар',
            width: 450,
            onOk: async () => {
              setLoadingState(true);
              const loadingKey = `deleting-${Date.now()}`;

              // Show loading notification
              message.loading({
                content: `Видалення товару "${item.title}"...`,
                key: loadingKey,
                duration: 0
              });

              try {
                const response = await requestDelete(`${API_PRODUCTS}/${id}`, {
                  method: "DELETE"
                });

                if (response && !response.error) {
                  // Hide loading and show success
                  message.success({
                    content: `🗑️ Товар "${item.title}" успішно видалено з системи!`,
                    key: loadingKey,
                    duration: 5
                  });

                  // Additional notification
                  setTimeout(() => {
                    message.info({
                      content: 'Перенаправлення до списку товарів...',
                      duration: 2
                    });
                  }, 1000);

                  // Navigate back after a short delay
                  setTimeout(() => {
                    navigate("/admin/productsmoder");
                  }, 2000);

                } else {
                  throw new Error(response?.message || response?.error || 'Помилка сервера');
                }
              } catch (error: any) {
                message.error({
                  content: `Помилка при видаленні товару: ${error.message || 'Невідома помилка'}`,
                  key: loadingKey,
                  duration: 6
                });
                console.error('Delete error:', error);
              } finally {
                setLoadingState(false);
              }

              resolve(true);
            },
            onCancel: () => {
              message.info('Видалення скасовано. Товар залишається в системі.');
              reject(false);
            }
          });
        });
      },
    });
  };

  // Helper to normalize images array
  const getImagesArray = (images: any): Array<{ url: string; }> => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      return images.split(',').map(url => ({ url: url.trim() }));
    }
    return [];
  };

  const imagesArray = getImagesArray(item?.additionalImageUrls);

  console.log('Render: ProductModerationDetailsPage', { id, item, loadingProduct, loadingState });

  if (loadingProduct && !item) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/productsmoder")}
              size="large"
            >
              Повернутися до списку
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Typography.Title level={2} style={{ margin: 0, flex: 1 }}>
                {item?.title || "Завантаження..."}
              </Typography.Title>
              {item && statusTag(item.state)}
            </div>
          </Space>
        </Col>

        <Col xs={24} lg={8} style={{ textAlign: screens.lg ? 'right' : 'left' }}>
          <Space wrap>
            <Tooltip title="Оновити дані">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchItem}
                loading={loadingProduct}
                size="large"
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* Status Information Alert */}
      {item && (
        <div style={{ marginBottom: 24 }}>
          {item.state === 'Moderation' && (
            <Card style={{ background: '#fffbe6', border: '1px solid #ffe58f' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <ExclamationCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
                </Col>
                <Col flex={1}>
                  <Typography.Text strong style={{ color: '#d48806' }}>
                    Товар очікує модерації
                  </Typography.Text>
                  <br />
                  <Typography.Text style={{ color: '#ad8b00' }}>
                    Оберіть дію для завершення процесу модерації цього товару
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          )}

          {item.state === 'Active' && (
            <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />
                </Col>
                <Col flex={1}>
                  <Typography.Text strong style={{ color: '#389e0d' }}>
                    Товар активний і доступний для покупців
                  </Typography.Text>
                  <br />
                  <Typography.Text style={{ color: '#237804' }}>
                    При необхідності можна змінити статус або відправити на повторну модерацію
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          )}

          {item.state === 'Blocked' && (
            <Card style={{ background: '#fff2f0', border: '1px solid #ffccc7' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <StopTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 24 }} />
                </Col>
                <Col flex={1}>
                  <Typography.Text strong style={{ color: '#cf1322' }}>
                    Товар заблоковано
                  </Typography.Text>
                  <br />
                  <Typography.Text style={{ color: '#a8071a' }}>
                    Товар недоступний для покупців. Можна розблокувати або архівувати
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          )}

          {item.state === 'Archived' && (
            <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <InboxOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </Col>
                <Col flex={1}>
                  <Typography.Text strong style={{ color: '#0050b3' }}>
                    Товар в архіві
                  </Typography.Text>
                  <br />
                  <Typography.Text style={{ color: '#003a8c' }}>
                    Товар прихований від покупців, але збережений в системі
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      )}

      {/* Action Buttons Section */}
      <Card
        title={
          <Space>
            <InfoCircleOutlined />
            Дії модерації
          </Space>
        }
        style={{ marginBottom: 24 }}
        extra={
          <Badge
            count={item?.state === 'Moderation' ? 'Очікує' : 'Оброблено'}
            color={item?.state === 'Moderation' ? 'gold' : 'green'}
          />
        }
      >
        <Row gutter={[16, 16]}>
          {/* Primary Actions */}
          <Col xs={24} md={12} lg={6}>
            <Button
              type="primary"
              icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Approve button clicked');
                changeState("Active");
              }}
              loading={loadingState}
              disabled={item?.state === "Active"}
              block
              size="large"
              style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 'bold' }}>Схвалити</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>
                Зробити доступним
              </span>
            </Button>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Button
              danger
              icon={<StopTwoTone twoToneColor="#ff4d4f" />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Block button clicked');
                changeState("Blocked");
              }}
              loading={loadingState}
              disabled={item?.state === "Blocked"}
              block
              size="large"
              style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 'bold' }}>Заблокувати</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>
                Приховати від покупців
              </span>
            </Button>
          </Col>

          {/* Secondary Actions */}
          <Col xs={24} md={12} lg={6}>
            <Button
              icon={<ExclamationCircleOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Moderation button clicked');
                changeState("Moderation");
              }}
              loading={loadingState}
              disabled={item?.state === "Moderation"}
              block
              size="large"
              style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 'bold' }}>На модерацію</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                Повторний розгляд
              </span>
            </Button>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Button
              icon={<InboxOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Archive button clicked');
                changeState("Archived");
              }}
              loading={loadingState}
              disabled={item?.state === "Archived"}
              block
              size="large"
              style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 'bold' }}>Архівувати</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                Зберегти як архів
              </span>
            </Button>
          </Col>
        </Row>

        {/* Danger Zone */}
        <div style={{
          marginTop: 24,
          padding: '20px',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '8px'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="small">
                <Typography.Text strong style={{ color: '#ff4d4f' }}>
                  🚨 Небезпечна зона
                </Typography.Text>
                <Typography.Text style={{ color: '#ff4d4f' }}>
                  Видалення товару незворотне. Всі дані будуть втрачені назавжди.
                </Typography.Text>
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <Button
                danger
                type="dashed"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Delete button clicked');
                  deleteProduct();
                }}
                loading={loadingState}
                block
                size="large"
                style={{ height: '48px' }}
              >
                <strong>Видалити назавжди</strong>
              </Button>
            </Col>
          </Row>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column - Images */}
        <Col xs={24} lg={12}>
          {/* Main Image Section */}
          <Card
            title={
              <Space>
                <PictureOutlined />
                Головне зображення
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            {item?.mainImageUrl ? (
              <div style={{ textAlign: 'center' }}>
                <Image
                  width="100%"
                  height={300}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid #1890ff'
                  }}
                  src={`${__BASE_URL__}/api/files/${item.mainImageUrl}`}
                  alt="Main product image"
                  placeholder={
                    <div style={{
                      width: '100%',
                      height: 300,
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px'
                    }}>
                      <PictureOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                    </div>
                  }
                  fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'%3EMain Image Error%3C/text%3E%3C/svg%3E"
                />
                <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  Головне зображення товару
                </Typography.Text>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                background: '#fafafa',
                borderRadius: '12px',
                border: '2px dashed #d9d9d9'
              }}>
                <PictureOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: '16px' }}>
                  Головне зображення відсутнє
                </Typography.Text>
              </div>
            )}
          </Card>

          {/* Additional Images Section */}
          <Card
            title={
              <Space>
                <PictureOutlined />
                Додаткові фотографії
              </Space>
            }
            extra={
              <Badge count={imagesArray.length} color="blue" />
            }
          >
            {imagesArray.length > 0 ? (
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {imagesArray.map((img, i) => (
                    <Col xs={12} sm={8} md={6} key={i}>
                      <Image
                        width="100%"
                        height={120}
                        style={{
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #f0f0f0'
                        }}
                        src={`${__BASE_URL__}/api/files/${img.url}`}
                        alt={`Product image ${i + 1}`}
                        placeholder={
                          <div style={{
                            width: '100%',
                            height: 120,
                            background: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px'
                          }}>
                            <PictureOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
                          </div>
                        }
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E"
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: '#fafafa',
                borderRadius: '8px'
              }}>
                <PictureOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  Немає додаткових зображень
                </Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column - Product Info */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Quick Stats */}
            <Card>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Ціна"
                    value={item?.price || 0}
                    suffix="₴"
                    valueStyle={{ color: '#3f8600', fontSize: '18px' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Кількість"
                    value={item?.quantity || 0}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Зображення"
                    value={1 + imagesArray.length}
                    suffix={`(${item?.mainImageUrl ? '1 головне' : '0 головних'} + ${imagesArray.length} дод.)`}
                    valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Статус"
                    value=""
                    formatter={() => statusTag(item?.state)}
                  />
                </Col>
              </Row>
            </Card>

            {/* Basic Information */}
            <Card
              title={
                <Space>
                  <InfoCircleOutlined />
                  Основна інформація
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={<strong>ID товару</strong>}
                  labelStyle={{ width: '40%', textAlign: 'right' }}
                >
                  <Typography.Text code>{item?.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<strong>Назва</strong>}
                  labelStyle={{ textAlign: 'right' }}
                >
                  {item?.title}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<strong>Категорія</strong>}
                  labelStyle={{ textAlign: 'right' }}
                >
                  <Tag icon={<TagsOutlined />}>
                    {item?.category?.title || item?.category?.name || item?.categoryId || "—"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<strong>Продавець</strong>}
                  labelStyle={{ textAlign: 'right' }}
                >
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {item?.sellerId || "—"}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<strong>Колір</strong>}
                  labelStyle={{ textAlign: 'right' }}
                >
                  {item?.color ? (
                    <Tag color="blue">{item.color}</Tag>
                  ) : "—"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<strong>Вага</strong>}
                  labelStyle={{ textAlign: 'right' }}
                >
                  {item?.weight ? `${item.weight} г` : "—"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Description Section */}
      {item?.description && (
        <Card
          title={
            <Space>
              <EditOutlined />
              Опис товару
            </Space>
          }
          style={{ marginTop: 24 }}
        >
          <Typography.Paragraph style={{ fontSize: '14px', lineHeight: 1.6 }}>
            {item.description}
          </Typography.Paragraph>
        </Card>
      )}

      {/* Characteristics Section */}
      {item?.characteristics && item.characteristics.length > 0 && (
        <Card
          title={
            <Space>
              <TagsOutlined />
              Характеристики
            </Space>
          }
          style={{ marginTop: 24 }}
          extra={<Badge count={item.characteristics.length} color="green" />}
        >
          <Row gutter={[16, 16]}>
            {item.characteristics.map((c, idx) => {
              const label = c.characteristicDict?.name ||
                c.characteristicDict?.code ||
                c.characteristicDictId ||
                `Характеристика ${idx + 1}`;
              return (
                <Col xs={24} sm={12} lg={8} key={idx}>
                  <Card size="small" style={{ height: '100%' }}>
                    <Statistic
                      title={label}
                      value={c.value || "—"}
                      valueStyle={{ fontSize: '14px' }}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Technical Details */}
      <Card
        title={
          <Space>
            <InfoCircleOutlined />
            Технічні деталі зображень
          </Space>
        }
        style={{ marginTop: 24 }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Головне зображення">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'right' }}>
                  <strong>Статус:</strong>{' '}
                  {item?.mainImageUrl ? (
                    <Tag color="green">Наявне</Tag>
                  ) : (
                    <Tag color="red">Відсутнє</Tag>
                  )}
                </div>
                {item?.mainImageUrl && (
                  <div style={{ textAlign: 'right' }}>
                    <strong>URL:</strong>
                    <br />
                    <Typography.Text code copyable style={{ fontSize: '11px' }}>
                      {coerceToPathString(item.mainImageUrl)}
                    </Typography.Text>
                  </div>
                )}
                {item?.mainImageUrl && (
                  <div style={{ textAlign: 'right' }}>
                    <strong>Повний шлях:</strong>
                    <br />
                    <Typography.Text code copyable style={{ fontSize: '11px' }}>
                      {`${__BASE_URL__}/api/files/${item.mainImageUrl}`}
                    </Typography.Text>
                  </div>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title="Додаткові зображення">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'right' }}>
                  <strong>Кількість:</strong>{' '}
                  <Badge count={imagesArray.length} color="blue" />
                </div>
                {imagesArray.length > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <strong>URL список:</strong>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px' }}>
                      {splitMaybeCommaList(item?.additionalImageUrls).map((url, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <Typography.Text code copyable style={{ fontSize: '11px' }}>
                            {url}
                          </Typography.Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {imagesArray.length === 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <Typography.Text type="secondary">
                      Додаткові зображення відсутні
                    </Typography.Text>
                  </div>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Модальне вікно зміни статусу */}
      <Modal
        title={currentConfig?.title}
        open={modalVisible}
        onOk={async () => {
          console.log('Modal onOk clicked');
          setLoadingState(true);
          const loadingKey = `updating-${Date.now()}`;

          // Show loading notification
          message.loading({
            content: `Оновлення статусу товару...`,
            key: loadingKey,
            duration: 0
          });

          try {
            console.log(`${API_PRODUCTS}/${id}/state`);
            const response = await requestProduct(`${API_PRODUCTS}/${id}/state`, {
              method: "PUT",
              body: JSON.stringify({ state: currentState }),
            });

            if (response && !response.error) {
              // Hide loading and show success
              message.success({
                content: currentConfig?.successMessage,
                key: loadingKey,
                duration: 4
              });

              // Refresh item data
              await fetchItem();

              // Show additional info notification
              setTimeout(() => {
                message.info({
                  content: `Статус товару оновлено з "${item?.state}" на "${currentState}"`,
                  duration: 3
                });
              }, 500);

            } else {
              throw new Error(response?.message || response?.error || 'Помилка сервера');
            }
          } catch (error: any) {
            message.error({
              content: `Помилка при зміні статусу: ${error.message || 'Невідома помилка'}`,
              key: loadingKey,
              duration: 5
            });
            console.error('State change error:', error);
          } finally {
            setLoadingState(false);
            setModalVisible(false);
          }
        }}
        onCancel={() => {
          console.log('Modal cancelled');
          setModalVisible(false);
        }}
        okText={currentConfig?.okText}
        cancelText='Скасувати'
        width={520}
        confirmLoading={loadingState}
      >
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 16 }}>
            {currentConfig?.content}
          </Typography.Paragraph>
          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <Typography.Text strong>Інформація про товар:</Typography.Text>
            <br />
            <Typography.Text>ID: {item?.id}</Typography.Text>
            <br />
            <Typography.Text>Поточний статус: {item?.state || 'Невідомо'}</Typography.Text>
            <br />
            <Typography.Text>Продавець: {item?.sellerId || 'Невідомо'}</Typography.Text>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProductModerationDetailsPage;
