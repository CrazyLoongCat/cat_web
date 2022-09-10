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
      title: t['searchTable.columns.userOrderId'],
      dataIndex: 'userOrderId',
    },
    {
      title: t['searchTable.columns.orderTime'],
      dataIndex: 'orderTime',
    },
    {
      title: t['searchTable.columns.statusName'],
      dataIndex: 'statusName',
    },
    {
      title: t['searchTable.columns.price'],
      dataIndex: 'price',
    },
    {
      title: t['searchTable.columns.userName'],
      dataIndex: 'userName',
    },
    {
      title: t['searchTable.columns.address'],
      dataIndex: 'address',
    },
    {
      title: t['searchTable.columns.mobile'],
      dataIndex: 'mobile',
    },
    {
      title: t['searchTable.columns.goodsNames'],
      dataIndex: 'goodsNames',
    },
    {
      title: t['searchTable.columns.quantitys'],
      dataIndex: 'quantitys',
    },
    {
      title: t['searchTable.columns.merchantNum'],
      dataIndex: 'merchantNum',
    },
  ];
}

export default () => ContentIcon;
