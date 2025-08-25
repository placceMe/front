
import React, { useEffect, useState } from "react";
import { Table, Input, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAdminApi, type User } from "@features/admin/Products/api/api";


const PAGE_SIZE = 20;

const AdminUsers: React.FC = () => {
  const api = useAdminApi();
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

const fetch = async () => {
  setLoading(true);
  try {
    const res = await api.getUsers({ page, pageSize: PAGE_SIZE, search });
    setData(res ?? []);
    setTotal(res?.length ?? 0);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetch(); }, [page]); // search — по Enter

const columns: ColumnsType<User> = [
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Имя", dataIndex: "name", key: "name" },
  { title: "Фамилия", dataIndex: "surname", key: "surname" },
  { title: "Телефон", dataIndex: "phone", key: "phone", render: v => v ?? "-" },
  { title: "Роли", dataIndex: "roles", key: "roles", render: (roles: string[]) => roles?.map(r => <Tag key={r}>{r}</Tag>) },
  { title: "Статус", dataIndex: "state", key: "state", render: (v) => <Tag color={v === "active" ? "green" : "red"}>{v}</Tag> },
  { title: "Создан", dataIndex: "createdAt", key: "createdAt", render: v => new Date(v).toLocaleString() },
  { title: "ID", dataIndex: "id", key: "id", width: 260, ellipsis: true },
];


  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input.Search
          placeholder="Поиск по email / имени"
          allowClear
          onSearch={() => { setPage(1); fetch(); }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 420 }}
        />
      </div>

      <Table<User>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          total,
          current: page,
          pageSize: PAGE_SIZE,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default AdminUsers;
