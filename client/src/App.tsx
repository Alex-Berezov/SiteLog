import { Layout, Menu, Typography, theme } from 'antd';
import { BookOutlined, DashboardOutlined } from '@ant-design/icons';
import WorkLogsPage from './pages/WorkLogsPage';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
          }}
        />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['work-logs']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Дашборд
          </Menu.Item>
          <Menu.Item key="work-logs" icon={<BookOutlined />}>
            Журнал работ
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer }}>
          <Title level={3} style={{ margin: '14px 0 0 0' }}>
            SiteLog
          </Title>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <WorkLogsPage />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
