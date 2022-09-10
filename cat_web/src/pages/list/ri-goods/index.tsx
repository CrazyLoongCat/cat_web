import React, { useEffect, useState } from 'react';
import axiosHttp  from '../../common/http'
import {Tabs, Card, Input, Typography, Grid,Modal, Form} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import CardBlock from './card-block';
import { GoodsDescription } from './interface';
import './mock';


const { Title } = Typography;
const { Row, Col } = Grid;

const defaultList = new Array(10).fill({});
export default function ListCard() {
  const t = useLocale(locale);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState({
    sell_hot: defaultList,
    skincare: defaultList,
    perfume: defaultList,
    colours: defaultList,
  });

  const [activeKey, setActiveKey] = useState('all');

  const getData = () => {
    axiosHttp.post('/rihainan/findAllGoodsList',{
        pageSize:10,
        pageNum: 1,
    }).then((res) => {
      console.log(res.data.data)
      setData(res.data.data);
    }).finally(() => setLoading(false));
  };

  const search = (values) => {
    if (values != null) {
      axiosHttp.post('/rihainan/findGoodsList',{
        keyword:values,
        pageSize:100,
      }).then((res) => {
        setData(res.data.data);
      }).finally(() => setLoading(false));
    } else {
      getData();
    }

  };


  useEffect(() => {
    getData();
  }, []);

  const getCardList = (
    list: Array<GoodsDescription>,
    type: keyof typeof data
  ) => {
    return (
      <Row gutter={24} className={styles['card-content']}>
        {list.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
            <CardBlock card={item} type={type} loading={loading} formVisible={visible} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={styles.container}>
      <Card
        title={t['menu.list.card']}
        headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
      >
        <Tabs
          activeTab={activeKey}
          type="rounded"
          onChange={setActiveKey}
          extra={
            <Input.Search
              style={{ width: '240px' }}
              placeholder={t[`cardList.tab.all.placeholder`]}
              searchButton
              onSearch={search}
            />
          }
        >
          <Tabs.TabPane key="all" title={t['cardList.tab.title.all']} />
          <Tabs.TabPane key="sell_hot" title={t['cardList.tab.title.sell_hot']} />
          <Tabs.TabPane key="skincare" title={t['cardList.tab.title.skincare']} />
          <Tabs.TabPane key="perfume" title={t['cardList.tab.title.perfume']} />
          <Tabs.TabPane key="colours" title={t['cardList.tab.title.colours']} />
        </Tabs>

        {activeKey === 'all' ? (
          Object.entries(data).map(([key, list]) => (
            <div key={key}>
              <Title heading={6}>{t[`cardList.tab.title.${key}`]}</Title>
              {getCardList(list, key as keyof typeof data)}
            </div>
          ))
        ) : (
          <div className={styles['single-content']}>
            {getCardList(data[activeKey], activeKey as keyof typeof data)}
          </div>
        )}
      </Card>
    </div>
  );
}
