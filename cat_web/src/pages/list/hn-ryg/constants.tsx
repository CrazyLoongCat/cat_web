import React from 'react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
export const IsUseful = ['','有效', '无效'];

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
      title: t['searchTable.columns.orderNo'],
      dataIndex: 'orderNo',
    },
    {
      title: t['searchTable.columns.createTime'],
      dataIndex: 'createTime',
    },
    {
      title: t['searchTable.columns.orderDetailNo'],
      dataIndex: 'orderDetailNo',
    },
    {
      title: t['searchTable.columns.status'],
      dataIndex: 'status',
      render: (value) => IsUseful[value],
    },
    {
      title: t['searchTable.columns.goodsId'],
      dataIndex: 'goodsId',
    },
    {
      title: t['searchTable.columns.logo'],
      dataIndex: 'logo',
    },
    {
      title: t['searchTable.columns.name'],
      dataIndex: 'name',
    },
    {
      title: t['searchTable.columns.payAmount'],
      dataIndex: 'payAmount',
    },
    {
      title: t['searchTable.columns.quantity'],
      dataIndex: 'quantity',
    },
  ];
}

export default () => ContentIcon;
