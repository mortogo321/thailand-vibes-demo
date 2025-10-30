import { Layout, Typography } from 'antd';
import { StockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#001529',
        padding: '0 50px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <StockOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 12 }} />
        <Title
          level={3}
          style={{
            color: 'white',
            margin: 0,
            fontWeight: 600,
          }}
        >
          Stock Portfolio Manager
        </Title>
      </div>
    </Header>
  );
}

export default AppHeader;
