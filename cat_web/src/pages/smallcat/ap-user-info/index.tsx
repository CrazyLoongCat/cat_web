import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  PaginationProps,
  Button,
  Modal,
  Space, Form, Select,
} from '@arco-design/web-react';
import {  IconPlus } from '@arco-design/web-react/icon';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';

const FormItem = Form.Item;

export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale(locale);
  const [visible, setVisible] = React.useState(false);
  const [visibleBatch, setVisibleBatch] = React.useState(false);
  const [visibleLimit, setVisibleLimit] = React.useState(false);
  const [limitNum, setLimitNum] = React.useState(null);
  const [newViewFlag, setNewViewFlag] = React.useState(false);
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
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
    axiosHttp.get('/riOrderPhone/selectAll', {
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
  const phoneForm = {
    phone:'',
    password:'',
    type:'',
    remark:'',
  }
  function saveData() {
    setLoading(true);
    axiosHttp.post('/riOrderPhone/insert', phoneForm).then((res) => {
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

  function saveDataBatch() {
    setLoading(true);
    axiosHttp.post('/riOrderPhone/insertBatch', phoneForm).then((res) => {
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
    });
    setVisibleBatch(false);
    fetchData();
  }
  function drawCoupon() {
    Modal.confirm({
      title:"是否确认领取中免日上优惠券？",
      onOk:() => {
        setLoading(true);
        axiosHttp.post('/rsnew/drawCoupon', {

        }).finally(() => setLoading(false));
      }
    });
  }

  function drawCouponNew() {
    Modal.confirm({
      title:"是否确认领取中免日上新用户优惠券？",
      onOk:() => {
        setLoading(true);
        axiosHttp.post('/rsnew/drawCoupon', {
          limitNum:limitNum,
          newFlag:newViewFlag,
        }).finally(() => setLoading(false));
      }
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
            <Button type="primary" icon={<IconPlus />} onClick={() => setVisibleBatch(true)}>
              批量新建
            </Button>
            <Button type="primary"  onClick={drawCoupon}>
              领取优惠券
            </Button>
            <Button type="primary"  onClick={() => {setVisibleLimit(true);setNewViewFlag(true)}}>
              新用户领取优惠券
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
          <FormItem label='用户手机号' style={{ width: 500 }} field='phone' rules={[{required: true,message: "手机号必输"}]}
              normalize={(value) => {
                phoneForm.phone = value;return value;}}
          >
            <Input style={{ width: 270 }} allowClear placeholder='请输入手机号...' />
          </FormItem>
          <FormItem label='用户密码' field='passd' style={{ width: 500 }} rules={[{required: true,message: "密码必输"}]}
              normalize={(value) => {
                phoneForm.password = value;return value;}}
          >
            <Input style={{ width: 270 }} allowClear placeholder='请输入密码...' />
          </FormItem>
          <Form.Item label='账号类型' field="type" style={{ width: 500 }} rules={[{required: true,message: "账号类型必输"}]}
                     normalize={(value) => {
                       phoneForm.type = value;return value;}}
          >
            <Select  style={{ width: 270 }}>
              <Select.Option value="RSN">中免日上</Select.Option>
              <Select.Option value="HN">中免海南</Select.Option>
              <Select.Option value="RSN,HN">中免日上,中免海南</Select.Option>
            </Select>
          </Form.Item>
          <FormItem label='备注' field='remark' style={{ width: 500 }}
                    normalize={(value) => {
                      phoneForm.remark = value;return value;}}
          >
            <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                            showWordLimit
                            placeholder='最多只能输入100个汉字'
                            wrapperStyle={{ width: 300, marginBottom: 24 }}/>
          </FormItem>
        </Form>
      </Modal>
      <Modal
          title='批量新增'
          visible={visibleBatch}
          onOk={saveDataBatch}
          onCancel={() => setVisibleBatch(false)}
          autoFocus={false}
          focusLock={true}
      >
        <Form layout='horizontal' >
          <FormItem label='用户手机号' style={{ width: 500 }} field='phone' rules={[{required: true,message: "手机号必输"}]}
                    normalize={(value) => {
                      phoneForm.phone = value;return value;}}
          >
            <Input.TextArea maxLength={{ length: 10000, errorOnly: true }}
                            showWordLimit
                            placeholder='最多只能输入10000个汉字'
                            style={{ width: 300, height:300, marginBottom: 24 }}/>
          </FormItem>
          <FormItem label='用户密码' field='passd' style={{ width: 500 }} rules={[{required: true,message: "密码必输"}]}
                    normalize={(value) => {
                      phoneForm.password = value;return value;}}
          >
            <Input style={{ width: 270 }} allowClear placeholder='请输入密码...' />
          </FormItem>
          <Form.Item label='账号类型' field="type" style={{ width: 500 }} rules={[{required: true,message: "账号类型必输"}]}
                     normalize={(value) => {
                       phoneForm.type = value;return value;}}
          >
            <Select  style={{ width: 270 }}>
              <Select.Option value="RSN">中免日上</Select.Option>
              <Select.Option value="HN">中免海南</Select.Option>
              <Select.Option value="RSN,HN">中免日上,中免海南</Select.Option>
            </Select>
          </Form.Item>
          <FormItem label='备注' field='remark' style={{ width: 500 }}
                    normalize={(value) => {
                      phoneForm.remark = value;return value;}}
          >
            <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                            showWordLimit
                            placeholder='最多只能输入100个汉字'
                            wrapperStyle={{ width: 300, marginBottom: 24 }}/>
          </FormItem>
        </Form>
      </Modal>
      <Modal
          title='领取优惠券数量限制'
          visible={visibleLimit}
          onOk={()=>{
            if (newViewFlag) {
              drawCouponNew();
            } else {
              drawCoupon()
            }
          }}
          onCancel={() => setVisibleLimit(false)}
          autoFocus={false}
          focusLock={true}
      >
        <Form layout='horizontal' >
          <FormItem label='数量限制' style={{ width: 500 }} field='limitNum' rules={[{required: true,message: "数量限制必输"}]}
                    normalize={(value) => {setLimitNum(value) ;return value}}
          >
            <Input style={{ width: 270 }}  placeholder='请输入数量限制...' />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default SearchTable;
