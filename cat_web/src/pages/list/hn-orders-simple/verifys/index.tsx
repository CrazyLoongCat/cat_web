import React from 'react';
import {Card,} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';
import SearchTableV from '../search-table-v';
import '../mock';

export default function ListCard() {
  const t = useLocale(locale);


  return (
    <div className={styles.container}>
      <Card
        title={t['menu.list.card']}
        headerStyle={{ border: 'none', height: 'auto', paddingTop: '10px' }}
      >
          <div className={styles['single-content']}>
            <SearchTableV type={"0"} />
          </div>

      </Card>
    </div>
  );
}
