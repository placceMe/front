import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Space, message, Skeleton } from "antd";
import { useAppSelector } from "@store/hooks";
import { useRequest } from "@shared/request/useRequest";

const BLUR_STYLE: React.CSSProperties = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

type Contact = { type: string; value: string; };

type SalerInfoDto = {
  id: string;
  companyName: string;
  description: string;
  schedule: string;
  contacts: Contact[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const SellerProfilePage: React.FC<{ info: SalerInfoDto | null; }> = ({ info }) => {
  const userId = useAppSelector((s) => s.user.user?.id);
  const { request } = useRequest();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);



  const onFinish = async (values: any) => {
    if (!userId) return;

    // 1) чистим контакты
    const contacts: Contact[] = (values.contacts || [])
      .filter((c: Contact) => c?.type?.trim() && c?.value?.trim())
      .map((c: Contact) => ({ type: c.type.trim(), value: c.value.trim() }));

    // 2) базовый payload без userId (используем для PUT)
    const basePayload = {
      companyName: (values.companyName || "").trim(),
      description: (values.description || "").trim(),
      schedule: (values.schedule || "").trim(),
      contacts,
    };

    setSaving(true);
    try {
      if (info?.id) {
        // UPDATE (PUT без userId)
        await request(`/api/salerinfo/${info.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
        });

        if (info?.id) {
          await request(`/api/salerinfo/${info.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(basePayload), // без userId
          });

          // NB: тип указываем как ... | null
          const fresh = await request<SalerInfoDto | null>(`/api/salerinfo/by-user/${userId}`);

          if (!fresh) {
            // сервер вернул 404/пусто — просто обновим локально, чтобы не падать
            message.success("Профіль продавця оновлено");
            return;
          }

          // fresh точно не null — можно безопасно обращаться к полям
          form.setFieldsValue({
            companyName: fresh.companyName ?? "",
            description: fresh.description ?? "",
            schedule: fresh.schedule ?? "",
            contacts: fresh.contacts?.length ? fresh.contacts : [{ type: "", value: "" }],
          });

          message.success("Профіль продавця оновлено");
        }

      } else {
        // CREATE (POST с userId)
        const created = await request<SalerInfoDto>(`/api/salerinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, userId }),
        });
        message.success("Профіль продавця створено");
      }
    } catch (e) {
      message.error("Не вдалося зберегти дані");
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Профіль продавця</h2>

      {loading ? (
        <Skeleton active />
      ) : (
        <Row gutter={24}>
          {/* Левая колонка — форма */}
          <Col xs={24} md={14}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                companyName: "",
                description: "",
                schedule: "",
                contacts: [{ type: "", value: "" }],
              }}
            >
              <Form.Item
                label="Назва компанії "
                name="companyName"
                rules={[{ required: true, message: "Введіть назву компанії" }]}
              >
                <Input
                  placeholder="SAVE Tactical"
                  style={BLUR_STYLE}
                  className="rounded-xl h-10 font-semibold"
                />
              </Form.Item>

              <Form.Item
                label="Опис діяльності "
                name="description"
                rules={[{ required: true, message: "Опишіть діяльність" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Коротко про товари/послуги…"
                  style={BLUR_STYLE}
                  className="rounded-xl font-semibold"
                />
              </Form.Item>

              <Form.Item
                label="Графік роботи "
                name="schedule"
                rules={[{ required: true, message: "Вкажіть графік роботи" }]}
              >
                <Input
                  placeholder="Пн-Пт 09:00-18:00"
                  style={BLUR_STYLE}
                  className="rounded-xl h-10 font-semibold"
                />
              </Form.Item>

              <Form.List name="contacts">
                {(fields, { add, remove }) => (
                  <div>
                    <div className="font-semibold mb-2">Контакти </div>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{ display: "flex" }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "type"]}
                            rules={[{ required: true, message: "Тип контакту" }]}
                          >
                            <Input
                              placeholder="telegram | phone | email | viber | whatsapp"
                              style={BLUR_STYLE}
                              className="rounded-xl h-10 font-semibold w-56"
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "value"]}
                            rules={[{ required: true, message: "Значення контакту" }]}
                            style={{ flex: 1 }}
                          >
                            <Input
                              placeholder="@save_store або +380501234567"
                              style={BLUR_STYLE}
                              className="rounded-xl h-10 font-semibold"
                            />
                          </Form.Item>
                          {fields.length > 1 && (
                            <Button danger onClick={() => remove(field.name)}>
                              Видалити
                            </Button>
                          )}
                        </Space>
                      ))}
                      <Button onClick={() => add()} type="dashed" block>
                        + Додати контакт
                      </Button>
                    </Space>
                  </div>
                )}
              </Form.List>

              <div className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  className="bg-green-700 hover:bg-green-800 rounded-xl px-8"
                >
                  Зберегти
                </Button>
              </div>
            </Form>
          </Col>

          {/* Правая колонка — прев’ю 
          <Col xs={24} md={10}>
            <Card
              title="Контактна інформація компанії"
              bordered
              style={BLUR_STYLE}
              className="rounded-2xl"
            >
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Назва:</span>{" "}
                  {form.getFieldValue("companyName") ||
                    info?.companyName ||
                    "—"}
                </div>
                <div>
                  <span className="font-semibold">Опис:</span>{" "}
                  {form.getFieldValue("description") ||
                    info?.description ||
                    "—"}
                </div>
                <div>
                  <span className="font-semibold">Графік:</span>{" "}
                  {form.getFieldValue("schedule") || info?.schedule || "—"}
                </div>
                <div>
                  <span className="font-semibold">Контакти:</span>
                  <ul className="list-disc ml-5 mt-1">
                    {(contactItemsPreview.length
                      ? contactItemsPreview
                      : info?.contacts || []
                    ).map((c, i) => (
                      <li key={i}>
                        <span className="uppercase">{c.type}</span>: {c.value}
                      </li>
                    ))}
                    {!contactItemsPreview.length && !(info?.contacts?.length) && (
                      <li>—</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          </Col>*/}
        </Row>
      )}
    </div>
  );
};

export default SellerProfilePage;
