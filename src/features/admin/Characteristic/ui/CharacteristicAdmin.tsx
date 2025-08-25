/*import { Select, Table, Modal, Form, Input, Button } from "antd";
import { useEffect, useState, type FC } from "react";
import { useCharacteristicAdmin } from "../api/useCharacteristicAdmin";

type Characteristic = {
    id: string;
    name: string;
    code: string;
    type: string;
    categoryId: string;
    createdAt: string;
};

const CharacteristicAdmin: FC = () => {

    const { fetchCategories, addCharacteristic, loading, fetchCharacteristics } = useCharacteristicAdmin();

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();


    const categoryHandler = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            fetchCharacteristics(categoryId)
                .then(data => {
                    setCharacteristics(data as any[]);
                })
                .catch(err => {
                    console.error("Error fetching characteristics:", err);
                });
        } else {
            setCharacteristics([]);
        }
    };

    const handleAddCharacteristic = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (selectedCategory) {
                const characteristicData = {
                    Name: values.name,
                    code: values.code,
                    type: values.type,
                    categoryId: selectedCategory
                };
                await addCharacteristic(characteristicData);
                form.resetFields();
                setIsModalOpen(false);
                // Refresh characteristics
                categoryHandler(selectedCategory);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data as any[]);
        };
        loadCategories();
    }, []);

    return (
        <div>
            <Select
                style={{ width: 300, marginBottom: 20 }}
                value={selectedCategory}
                onChange={categoryHandler}
                options={categories.map(category => ({
                    label: category.name,
                    value: category.id
                }))}
            />
            {
                selectedCategory && (<Button
                    type="primary"
                    onClick={handleAddCharacteristic}
                    style={{ marginBottom: 20 }}
                >
                    Add Characteristic
                </Button>)
            }
            <Table
                dataSource={characteristics}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Code', dataIndex: 'code', key: 'code' },
                    { title: 'Type', dataIndex: 'type', key: 'type' },
                    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
                ]}
                pagination={false}
                rowKey="id"
                loading={loading}
                style={{ width: 800, marginTop: 20 }}
            />
            <Modal
                title="Add Characteristic"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="addCharacteristicForm"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the characteristic name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'Please input the characteristic code!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select the characteristic type!' }]}
                    >
                        <Select
                            options={[
                                { label: 'String', value: 'string' },
                                { label: 'Number', value: 'number' },
                                { label: 'Boolean', value: 'boolean' },
                                { label: 'Date', value: 'date' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CharacteristicAdmin;
*/
import {
  Select, Table, Modal, Form, Input, Button, Space, Tag, Typography,
  Tooltip, Switch, InputNumber, message
} from "antd";
import { useEffect, useMemo, useState, type FC } from "react";
import { MdContentCopy, MdEdit } from "react-icons/md";
import {
  useCharacteristicAdmin,
  type CharacteristicDto,
  type CharType
} from "../api/useCharacteristicAdmin";

/* ---------- Типы пресета ---------- */
export type CharPreset = {
  name: string;
  code: string;
  type: CharType;
  unit?: string;
  options?: string[];
  required?: boolean;
  filterable?: boolean;
  kitRelevant?: boolean;
  order?: number;
};

/* ---------- Размерные системы ---------- */
const SIZE_SYSTEM_OPTIONS = [
  "Generic",          // S/M/L
  "Clothing",         // 44-62
  "FootwearEU",
  "FootwearUS",
  "FootwearUK",
  "HeadCircumference",// см
  "PlateSAPI",        // SAPI S/M/L/XL
  "Cm",
  "Inch",
];

