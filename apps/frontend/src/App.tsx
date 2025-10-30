import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PortfolioPage from './pages/PortfolioPage';
import StockDetailPage from './pages/StockDetailPage';
import AppHeader from './components/AppHeader';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px 50px' }}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
