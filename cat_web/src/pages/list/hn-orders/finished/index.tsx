import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Tabs, Card, Input, Typography, Grid,Modal, Form} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';
import SearchTable from '../search-table';
import '../mock';

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址


export default function ListCard() {
  const t = useLocale(locale);




  return (
    <div className={styles.container}>
      <Card
        title={t['menu.list.card']}
        headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
      >
          <div className={styles['single-content']}>
            <SearchTable type={"4"} />
          </div>

      </Card>
    </div>
  );
}
