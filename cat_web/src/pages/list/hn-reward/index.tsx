import React from 'react';
import { Card, Input, Modal, Form, Space, Button} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import SearchTable from './day-table';
import './mock';


export default function ListCard() {
  const t = useLocale(locale);

    return (
        <div className={styles.container}>
            <Card
                title={t['menu.list.card']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
            >
                <div className={styles['single-content']}>
                    <SearchTable />
                </div>

            </Card>
        </div>
    );
}
