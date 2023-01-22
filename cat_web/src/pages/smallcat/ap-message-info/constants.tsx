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
  function mydelete(record) {
    axiosHttp.post('/ap/admin/delete/msg', {
        id: record.id
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
    callback(record,'');
  }

  return [
    {
      title: '操作',
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
    {
      title: t['searchTable.columns.id'],
      dataIndex: 'id',
    },
    {
      title: t['searchTable.columns.tipMessage'],
      dataIndex: 'tipMessage',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.tipPlatform'],
      dataIndex: 'tipPlatform',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.tipBeginTime'],
      dataIndex: 'tipBeginTime',
    },
    {
      title: t['searchTable.columns.tipEndTime'],
      dataIndex: 'tipEndTime',
    },
  ];
}

export default () => ContentIcon;
