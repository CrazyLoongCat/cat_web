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
export const StatusType = ['生效', '失效'];
export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  function mydelete(record) {
    axios.delete('/hnMonitor/delete', {
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
    callback;
  }

  return [
    {
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.monitorPhone'],
      dataIndex: 'monitorPhone',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.placedPhone'],
      dataIndex: 'placedPhone',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.placedNum'],
      dataIndex: 'placedNum',
    },
    {
      title: t['searchTable.columns.placedOnceNum'],
      dataIndex: 'placedOnceNum',
    },
    {
      title: t['searchTable.columns.discount'],
      dataIndex: 'discount',
    },
    {
      title: t['searchTable.columns.monitorGoodsId'],
      dataIndex: 'monitorGoodsId',
    },
    {
      title: t['searchTable.columns.monitorGoodsName'],
      dataIndex: 'monitorGoodsName',
    },
    {
      title: t['searchTable.columns.status'],
      dataIndex: 'status',
      render: (value) => StatusType[value],
    },
    {
      title: t['searchTable.columns.inputTime'],
      dataIndex: 'inputTime',
    },
    {
      title: t['searchTable.columns.updateTime'],
      dataIndex: 'updateTime',
    },
    {
      title: t['searchTable.columns.operations'],
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
          <Button
              type="text"
              size="small"
              onClick={() => mydelete(record)}
          >
            删除
          </Button>
      ),
    },
  ];
}

export default () => ContentIcon;
