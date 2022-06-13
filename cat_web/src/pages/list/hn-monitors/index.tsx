import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps, Space, Button, Form, Input, Modal,
} from '@arco-design/web-react';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import './mock';
import { getColumns } from './constants';
import styles from "@/pages/list/ri-phone/style/index.module.less";
import {IconPlus} from "@arco-design/web-react/icon";
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址
const FormItem = Form.Item;
import SearchTable from "@/pages/list/ri-phone";

function SearchMonitor(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale(locale);
  const [visible, setVisible] = React.useState(false);
  const [visiblePhone, setVisiblePhone] = React.useState(false);
  const [clickKey, setClickKey] = React.useState("");
  const [phoneForm] = Form.useForm();
  const tableCallback = async (record, type) => {
    fetchData();
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
    axios.get('/hnMonitor/selectAll', {
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
  function saveData() {
    setLoading(true);
    axios.post('/hnMonitor/updateAll', phoneForm.getFields()).then((res) => {
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
  function selectPhone(phoneList) {
    if (phoneList != null && phoneList[0] != null) {
      phoneForm.setFieldsValue({ [clickKey]: phoneList[0].phone, });
    }
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
              修改账号
            </Button>
          </Space>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          scroll={{ y: 400 }}
          rowSelection={{
            type:'checkbox',
            onSelect: (selected, record, selectedRows) => {
              props.onSelect(selectedRows);
            },
          }}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Card>
      <Modal
          title='修改'
          visible={visible}
          onOk={saveData}
          onCancel={() => setVisible(false)}
          autoFocus={false}
          focusLock={true}
      >
        <Form form={phoneForm} >
          <FormItem label='监控用户' style={{ width: 500 }} field='monitorPhone' >
            <Input onClick={() => {
              setVisiblePhone(true);
              setClickKey("monitorPhone");
            }} style={{ width: 270 }}  />
          </FormItem>
          <FormItem label='下单用户' field='placedPhone' style={{ width: 500 }} >
            <Input onClick={() => {
              setVisiblePhone(true);
              setClickKey("placedPhone");
            }} style={{ width: 270 }} />
          </FormItem>
        </Form>
      </Modal>
      <Modal
          title='用户'
          visible={visiblePhone}
          onOk={()=>{setVisiblePhone(false);}}
          onCancel={() => setVisiblePhone(false)}
          autoFocus={false}
          focusLock={true}
          style={{ top: 20,width:1200,height:800 }}
      >
        <SearchTable onSelect={selectPhone}/>
      </Modal>
    </div>
  );
}

export default SearchMonitor;
