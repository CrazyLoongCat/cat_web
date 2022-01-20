import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  PaginationProps,
  Button,
  Modal,
  Space, Form,
} from '@arco-design/web-react';
import {  IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';

const FormItem = Form.Item;

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址

export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchAddress(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale(locale);
  const [visible, setVisible] = React.useState(false);
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
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
    axios.get('/riOrderAddress/selectAll', {
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
  const addressForm = {
    userName:'',
    userPhone:'',
    address:'',
    remark:'',
  }
  function saveData() {
    setLoading(true);
    axios.post('/riOrderAddress/insert', {
      userName:addressForm.userName,
      userPhone:addressForm.userPhone,
      address:addressForm.address,
      remark:addressForm.remark,
    }).then((res) => {
      setLoading(false);
      if(res.data.data){
        Modal.success({
          title: res.data.msg,
        });
      } else {
        Modal.error({
          title: res.data.msg,
        });
      }
      setVisible(false);
      fetchData();
    });
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
              <Button type="primary" icon={<IconPlus />} onClick={() => setVisible(true)}>
                {t['searchTable.operations.add']}
              </Button>
            </Space>
          </div>
          <Table
              rowKey="id"
              loading={loading}
              scroll={{ y: 400 }}
              rowSelection={{
                type:'radio',
                onSelect: (selected, record, selectedRows) => {
                  props.onSelect(record);
                },
                checkboxProps: (record) => {
                  return {
                    disabled: record.id === '4',
                  };
                },
              }}
              onChange={onChangeTable}
              pagination={pagination}
              columns={columns}
              data={data}
          />
        </Card>
        <Modal
            title='新增'
            visible={visible}
            onOk={saveData}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
          <Form layout='horizontal' >
            <FormItem label='姓名' style={{ width: 500 }} field='userName' rules={[{required: true,message: "姓名必输"}]}
                      normalize={(value) => {
                        addressForm.userName = value;return value;}}
            >
              <Input style={{ width: 270 }} allowClear placeholder='请输入姓名...' />
            </FormItem>
            <FormItem label='电话' field='userPhone' style={{ width: 500 }} rules={[{required: true,message: "电话必输"}]}
                      normalize={(value) => {
                        addressForm.userPhone = value;return value;}}
            >
              <Input style={{ width: 270 }} allowClear placeholder='请输入电话...' />
            </FormItem>
            <FormItem label='下单地址' field='address' style={{ width: 500 }} rules={[{required: true,message: "下单地址必输"}]}
                      normalize={(value) => {
                        addressForm.address = value;return value;}}
            >
              <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                              showWordLimit
                              placeholder='最多只能输入100个汉字'
                              wrapperStyle={{ width: 300, marginBottom: 24 }}/>
            </FormItem>
            <FormItem label='备注' field='remark' style={{ width: 500 }}
                      normalize={(value) => {
                        addressForm.remark = value;return value;}}
            >
              <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                              showWordLimit
                              placeholder='最多只能输入100个汉字'
                              wrapperStyle={{ width: 300, marginBottom: 24 }}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
  );
}

export default SearchAddress;
