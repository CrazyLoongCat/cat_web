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
      title: t['searchTable.columns.userId'],
      dataIndex: 'userId',
    },
    {
      title: t['searchTable.columns.userName'],
      dataIndex: 'userName',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.userPhone'],
      dataIndex: 'userPhone',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: t['searchTable.columns.lastLoginTime'],
      dataIndex: 'lastLoginTime',
    },
    {
      title: t['searchTable.columns.inputTime'],
      dataIndex: 'inputTime',
    },
    {
      title: t['searchTable.columns.updateTime'],
      dataIndex: 'updateTime',
    },
  ];
}

export default () => ContentIcon;
