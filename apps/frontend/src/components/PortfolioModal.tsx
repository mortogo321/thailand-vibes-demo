import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { portfolioStore } from '../stores/PortfolioStore';
import type { Portfolio, CreatePortfolioDto } from '../types';
import dayjs from 'dayjs';

interface PortfolioModalProps {
  visible: boolean;
  portfolio: Portfolio | null;
  onClose: () => void;
}

const PortfolioModal = observer(({ visible, portfolio, onClose }: PortfolioModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!portfolio;

  useEffect(() => {
    if (visible && portfolio) {
      form.setFieldsValue({
        ...portfolio,
        purchaseDate: portfolio.purchaseDate ? dayjs(portfolio.purchaseDate) : undefined,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, portfolio, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CreatePortfolioDto = {
        ...values,
        symbol: values.symbol.toUpperCase(),
        purchaseDate: values.purchaseDate ? values.purchaseDate.toISOString() : undefined,
      };

      if (isEditing) {
        await portfolioStore.updatePortfolio(portfolio._id, data);
        message.success('Stock updated successfully');
      } else {
        await portfolioStore.addPortfolio(data);
        message.success('Stock added to portfolio');
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Edit Stock' : 'Add Stock to Portfolio'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isEditing ? 'Update' : 'Add'}
      cancelText="Cancel"
      width={600}
      confirmLoading={portfolioStore.loading}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Stock Symbol"
          name="symbol"
          rules={[
            { required: true, message: 'Please enter stock symbol' },
            { pattern: /^[A-Za-z]+$/, message: 'Only letters allowed' },
          ]}
        >
          <Input placeholder="e.g., AAPL" style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input placeholder="e.g., Apple Inc." />
        </Form.Item>

        <Form.Item
          label="Number of Shares"
          name="shares"
          rules={[
            { required: true, message: 'Please enter number of shares' },
            { type: 'number', min: 0.01, message: 'Must be greater than 0' },
          ]}
        >
          <InputNumber
            placeholder="0"
            style={{ width: '100%' }}
            min={0.01}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          label="Purchase Price per Share"
          name="purchasePrice"
          rules={[
            { required: true, message: 'Please enter purchase price' },
            { type: 'number', min: 0.01, message: 'Must be greater than 0' },
          ]}
        >
          <InputNumber
            placeholder="0.00"
            style={{ width: '100%' }}
            prefix="$"
            min={0.01}
            precision={2}
          />
        </Form.Item>

        <Form.Item label="Purchase Date" name="purchaseDate">
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} placeholder="Optional notes about this investment" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default PortfolioModal;
