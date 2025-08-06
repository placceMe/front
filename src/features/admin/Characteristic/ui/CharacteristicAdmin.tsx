import { Select, Table, Modal, Form, Input, Button } from "antd";
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

    const { fetchCategories, addCharacteristic, loading, error, fetchCharacteristics } = useCharacteristicAdmin();

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
