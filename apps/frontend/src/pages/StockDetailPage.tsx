import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Tag,
  Spin,
  Alert,
  Typography,
  Descriptions,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { stockStore } from '../stores/StockStore';
import { portfolioStore } from '../stores/PortfolioStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const StockDetailPage = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuote = async () => {
    if (!symbol) return;
    try {
      await stockStore.fetchQuote(symbol);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [symbol]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuote();
    setRefreshing(false);
  };

  if (!symbol) {
    return (
      <Card>
        <Alert message="Stock symbol is required" type="error" />
      </Card>
    );
  }

  const quote = stockStore.getQuote(symbol);
  const portfolio = portfolioStore.getPortfolioBySymbol(symbol);

  const isPositive = quote ? quote.change >= 0 : false;
  const changeColor = isPositive ? '#3f8600' : '#cf1322';

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          size="large"
        >
          Back to Portfolio
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={refreshing}
          size="large"
        >
          Refresh
        </Button>
      </Space>

      {stockStore.loading && !quote ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading stock data...</div>
          </div>
        </Card>
      ) : stockStore.error && !quote ? (
        <Card>
          <Alert
            message="Error Loading Stock Data"
            description={stockStore.error}
            type="error"
            showIcon
          />
        </Card>
      ) : quote ? (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Space direction="vertical" size={0}>
                  <Space align="center">
                    <Tag color="blue" style={{ fontSize: 18, fontWeight: 600 }}>
                      {quote.symbol}
                    </Tag>
                    <Title level={2} style={{ margin: 0 }}>
                      {quote.name}
                    </Title>
                  </Space>
                  <Text type="secondary">
                    Last updated: {dayjs.unix(quote.timestamp).format('MMM DD, YYYY HH:mm:ss')}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Current Price"
                  value={quote.price}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#1890ff', fontSize: 32 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Change"
                  value={quote.change}
                  precision={2}
                  prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  suffix={`(${quote.changesPercentage.toFixed(2)}%)`}
                  valueStyle={{ color: changeColor }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Day High"
                  value={quote.dayHigh}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Day Low"
                  value={quote.dayLow}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          {portfolio && (
            <Card title="Your Position" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} lg={6}>
                  <Statistic
                    title="Shares Owned"
                    value={portfolio.shares}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Statistic
                    title="Purchase Price"
                    value={portfolio.purchasePrice}
                    precision={2}
                    prefix="$"
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Statistic
                    title="Current Value"
                    value={quote.price * portfolio.shares}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Statistic
                    title="Total Gain/Loss"
                    value={(quote.price - portfolio.purchasePrice) * portfolio.shares}
                    precision={2}
                    prefix="$"
                    valueStyle={{
                      color: quote.price >= portfolio.purchasePrice ? '#3f8600' : '#cf1322',
                    }}
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Market Data">
            <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} bordered>
              <Descriptions.Item label="Open">${quote.open.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Previous Close">
                ${quote.previousClose.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Volume">
                {quote.volume.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Avg Volume">
                {quote.avgVolume.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="52 Week High">
                ${quote.yearHigh.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="52 Week Low">
                ${quote.yearLow.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Market Cap">
                ${(quote.marketCap / 1e9).toFixed(2)}B
              </Descriptions.Item>
              <Descriptions.Item label="P/E Ratio">
                {quote.pe ? quote.pe.toFixed(2) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="EPS">
                {quote.eps ? `$${quote.eps.toFixed(2)}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="50-Day Avg">
                ${quote.priceAvg50.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="200-Day Avg">
                ${quote.priceAvg200.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Shares Outstanding">
                {(quote.sharesOutstanding / 1e9).toFixed(2)}B
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      ) : null}
    </div>
  );
});

export default StockDetailPage;