/* ---------- Общие пресеты (для всех категорий) ---------- */
const COMMON_PRESETS: CharPreset[] = [
  { name: "Стан", code: "condition", type: "select",
    options: ["Новий","Відмінний стан","Нормальний стан"],
    required: true, filterable: true, kitRelevant: true, order: 1 },

  { name: "Колір", code: "color", type: "select",
    options: ["Olive","Black","Coyote","Brown","Green","Multicam","ММ-14"],
    filterable: true, kitRelevant: true, order: 2 },

  { name: "Розмір: система", code: "size_system", type: "select",
    options: SIZE_SYSTEM_OPTIONS, filterable: true, kitRelevant: true, order: 3 },

  { name: "Розмір: значення", code: "size_value", type: "string",
    kitRelevant: true, order: 4 },

  { name: "Розмір: значення (число)", code: "size_value_num", type: "number",
    unit: "", filterable: true, kitRelevant: true, order: 5 },

  { name: "Розмір: одиниця", code: "size_unit", type: "string",
    kitRelevant: true, order: 6 },
];

/* ---------- Категорийные пресеты ---------- */
export const CATEGORY_PRESETS: Record<string, CharPreset[]> = {
  "Бронежилети": [
    { name: "Рівень захисту", code: "protection_level", type: "select", options: ["IIIA","III","IV"], required: true, filterable: true, kitRelevant: true, order: 10 },
    { name: "Площа захисту",  code: "coverage",          type: "select", options: ["Фронт+Спина","360°"], filterable: true, order: 11 },
    { name: "Вага",           code: "weight",            type: "number", unit: "кг", filterable: true, kitRelevant: true, order: 12 },
    { name: "Сумісність з плитами", code: "plates_compat", type: "select", options: ["25x30 см","25x35 см","Інше"], order: 13 },
  ],

  "Плитоноски": [
    { name: "Форм-фактор",     code: "form_factor", type: "select", options: ["Low Profile","Assault","Modular"], filterable: true, kitRelevant: true, order: 10 },
    { name: "Система кріплення", code: "molle",     type: "boolean", kitRelevant: true, order: 11 },
    { name: "Розмір плити",    code: "plate_size",  type: "select", options: ["SAPI S","SAPI M","SAPI L","SAPI XL"], required: true, filterable: true, order: 12 },
  ],

  "Тактичні шоломи та аксесуари": [
    { name: "Розмір (S/M/L/XL)", code: "helmet_size",      type: "select", options: ["S","M","L","XL"], required: true, filterable: true, kitRelevant: true, order: 10 },
    { name: "Клас захисту",      code: "protection_class", type: "select", options: ["IIIA","III","IV"], filterable: true, kitRelevant: true, order: 11 },
    { name: "Підвісна система",  code: "suspension_system",type: "select", options: ["Team Wendy","BOA","H-Nape","X-Nape"], filterable: true, kitRelevant: true, order: 12 },
    { name: "Матеріал",          code: "material",         type: "string", order: 13 },
    { name: "Модель",            code: "model",            type: "string", order: 14 },
    { name: "Тип вирізу",        code: "cut",              type: "select", options: ["High Cut","Mid Cut","Full Cut"], filterable: true, kitRelevant: true, order: 15 },
    { name: "Баллістичний",      code: "ballistic",        type: "boolean", filterable: true, kitRelevant: true, order: 16 },
    { name: "Кріплення NVG",     code: "nvg_mount",        type: "boolean", order: 17 },
  ],

  "Активні навушники та аксесуари": [
    { name: "Стандарти",             code: "standard",            type: "multiselect", options: ["ANSI","CE","MIL-STD"], filterable: true, order: 10 },
    { name: "Водонепроникність",     code: "waterproof",          type: "boolean",     filterable: true, order: 11 },
    { name: "Рівень шумозаглушення", code: "nrr",                 type: "number", unit: "дБ", filterable: true, order: 12 },
    { name: "Тип підключення",       code: "conn",                type: "select", options: ["3.5mm","PTT","Bluetooth"], filterable: true, order: 13 },
    { name: "Заміна амбушюр",        code: "earpad_replaceable",  type: "boolean", order: 14 },
  ],

  "Тактичне взуття": [
    { name: "Модель",           code: "model",        type: "string",  order: 10 },
    { name: "Матеріал",         code: "material",     type: "string",  order: 11 },
    { name: "Водонепроникність/мембрана", code: "membrane", type: "boolean", filterable: true, order: 12 },
    { name: "Сезон",            code: "season",       type: "select",  options: ["Літо","Демісезон","Зима"], required: true, filterable: true, kitRelevant: true, order: 13 },
    { name: "Висота берця",     code: "boot_height",  type: "select",  options: ["Low","Mid","High"], filterable: true, order: 14 },
    { name: "Підошва",          code: "sole",         type: "string",  order: 15 },
  ],

  "Тактичний одяг": [
    { name: "Сезон",             code: "season",          type: "select", options: ["Літо","Осінь","Зима"], required: true, filterable: true, kitRelevant: true, order: 10 },
    { name: "Матеріал",          code: "fabric",          type: "string", order: 11 },
    { name: "Склад тканини",     code: "fabric_comp",     type: "string", order: 12 },
    { name: "Вітро/волого захисна", code: "wind_waterproof", type: "boolean", filterable: true, order: 13 },
    { name: "Важкозаймиста",     code: "fire_resistant",  type: "boolean", filterable: true, order: 14 },
    { name: "Дихаюча",           code: "breathable",      type: "boolean", filterable: true, order: 15 },
    { name: "Комплект",          code: "set_items",       type: "multiselect", options: ["Куртка","Штани","Чохол"], order: 16 },
    { name: "Камуфляж/патерн",   code: "camo",            type: "select", options: ["Білий","Multicam","PenCott SnowDrift","ММ-14","Olive","Black"], filterable: true, order: 17 },
  ],

  "Тактичне спорядження": [
    { name: "Обʼєм / літраж", code: "volume",     type: "number", unit: "л", filterable: true, order: 10 },
    { name: "MOLLE",          code: "molle",      type: "boolean", filterable: true, order: 11 },
    { name: "Тип",            code: "gear_type",  type: "select", options: ["Підсумок","Розгрузка","Рюкзак","Гідратор"], filterable: true, order: 12 },
  ],
};

