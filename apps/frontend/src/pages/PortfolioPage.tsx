import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { portfolioStore } from '../stores/PortfolioStore';
import type { Portfolio } from '../types';
import PortfolioModal from '../components/PortfolioModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PortfolioPage = observer(() => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    portfolioStore.fetchPortfolios();
  }, []);

  const handleAdd = () => {
    setEditingPortfolio(null);
    setModalVisible(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await portfolioStore.deletePortfolio(id);
      message.success('Stock removed from portfolio');
    } catch (error) {
      message.error('Failed to remove stock');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingPortfolio(null);
  };

  const columns: ColumnsType<Portfolio> = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => (
        <Tag color="blue" style={{ fontSize: 14, fontWeight: 600 }}>
          {symbol}
        </Tag>
      ),
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      align: 'right',
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      align: 'right',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Total Investment',
      key: 'totalInvestment',
      align: 'right',
      render: (_: any, record: Portfolio) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${(record.shares * record.purchasePrice).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date: string) =>
        date ? dayjs(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 180,
      render: (_: any, record: Portfolio) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/stock/${record.symbol}`)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Remove from portfolio?"
            description="Are you sure you want to remove this stock?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalInvestment = portfolioStore.portfolios.reduce(
    (sum, p) => sum + p.shares * p.purchasePrice,
    0
  );

  const totalStocks = portfolioStore.portfolios.length;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Stocks"
              value={totalStocks}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Investment"
              value={totalInvestment}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            My Portfolio
          </Title>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            Add Stock
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={portfolioStore.portfolios}
          rowKey="_id"
          loading={portfolioStore.loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} stocks`,
          }}
        />
      </Card>

      <PortfolioModal
        visible={modalVisible}
        portfolio={editingPortfolio}
        onClose={handleModalClose}
      />
    </div>
  );
});

export default PortfolioPage;
