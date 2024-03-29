import React from 'react';
import {Button,} from '@arco-design/web-react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
import {platform,checkStatusEnum} from "@/pages/smallcat/locale";


const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  t: any,
  checkStatus: string,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  function visibleHelper(record) {
    callback(record,'');
  }
  const columns = [
    {
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
    },
    {
      title: t['searchTable.columns.orderId'],
      dataIndex: 'orderId',
    },
    {
      title: t['searchTable.columns.userId'],
      dataIndex: 'userId',
    },
    {
      title: t['searchTable.columns.platform'],
      dataIndex: 'platform',
      render: (value) => platform[value].value
    },
    {
      title: t['searchTable.columns.orderAmt'],
      dataIndex: 'orderAmt',
    },
    {
      title: t['searchTable.columns.placedTime'],
      dataIndex: 'placedTime',
    },
    {
      title: t['searchTable.columns.returnRate'],
      dataIndex: 'returnRate',
    },
    {
      title: t['searchTable.columns.returnAmt'],
      dataIndex: 'returnAmt',
    },
    {
      title: t['searchTable.columns.checkStatus'],
      dataIndex: 'checkStatus',
      render: (value) => checkStatusEnum[value].value
    },
    {
      title: t['searchTable.columns.refuseReason'],
      dataIndex: 'refuseReason',
    },
  ];

  const columns2 = [
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
          <Button
              type="text"
              size="small"
              onClick={() => visibleHelper(record)}
          >
            处理
          </Button>
      ),
    },
    {
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
    },
    {
      title: t['searchTable.columns.orderId'],
      dataIndex: 'orderId',
    },
    {
      title: t['searchTable.columns.userId'],
      dataIndex: 'userId',
    },
    {
      title: t['searchTable.columns.platform'],
      dataIndex: 'platform',
      render: (value) => platform[value].value
    },
    {
      title: t['searchTable.columns.orderAmt'],
      dataIndex: 'orderAmt',
    },
    {
      title: t['searchTable.columns.placedTime'],
      dataIndex: 'placedTime',
    },
    {
      title: t['searchTable.columns.returnRate'],
      dataIndex: 'returnRate',
    },
    {
      title: t['searchTable.columns.returnAmt'],
      dataIndex: 'returnAmt',
    },
    {
      title: t['searchTable.columns.checkStatus'],
      dataIndex: 'checkStatus',
      render: (value) => checkStatusEnum[value].value,
    },
    {
      title: t['searchTable.columns.refuseReason'],
      dataIndex: 'refuseReason',
    },
  ];


    if (checkStatus == "0") {
      return columns2;
    } else {
      return columns;
    }

}

export default () => ContentIcon;