/* Сливаем общие и категорийные пресеты */
const PRESETS_FOR = (categoryName?: string) =>
  [
    ...COMMON_PRESETS,
    ...(categoryName && CATEGORY_PRESETS[categoryName] ? CATEGORY_PRESETS[categoryName] : [])
  ].sort((a,b) => (a.order ?? 999) - (b.order ?? 999));

/* ---------- Типы данных таблицы/формы ---------- */
type CharacteristicRow = {
  id: string;
  name: string;
  code: string;
  type: string;              // с бэка приходит string
  unit?: string | null;
  options?: string[] | null;
  required?: boolean;
  filterable?: boolean;
  kitRelevant?: boolean;
  order?: number;
  categoryId: string;
  createdAt: string;
};

type CharacteristicFormValues = {
  name: string;
  code: string;
  type: CharType;
  unit?: string;
  options?: string | string[];
  required?: boolean;
  filterable?: boolean;
  kitRelevant?: boolean;
  order?: number;
};

const typeOptions = [
  { label: "Рядок", value: "string" },
  { label: "Число", value: "number" },
  { label: "Логічний", value: "boolean" },
  { label: "Дата", value: "date" },
  { label: "Список", value: "select" },
  { label: "Кілька значень", value: "multiselect" },
];

/* Безопасно приводим string -> CharType */
const toCharType = (x: string): CharType => {
  const v = (x || "").toLowerCase();
  if (["string","number","boolean","date","select","multiselect"].includes(v)) return v as CharType;
  return "string";
};

