import { useState } from 'react';
import { Modal, Input, List, Typography, Tag, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { stocksApi } from '../services/api';

const { Text } = Typography;

interface StockSearchResult {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

interface StockSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (stock: StockSearchResult) => void;
}

function StockSearchModal({ visible, onClose, onSelect }: StockSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchQuery(value);

    if (value.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await stocksApi.search(value);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (stock: StockSearchResult) => {
    onSelect(stock);
    setSearchQuery('');
    setResults([]);
    onClose();
  };

  const handleCancel = () => {
    setSearchQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal
      title="Search Stocks"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Input
        size="large"
        placeholder="Search by symbol or company name..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        autoFocus
        style={{ marginBottom: 16 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : results.length > 0 ? (
        <List
          dataSource={results}
          style={{ maxHeight: 400, overflowY: 'auto' }}
          renderItem={(stock) => (
            <List.Item
              style={{ cursor: 'pointer', padding: '12px 0' }}
              onClick={() => handleSelect(stock)}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="blue">{stock.symbol}</Tag>
                    <Text strong>{stock.name}</Text>
                  </div>
                }
                description={
                  <Text type="secondary">
                    {stock.exchangeShortName} • {stock.currency}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : searchQuery.length >= 1 ? (
        <Empty
          description="No stocks found"
          style={{ padding: 40 }}
        />
      ) : (
        <Empty
          description="Start typing to search for stocks"
          style={{ padding: 40 }}
        />
      )}
    </Modal>
  );
}

export default StockSearchModal;
