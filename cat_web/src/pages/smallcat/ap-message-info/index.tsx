import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps, Space, Button, Form, Input, Select, Modal, DatePicker,
} from '@arco-design/web-react';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from '../locale';
import './mock';
import { getColumns } from './constants';
import styles from "@/pages/list/ri-phone/style/index.module.less";
import {IconPlus} from "@arco-design/web-react/icon";
import {platform,checkStatusEnum} from "@/pages/smallcat/locale";

const FormItem = Form.Item;
const { useForm } = Form;
function SearchTable(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale(locale);
  const tableCallback = async (record, type) => {
    fetchData()
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);
  const [formVisible, setFormVisible] = React.useState(false);
  const [data, setData] = useState([]);
  const [form] = useForm();
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 20,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    axiosHttp.get('/ap/admin/getMessage', {
        params: {
          current,
          size: pageSize,
          ...formParams,
        },
      }).then((res) => {
        setData(res.data.data.records);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.data.data.total,
        });
        setLoading(false);
      });
  }

  async function saveData() {
    try{
      await form.validate()
      axiosHttp.post('/ap/admin/putMessage', form.getFields()).then((res) => {
        setLoading(false);
        if(res.data.data){
          Modal.success({
            title: res.data.msg,
          });
          setFormVisible(false);
        } else {
          Modal.error({
            title: res.data.msg,
          });
        }
      });
      fetchData()
    }catch (e){

    }
  }


  function onChangeTable(pagination) {
    setPatination(pagination);
  }

  function handleSearch(params) {
    setFormParams(params);
  }

  return (
    <div>
      <Card
        title={t['menu.list.searchTable']}
        headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
      >
        <SearchForm onSearch={handleSearch} />
        <div className={styles['button-group']}>
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={() => setFormVisible(true)}>
              新增
            </Button>
          </Space>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          scroll={{ y: 400 }}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Card>
      <Modal
          title='新增'
          visible={formVisible}
          onOk={saveData}
          onCancel={() => setFormVisible(false)}
          autoFocus={false}
          focusLock={true}
      >
        <Form layout='horizontal' form = {form}>
          <FormItem label='提示信息' style={{ width: 600 }} field='tipMessage' rules={[{required: true,message: "提示信息必输"}]}>
            <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                            showWordLimit
                            placeholder='最多只能输入100个汉字'
                            style={{ width: 300, height:60, marginBottom: 24 }}/>
          </FormItem>
          <FormItem label='提示平台' field='tipPlatform' style={{ width: 600 }} rules={[{required: true,message: "提示平台必输"}]}>
            <Select  style={{ width: 270 }}>
              {platform.map((option, index) => (
                  <Select.Option key={option.id}  value={option.id}>
                    {option.value}
                  </Select.Option>
              ))}
            </Select>
          </FormItem>
          <Form.Item label='提示开始日期' field="tipBeginTime" style={{ width: 600 }} rules={[{required: true,message: "提示开始日期必输"}]}>
            <DatePicker style={{ width: 200 }}/>
          </Form.Item>
          <FormItem label='提示结束日期' field='tipEndTime' style={{ width: 600 }} rules={[{required: true,message: "提示开始日期必输"}]}>
            <DatePicker style={{ width: 200 }}/>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default SearchTable;
