import React from 'react';
import {Button, Modal, Typography} from '@arco-design/web-react';
import IconText from '../../common/icons/text.svg';
import IconHorizontalVideo from '../../common/icons/horizontal.svg';
import IconVerticalVideo from '../../common/icons/vertical.svg';
import axios from "axios";
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
    axios.delete('/riOrderPhone/delete', {
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
      title: t['searchTable.columns.receiveName'],
      dataIndex: 'receiveName',
    },
    {
      title: t['searchTable.columns.receiveAddress'],
      dataIndex: 'receiveAddress',
    },
    {
      title: t['searchTable.columns.receivePhone'],
      dataIndex: 'receivePhone',
    },
    {
      title: t['searchTable.columns.goodsName'],
      dataIndex: 'goodsName',
    },
    {
      title: t['searchTable.columns.goodsCount'],
      dataIndex: 'goodsCount',
    },
  ];
}

export default () => ContentIcon;
