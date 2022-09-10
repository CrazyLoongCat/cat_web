import React from 'react';
import {Button, Modal, Typography} from '@arco-design/web-react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
import axiosHttp  from '../../common/http'
const { Text } = Typography;

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  function mydelete(record) {
    axiosHttp.delete('/riOrderPhone/delete', {
      params: {	// 请求参数放在请求体
        id: record.id
      }
    }).then((res) => {
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
  }

  return [
    {
      title: t['searchTable.columns.orderCode'],
      dataIndex: 'orderCode',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.orderUser'],
      dataIndex: 'orderUser',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.addressName'],
      dataIndex: 'addressName',
    },
    {
      title: t['searchTable.columns.addressPhone'],
      dataIndex: 'addressPhone',
    },
    {
      title: t['searchTable.columns.address'],
      dataIndex: 'address',
    },
    {
      title: t['searchTable.columns.goodsName'],
      dataIndex: 'goodsName',
    },
    {
      title: t['searchTable.columns.goodsNum'],
      dataIndex: 'goodsNum',
    },
    {
      title: t['searchTable.columns.goodsPrice'],
      dataIndex: 'goodsPrice',
    },
    {
      title: t['searchTable.columns.goodsOprice'],
      dataIndex: 'goodsOprice',
    },
    {
      title: t['searchTable.columns.inputDate'],
      dataIndex: 'inputDate',
    },
    {
      title: t['searchTable.columns.inputTime'],
      dataIndex: 'inputTime',
    },
  ];
}

export default () => ContentIcon;
