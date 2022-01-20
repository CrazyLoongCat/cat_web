import React, {useContext, useState} from 'react';
import { Grid } from '@arco-design/web-react';
import PopularContents from './popular-contents';
import styles from './style/index.module.less';
import './mock';
import { GlobalToken} from '@/context';

const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  const [orders, setOrders] = useState({});
  const { globalToken } = useContext(GlobalToken);

  function selectOrder(orders) {
    setOrders(orders);
  }
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Row style={{ marginTop: gutter }}>
          <Col
            flex={1}
            className={styles.panel}
            style={{ marginRight: gutter }}
          >
            <PopularContents token={globalToken} onSelect={selectOrder}/>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Workplace;
