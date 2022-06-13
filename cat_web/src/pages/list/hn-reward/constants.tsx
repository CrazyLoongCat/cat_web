import React from 'react';
import {Typography} from '@arco-design/web-react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
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
  return [
    {
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.time'],
      dataIndex: 'time',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.payAmount'],
      dataIndex: 'payAmount',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.giveAmount'],
      dataIndex: 'giveAmount',
    },
  ];
}
export function getColumns1(
    t: any,
    callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: t['searchTable.columns1.id'],
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns1.time'],
      dataIndex: 'time',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns1.payAmount'],
      dataIndex: 'payAmount',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns1.giveAmount'],
      dataIndex: 'giveAmount',
    },
    {
      title: t['searchTable.columns1.orderId'],
      dataIndex: 'orderId',
    },
    {
      title: t['searchTable.columns1.type'],
      dataIndex: 'type',
    },
  ];
}



export default () => ContentIcon;
