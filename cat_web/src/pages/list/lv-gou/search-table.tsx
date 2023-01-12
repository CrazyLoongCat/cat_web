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
import { getColumns } from './constants';
import SearchForm from "./form";
const FormItem = Form.Item;

export const Status = ['已上线', '未上线'];

function SearchTable() {
    const t = useLocale(locale);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const [visible, setVisible] = React.useState(false);
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [loginPhone, setLoginPhone] = React.useState("");
    const [token, setToken] = React.useState("");
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 20,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });
    const [loading, setLoading] = useState(true);
    const [formParams, setFormParams] = useState({type:'',name:''});

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

    function fetchData() {
        if (loginPhone == '') {
            setLoading(false)
            return
        }
        const { current, pageSize } = pagination;
        setLoading(true);
        axiosHttp.post('/lvGou/getOrders',{
            page: current,
            phone:loginPhone,
        }).then((res) => {
            console.log(res.data)
            if (res.data.data.list) {
                setData(res.data.data.list);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: res.data.data.summary.count,
                });
            }
        }).finally(() => setLoading(false));
    }

    function saveToken() {
        axiosHttp.post('/ryg/saveToken',{
            phone:loginPhone,
            token:token
        }).then((res) => {
            if(res.data.data.code === 0){
                Modal.success({
                    title: res.data.data.msg,
                });
            } else {
                Modal.error({
                    title: res.data.data.msg,
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
    function handleSearch(params) {
        setFormParams(params);
    }

    const exportExcel = () => {
        const dataTable = [];
        if (data) {
            for (const i in data) {
                if(data){
                    const obj = {
                        '订单号': data[i].order_sn,
                        '下单时间': data[i].create_time,
                        '买家': data[i].name,
                        '实付金额': data[i].realPayMoneyB,
                        '商品佣金': data[i].commissionAmountB,
                        '状态': data[i].status_name,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '海旅_'+loginPhone, datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['订单号','下单时间','买家','实付金额','商品佣金','状态'],
                    sheetHeader:['订单号','下单时间','买家','实付金额','商品佣金','状态'],
                    columnWidths: [10,10,5,5,5,5],
                }
            ]};

        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }

    return (
        <div>
            <Card
                title={t['menu.list.searchTable']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
            >
                <SearchForm onSearch={handleSearch} />
                <div className={styles['button-group']}>
                    <Card title='当前订单用户' bordered={false} style={{ width: '20%' }}>
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
                    rowKey="order_sn"
                    loading={loading}
                    scroll={{ y: 500 }}
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
                    <FormItem label='token' style={{ width: 500 }} field='token'
                              normalize={(value) => {
                                  setToken(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='密钥...' />
                    </FormItem>
                    <Button style={{ width: 100 }} type='primary' onClick = {saveToken}>设置token</Button>

                </Form>
            </Modal>
        </div>
    );
}

export default SearchTable;