const CharacteristicAdmin: FC = () => {
  const {
    fetchCategories, fetchCharacteristics,
    addCharacteristic, updateCharacteristic, loading
  } = useCharacteristicAdmin();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [characteristics, setCharacteristics] = useState<CharacteristicRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<CharacteristicRow | null>(null);
  const [form] = Form.useForm<CharacteristicFormValues>();

  const currentCategoryName = useMemo(
    () => categories.find((c) => c.id === selectedCategory)?.name as string | undefined,
    [categories, selectedCategory]
  );

  /* загрузки */
  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
    if (!selectedCategory && data?.length) setSelectedCategory(data[0].id);
  };
  const loadCharacteristics = async (categoryId: string) => {
    const data = await fetchCharacteristics(categoryId);
    setCharacteristics(Array.isArray(data) ? (data as CharacteristicRow[]) : []);
  };
  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { if (selectedCategory) loadCharacteristics(selectedCategory); }, [selectedCategory]);

  /* открыть модалку на создание */
  const openCreate = () => {
    setEditRow(null);
    form.resetFields();
    form.setFieldsValue({
      required: true, filterable: true, kitRelevant: true,
      order: (characteristics?.length || 0) + 1
    });
    setIsModalOpen(true);
  };

  /* редактирование */
  const openEdit = (row: CharacteristicRow) => {
    setEditRow(row);
    form.setFieldsValue({
      name: row.name,
      code: row.code,
      type: toCharType(row.type),
      unit: row.unit ?? undefined,
      options: row.options?.join(", ") ?? "",
      required: !!row.required,
      filterable: !!row.filterable,
      kitRelevant: !!row.kitRelevant,
      order: row.order ?? 1,
    });
    setIsModalOpen(true);
  };

  /* сохранить (create/update) */
  const submit = async () => {
    const values = await form.validateFields();

    const normalizedOptions =
      Array.isArray(values.options)
        ? values.options
        : (values.type === "select" || values.type === "multiselect")
            ? String(values.options || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
            : undefined;

    const payload: CharacteristicDto = {
      name: values.name,
      code: values.code,
      type: values.type,
      unit: values.unit || undefined,
      options: normalizedOptions,
      required: !!values.required,
      filterable: !!values.filterable,
      kitRelevant: !!values.kitRelevant,
      order: values.order ?? 1,
      categoryId: selectedCategory!,
    };

    if (editRow) {
      await updateCharacteristic(editRow.id, payload);
      message.success("Характеристику оновлено");
    } else {
      await addCharacteristic(payload);
      message.success("Характеристику додано");
    }
    setIsModalOpen(false);
    form.resetFields();
    if (selectedCategory) loadCharacteristics(selectedCategory);
  };

  /* клик по зеленому тегу – заполнить и открыть модалку
     Ctrl/⌘ + клик — создать сразу без модалки */
  const handlePresetClick = async (preset: CharPreset, e?: React.MouseEvent) => {
    const defaults: CharacteristicFormValues = {
      name: preset.name,
      code: preset.code,
      type: preset.type,
      unit: preset.unit,
      options: preset.options?.join(", "),
      required: preset.required ?? true,
      filterable: preset.filterable ?? true,
      kitRelevant: preset.kitRelevant ?? true,
      order: preset.order ?? (characteristics?.length || 0) + 1,
    };

    // Ctrl/⌘ клик -> моментально создать
    if (e && (e.ctrlKey || e.metaKey)) {
      const instant: CharacteristicDto = {
        name: defaults.name,
        code: defaults.code,
        type: defaults.type,
        unit: defaults.unit,
        options: preset.options,
        required: !!defaults.required,
        filterable: !!defaults.filterable,
        kitRelevant: !!defaults.kitRelevant,
        order: defaults.order,
        categoryId: selectedCategory!,
      };
      await addCharacteristic(instant);
      message.success(`Додано: ${instant.name}`);
      if (selectedCategory) loadCharacteristics(selectedCategory);
      return;
    }

    // обычный клик -> открыть модалку с уже заполненной формой
    setEditRow(null);
    form.setFieldsValue(defaults);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          style={{ minWidth: 320 }}
          value={selectedCategory ?? undefined}
          onChange={(val) => setSelectedCategory(val)}
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          placeholder="Оберіть категорію"
        />
        {selectedCategory && (
          <Button type="primary" onClick={openCreate} loading={loading}>
            Додати характеристику
          </Button>
        )}
      </Space>

      {/* Пресети: общие + категорийные */}
      {currentCategoryName && (
        <div style={{ marginBottom: 12 }}>
          <Typography.Text type="secondary">Швидкі пресети:</Typography.Text>
          <Space wrap size={8} style={{ marginTop: 8 }}>
            {PRESETS_FOR(currentCategoryName).map((p) => (
              <Tag
                key={p.code}
                color="green"
                style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}
                onClick={(e) => handlePresetClick(p, e)}
                title="Клік — відкрити форму; Ctrl/⌘+клік — створити відразу"
              >
                {p.name}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <Table
        rowKey="id"
        dataSource={characteristics}
        loading={loading}
        pagination={false}
        style={{ marginTop: 8 }}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            width: 260,
            render: (id: string) => (
              <Space>
                <Tooltip title={id}>
                  <Typography.Text code style={{ fontFamily: "ui-monospace" }}>
                    {id.slice(0, 6)}…{id.slice(-4)}
                  </Typography.Text>
                </Tooltip>
                <Button
                  type="text"
                  size="small"
                  icon={<MdContentCopy />}
                  onClick={() => navigator.clipboard.writeText(id).then(() => message.success("ID скопійовано"))}
                />
              </Space>
            ),
          },
          { title: "Назва", dataIndex: "name" },
          { title: "Код", dataIndex: "code" },
          { title: "Тип", dataIndex: "type", width: 140 },
          {
            title: "Обовʼязк.",
            dataIndex: "required",
            width: 110,
            render: (v: boolean, row) => (
              <Switch
                checked={!!v}
                onChange={async (checked) => {
                  try {
                    await updateCharacteristic(row.id, { required: checked });
                    setCharacteristics((prev) => prev.map((c) => (c.id === row.id ? { ...c, required: checked } : c)));
                    message.success("Збережено");
                  } catch {
                    message.error("Не вдалося оновити");
                  }
                }}
              />
            ),
          },
          {
            title: "Порядок",
            dataIndex: "order",
            width: 110,
            render: (v: number, row) => (
              <InputNumber
                min={1}
                value={v ?? 1}
                onChange={async (val) => {
                  const next = Number(val) || 1;
                  try {
                    await updateCharacteristic(row.id, { order: next });
                    setCharacteristics((prev) => prev.map((c) => (c.id === row.id ? { ...c, order: next } : c)));
                    message.success("Збережено");
                  } catch {
                    message.error("Не вдалося оновити");
                  }
                }}
              />
            ),
          },
          {
            title: "Дії",
            width: 140,
            render: (_: any, row: CharacteristicRow) => (
              <Button icon={<MdEdit />} onClick={() => openEdit(row)}>Редагувати</Button>
            ),
          },
        ]}
      />

      <Modal
        title={editRow ? "Редагувати характеристику" : "Додати характеристику"}
        open={isModalOpen}
        onOk={submit}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        okText="Зберегти"
        cancelText="Скасувати"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="name" label="Назва" rules={[{ required: true, message: "Введіть назву" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Код (латиниця, snake_case)" rules={[{ required: true, message: "Введіть код" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Тип" rules={[{ required: true, message: "Оберіть тип" }]}>
            <Select options={typeOptions} />
          </Form.Item>

          {/* только для number */}
          <Form.Item noStyle shouldUpdate={(p, c) => p.type !== c.type}>
            {({ getFieldValue }) =>
              getFieldValue("type") === "number" ? (
                <Form.Item name="unit" label="Одиниця виміру">
                  <Input placeholder="наприклад, кг / л / дБ / см" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          {/* для select/multiselect */}
          <Form.Item noStyle shouldUpdate={(p, c) => p.type !== c.type}>
            {({ getFieldValue }) =>
              ["select", "multiselect"].includes(getFieldValue("type")) ? (
                <Form.Item name="options" label="Варіанти (через кому)">
                  <Input.TextArea rows={3} placeholder="Напр.: Новий, Відмінний стан, Нормальний стан" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Space size="large" style={{ display: "flex" }}>
            <Form.Item name="required" valuePropName="checked" label="Обовʼязкова">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item name="filterable" valuePropName="checked" label="Фільтрувати">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item name="kitRelevant" valuePropName="checked" label="Для підбору комплектів">
              <Switch defaultChecked />
            </Form.Item>
          </Space>

          <Form.Item name="order" label="Порядок" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CharacteristicAdmin;
