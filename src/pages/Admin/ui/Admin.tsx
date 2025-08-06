import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { MdHeight } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
};


const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100vw',
    minHeight: "100vh"
};

const Admin: React.FC = () => {
    return (
        <Layout style={layoutStyle}>
            <Sider width="240px" style={siderStyle}>
                <Menu
                    style={{ height: '100%', borderRight: 0 }}

                    items={[
                        { key: 'categogories', label: <NavLink to="/admin/categories">Категории</NavLink>, icon: <MdHeight /> },

                    ]}

                />
            </Sider>
            <Content style={contentStyle}>
                <Outlet />
            </Content>

        </Layout>

    );
};

export default Admin;