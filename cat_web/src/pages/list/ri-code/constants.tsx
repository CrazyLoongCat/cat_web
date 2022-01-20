import React from 'react';
import {Button, Typography, Modal} from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import styles from './style/index.module.less';
import axios from "axios";

const { Text } = Typography;

export const IsInuseType = ['是', '否'];
export const IsUsedType = ['未使用', '已使用'];

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
    axios.delete('/riOrderConvolutionCode/delete', {
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
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.code'],
      dataIndex: 'code',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.isInuse'],
      dataIndex: 'isInuse',
      render: (value) => (
        <div className={styles['content-type']}>
          {IsInuseType[value]}
        </div>
      ),
    },
    {
      title: t['searchTable.columns.isUsed'],
      dataIndex: 'isUsed',
      render: (value) => IsUsedType[value],
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
          {t['searchTable.columns.operations.delete']}
        </Button>
      ),
    },
  ];
}

export default () => ContentIcon;
