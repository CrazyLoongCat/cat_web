import React, { useState, useEffect, useCallback } from 'react';
import {Card, Modal, Radio, Table, Typography} from '@arco-design/web-react';
import axios from 'axios';
import useLocale from './locale/useLocale';

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址

function PopularContent(props: {
  token: any,
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale();
  const [type, setType] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total] = useState(0);
  const [token] = useState(0);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios.post('/ri/getwishs', {
          type: type,
          token:  props.token,
      }).then((res) => {
        if (res.data.data != null) {
          setData(res.data.data);
        } else if (res.data.code != 0){
          Modal.error({
            title: res.data.msg,
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  }, [page, type,token]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const columns = [
    {
      title: t['workplace.column.code'],
      dataIndex: 'code',
      width: 150,
    },
    {
      title: t['workplace.column.abname'],
      dataIndex: 'abname',
      render: (x) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis>
          {x}
        </Typography.Paragraph>
      ),
    },
    {
      title: t['workplace.column.abiid'],
      dataIndex: 'abiid',
      render: (x) => (
          <Typography.Paragraph style={{ margin: 0 }} ellipsis>
            {x}
          </Typography.Paragraph>
      ),
    },
    {
      title: t['workplace.column.num'],
      dataIndex: 'num',
      width: 150,
    },
    {
      title: t['workplace.column.price'],
      dataIndex: 'price',
      width: 110,
    },
  ];

  return (
    <Card
      title={t['workplace.popularContents']}
      headerStyle={{ borderBottom: 0 }}
    >
      <Radio.Group
        type="button"
        value={type}
        onChange={setType}
        options={[
          { label: t['workplace.unSubmit'], value: 0 },
          { label: t['workplace.submit'], value: 1 },
          { label: t['workplace.finished'], value: 2 },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Table
        rowKey="code"
        columns={columns}
        virtualized={true}
        scroll={{ y: 400 }}
        data={data}
        loading={loading}
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
        tableLayoutFixed
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        pagination={{ total, current: page, pageSize: 100, simple: true }}
      />
    </Card>
  );
}

export default PopularContent;
