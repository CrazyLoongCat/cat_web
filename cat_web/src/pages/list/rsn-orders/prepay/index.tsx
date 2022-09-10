import React, { useEffect, useState } from 'react';
import {Tabs, Card, Input, Typography, Grid,Modal, Form} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';
import SearchRSNTable from '../search-table';

export default function ListCard() {
  const t = useLocale(locale);




  return (
    <div className={styles.container}>
      <Card
        title={t['menu.list.card']}
        headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
      >
          <div className={styles['single-content']}>
            <SearchRSNTable type={"prepay"} />
          </div>

      </Card>
    </div>
  );
}
