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
      title: t['workplace.column.code'],
      dataIndex: 'code',
      width: 130,
    },
    {
      title: t['workplace.column.creatdate'],
      dataIndex: 'creatdate',
      width: 130,
    },
    {
      title: t['workplace.column.abname'],
      dataIndex: 'abname',
      width: 150,
    },
    {
      title: t['workplace.column.abiid'],
      dataIndex: 'abiid',
      width: 150,
    },
    {
      title: t['workplace.column.num'],
      dataIndex: 'num',
      width: 100,
    },
    {
      title: t['workplace.column.price'],
      dataIndex: 'price',
      width: 100,
    },
    {
      title: t['workplace.column.contacts'],
      dataIndex: 'contacts',
      width: 100,
    },
    {
      title: t['workplace.column.tel'],
      dataIndex: 'tel',
      width: 150,
    },
    {
      title: t['workplace.column.address'],
      dataIndex: 'address',
      width: 150,
    },
    {
      title: t['workplace.column.statedesc'],
      dataIndex: 'statedesc',
      width: 150,
    },
    {
      title: t['workplace.column.prices'],
      dataIndex: 'prices',
      width: 150,
    },
    {
      title: t['workplace.column.oprices'],
      dataIndex: 'oprices',
      width: 150,
    },
  ];
}

export default () => ContentIcon;
