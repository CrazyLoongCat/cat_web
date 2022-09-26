import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Card,
    Input,
    PaginationProps,
    Button,
    Modal,
    Space, Form,
} from '@arco-design/web-react';
import ExportJsonExcel from 'js-export-excel';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import wechatImg from '../../common/image/wechat_huahua.jpg'
import { getColumns } from './constants';
import { searchParam} from './interface';
import { Image } from '@arco-design/web-react';
const FormItem = Form.Item;


function SearchTable(props: searchParam) {
    const t = useLocale(locale);
    const [selectedRows, setSelectedRows] = useState([]);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const [visible, setVisible] = React.useState(false);
    const [adVisible, setAdVisible] = React.useState(true);
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [loginPhone, setLoginPhone] = React.useState("");
    const [loginCode, setLoginCode] = React.useState("");
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 500,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });
    const [loading, setLoading] = useState(true);
    const [formParams, setFormParams] = useState({});

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

    function fetchData() {
        const { current, pageSize } = pagination;
        setLoading(true);
        axiosHttp.post('/rihainan/findOrderSimpleList',{
            pageSize:500,
            pageNum: current,
            type: props.type,
            phone:loginPhone,
            code:loginCode,
        }).then((res) => {
            console.log(res.data.data)
            if (res.data.data) {
                setData(res.data.data.list);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: res.data.data.total,
                });
            }

        }).finally(() => setLoading(false));
    }

    function sendCode() {
        axiosHttp.post('/rihainan/getPhoneCode',{
            phone:loginPhone,
        }).then((res) => {
            if(res.data.code === 0){
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

    function exchange() {
        fetchData();
        setVisible(false);
    }

    function onChangeTable(pagination) {
        setPatination(pagination);
    }

    const exportExcel = () => {
        const dataTable = [];
        if (data) {
            for (const i in data) {
                if(data){
                    const obj = {
                        '下单账号':loginPhone,
                        '订单ID': data[i].mainOrderId,
                        '下单时间': data[i].time,
                        '订单状态': data[i].statusName,
                        '实付金额': data[i].paidAmount,
                        '商品名称': data[i].goodsName,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '海南订单_'+loginPhone, datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['下单账号','订单ID','下单时间','订单状态','实付金额','商品名称'],
                    sheetHeader:['下单账号','订单ID','下单时间','订单状态','实付金额','商品名称'],
                    columnWidths: [10,10,5,5,5,15],
                }
            ]};

        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }

    return (
        <div>
            <Card
                title={t['menu.list.searchTable']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '10px' }}
            >
                <div className={styles['button-group']}>
                    <Card title='当前订单用户' bordered={false} style={{ width: '10%' ,paddingTop: '5px'}}>
                        {loginPhone}
                    </Card>
                </div>
                <div className={styles['button-group']}>
                    <Space>
                        <Button type="primary"  onClick={exportExcel}>
                            {t['searchTable.operations.export']}
                        </Button>
                        <Button type="primary"  onClick={() => setVisible(true)}>
                            {t['searchTable.operations.login']}
                        </Button>
                    </Space>
                </div>
                <Table
                    rowKey="mainOrderId"
                    loading={loading}
                    scroll={{ y: 400 }}
                    onChange={onChangeTable}
                    pagination={pagination}
                    columns={columns}
                    data={data}
                />
            </Card>
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
                    <FormItem label='验证码' style={{ width: 500 }} field='loginCode' rules={[{required: true,message: "验证码必输"}]}
                              normalize={(value) => {
                                  setLoginCode(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='验证码...' />
                    </FormItem>
                    <Button style={{ width: 100 }} type='primary' onClick = {sendCode}>发送验证码</Button>

                </Form>
            </Modal>
            <Modal
                visible={adVisible}
                footer={null}
                onCancel={() => {
                    setAdVisible(false);
                }}
                style={{ width: 600 }}
            >
                <Space >
                    <Image width={200} src={wechatImg} alt='lamp' />
                    <Card style={{ width: 350,fontSize:20,fontWeight:900 }} >
                        cdf会员购海南返点1.1%<br />
                        cdf会员购广州返点3%<br />
                        cdf会员购返点3%(老号也可更换邀请码)<br />
                        微信：Zora7054<br />
                        也可以提供其他技术支持<br />
                        欢迎各位代购同行进群交流沟通<br />
                    </Card>
                </Space>

            </Modal>
        </div>
    );
}

export default SearchTable;
