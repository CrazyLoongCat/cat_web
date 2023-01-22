import React, { useContext } from 'react';
import {
  Form,
  Input,
  Button,
  Grid, Select, DatePicker,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import locale from '../locale';
import useLocale from '@/utils/useLocale';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const t = useLocale(locale);
  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  const colSpan = lang === 'zh-CN' ? 8 : 12;

  return (
      <div className={styles['search-form-wrapper']}>
        <Form
            form={form}
            className={styles['search-form']}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 30 }}
        >
          <Row gutter={24}>
            <Col span={colSpan}>
              <Form.Item label='用户编号' field="userId">
                <Input placeholder={t['searchForm.userName.placeholder']} allowClear />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item label='订单平台' field="platform">
                <Select  >
                  <Select.Option value="0">所有</Select.Option>
                  <Select.Option value="1">cdf会员购海南</Select.Option>
                  <Select.Option value="2">cdf会员购</Select.Option>
                  <Select.Option value="3">cdf会员购广州</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item label='下单日期' field="placedTime">
                <DatePicker style={{ width: 200 }}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles['right-button']}>
          <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
            {t['searchTable.form.search']}
          </Button>
          <Button icon={<IconRefresh />} onClick={handleReset}>
            {t['searchTable.form.reset']}
          </Button>
        </div>
      </div>
  );
}

export default SearchForm;
