import { Button, ConfigProvider, Layout, Typography } from 'antd';
import ruRU from 'antd/locale/ru_RU';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Журнал работ
          </Title>
        </Header>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              minHeight: '300px',
            }}
          >
            <Title level={4}>Добро пожаловать</Title>
            <p>Здесь будет таблица журнала работ.</p>
            <Button type="primary">Тестовая кнопка Ant Design</Button>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
