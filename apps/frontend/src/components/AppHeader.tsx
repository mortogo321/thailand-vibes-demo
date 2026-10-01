import { StockOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

function AppHeader() {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#001529',
        padding: '0 50px',
      }}
    >
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        onClick={() => navigate('/')}
        aria-label="Go to portfolio home"
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
      </button>
    </Header>
  );
}

export default AppHeader;
