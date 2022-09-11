import React from 'react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';

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
      title: t['searchTable.columns.mainOrderId'],
      dataIndex: 'mainOrderId',
    },
    {
      title: t['searchTable.columns.time'],
      dataIndex: 'time',
    },
    {
      title: t['searchTable.columns.statusName'],
      dataIndex: 'statusName',
    },
    {
      title: t['searchTable.columns.paidAmount'],
      dataIndex: 'paidAmount',
    },
    {
      title: t['searchTable.columns.goodsName'],
      dataIndex: 'goodsName',
    },
  ];
}

export default () => ContentIcon;
