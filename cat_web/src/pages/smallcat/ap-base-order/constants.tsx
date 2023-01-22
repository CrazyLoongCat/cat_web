import React from 'react';
import {Button, Modal, Typography} from '@arco-design/web-react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
import axiosHttp  from '../../common/http'
const { Text } = Typography;
export const IsNewType = ['新用户', '旧用户'];

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {

  return [
    {
      title: t['searchTable.columns.orderId'],
      dataIndex: 'orderId',
    },
    {
      title: t['searchTable.columns.placedTime'],
      dataIndex: 'placedTime',
    },
    {
      title: t['searchTable.columns.signTime'],
      dataIndex: 'signTime',
    },
    {
      title: t['searchTable.columns.rejectTime'],
      dataIndex: 'rejectTime',
    },
    {
      title: t['searchTable.columns.goodsName'],
      dataIndex: 'goodsName',
    },
    {
      title: t['searchTable.columns.buySum'],
      dataIndex: 'buySum',
    },
    {
      title: t['searchTable.columns.actualPaySum'],
      dataIndex: 'actualPaySum',
    },
    {
      title: t['searchTable.columns.commissionRate'],
      dataIndex: 'commissionRate',
    },
    {
      title: t['searchTable.columns.returnAmt'],
      dataIndex: 'returnAmt',
    },
    {
      title: t['searchTable.columns.returnStatus'],
      dataIndex: 'returnStatus',
    },
  ];
}

export default () => ContentIcon;
