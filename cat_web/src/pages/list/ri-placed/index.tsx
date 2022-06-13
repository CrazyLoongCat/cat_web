import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Form, Grid, Input, Modal, Space} from '@arco-design/web-react';
import PopularContents from '../ri-wishs/popular-contents';
import styles from '../ri-wishs/style/index.module.less';
import '../ri-wishs/mock';
import axios from "axios";
const FormItem = Form.Item;
const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
    const [orders, setOrders] = useState({});
    const [ token,setToken ] = useState("");
    const [ firstToken,setFirstToken ] = useState("");
    const [visible, setVisible] = React.useState(false);
    const [loginPhone, setLoginPhone] = React.useState("");

    useEffect(() => {
        getToken();
    }, []);

    function exchange() {
        console.log("获取时候的"+loginPhone)
        getToken();
        setVisible(false);
    }

    function getToken() {
        axios.post('/ri/getToken', {
            phone:loginPhone,
            firstToken:firstToken,
        }).then((res) => {
            setToken(res.data.data)
        });
    }


    function selectOrder(orders) {
        setOrders(orders);
    }
    return (
        <div className={styles.container}>
            <div className={styles['button-group']}>
                <Card title='当前订单用户' bordered={false} style={{ width: '10%' }}>
                    {loginPhone}
                </Card>
                <div className={styles['button-group']}>
                    <Space>
                        {/*<Button type="primary"  onClick={exportExcel}>
                        {t['searchTable.operations.export']}
                    </Button>*/}
                        <Button type="primary"  onClick={() => setVisible(true)}>
                            切换账号
                        </Button>
                    </Space>
                </div>
            </div>

            <div className={styles.left}>
                <Row style={{ marginTop: gutter }}>
                    <Col flex={1} className={styles.panel} style={{ marginRight: gutter }} >
                        <PopularContents token={token} phone ={loginPhone} width={500} onSelect={selectOrder}/>
                    </Col>
                </Row>
            </div>
            <Modal
                title='切换账号'
                visible={visible}
                onOk={exchange}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
            >
                <Form layout='horizontal' >
                    <FormItem label='账号' style={{ width: 500 }} field='phone' rules={[{required: true,message: "账号必输"}]}
                              normalize={(value) => {
                                  setLoginPhone(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='请输入账号...' />
                    </FormItem>
                    <FormItem label='认证码' style={{ width: 500 }} field='firstToken'
                              normalize={(value) => {
                                  setFirstToken(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='请输入认证码...' />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
}

export default Workplace;
