import React from 'react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
export const Status = ['待确认','有效', '无效'];

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
      title: '订单号',
      dataIndex: 'order_sn',
    },
    {
      title: '下单时间',
      dataIndex: 'create_time',
    },
    {
      title: '买家',
      dataIndex: 'name',
    },
    {
      title: '实付金额',
      dataIndex: 'realPayMoneyB',
    },
    {
      title: '商品佣金',
      dataIndex: 'commissionAmountB',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
    },
  ];
}

export default () => ContentIcon;
