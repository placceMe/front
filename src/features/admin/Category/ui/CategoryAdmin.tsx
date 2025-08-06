import { useEffect, useState } from "react";
import { useCategoryAdminApi } from "../api/useCategoryAdminApi";
import { Button, Form, Input, Table } from "antd";

const CategoryAdmin: React.FC = () => {

    const [categories, setCategories] = useState<any[]>([]);
    const { fetchCategories, addCategory, loading } = useCategoryAdminApi();

    const loadCategories = async () => {
        const data = await fetchCategories();

        if (data) {
            setCategories(data as any[]);
        }
    };

    useEffect(() => {

        loadCategories();
    }, []);

    const handleAddCategory = async (category: any) => {

        await addCategory(category);
        loadCategories();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Category Admin</h1>
            <Form style={{ width: 600 }} onFinish={handleAddCategory}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading}>
                    Add Category
                </Button>
            </Form>

            <Table
                style={{ width: 600 }}
                dataSource={categories}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Description', dataIndex: 'status', key: 'status' },
                ]}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </div>
    );
};

export default CategoryAdmin;
