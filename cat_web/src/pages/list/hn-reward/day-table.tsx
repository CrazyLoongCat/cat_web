import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Card,Modal,
    PaginationProps, Space, Button, Form, Input,
} from '@arco-design/web-react';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import './mock';
import { getColumns } from './constants';
import { searchParam} from './interface';
import styles from "@/pages/list/hn-reward/style/index.module.less";
import ExportJsonExcel from 'js-export-excel';
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址
const FormItem = Form.Item;

function DayTable(props: searchParam) {
    const t = useLocale(locale);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [data, setData] = useState([]);
    const [loginPhone, setLoginPhone] = React.useState("18389872904");
    const [selectedRows, setSelectedRows] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 100,
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
        axios.post('/rihainan/getRewardDay',{
            pageSize:100,
            pageNum: current,
            phone:loginPhone,
        }).then((res) => {
            setData(res.data.data.list);
            setPatination({
                ...pagination,
                current,
                pageSize,
                total: res.data.data.total,
            });
        }).finally(() => setLoading(false));
    }

    function exchange() {
        console.log("获取时候的"+loginPhone)
        setLoginPhone(loginPhone);
        fetchData();
        setVisible(false);
    }

    const exportExcel = () => {
        axios.post('/rihainan/exportRewardOrder',{
            phone:loginPhone,
            mainOrderIds:selectedRows,
        }).then((res) => {
            const dataTable = [];
            const allTable = [];
            if (res.data.data) {
                for (const i in res.data.data) {
                    if(res.data.data[i].list){
                        const sheetTable = [];
                        for (const j in res.data.data[i].list) {
                            const obj = {
                                'ID': res.data.data[i].list[j].id,
                                '订单ID': res.data.data[i].list[j].orderId,
                                '时间': res.data.data[i].list[j].time,
                                '支付金额': res.data.data[i].list[j].payAmount,
                                '预计奖励金额': res.data.data[i].list[j].giveAmount,
                                '订单状态': res.data.data[i].list[j].typeName,
                            }
                            sheetTable.push(obj);
                            allTable.push(obj);
                        }
                        dataTable.push(sheetTable);
                    }
                }
            }
            const datas = [];
            const dataAll = {
                sheetData:allTable,
                sheetName:"all",
                sheetFilter:['ID','订单ID','时间','支付金额','预计奖励金额','订单状态'],
                sheetHeader:['ID','订单ID','时间','支付金额','预计奖励金额','订单状态'],
                columnWidths: [10,10,10,5,5,5],
            }
            datas.push(dataAll)
            for (const i in dataTable) {
                const data = {
                    sheetData:dataTable[i],
                    sheetName:res.data.data[i].id,
                    sheetFilter:['ID','订单ID','时间','支付金额','预计奖励金额','订单状态'],
                    sheetHeader:['ID','订单ID','时间','支付金额','预计奖励金额','订单状态'],
                    columnWidths: [10,10,10,5,5,5],
                }
                datas.push(data);
            }
            const option={fileName : '员工订单明细_'+loginPhone, datas };

            const toExcel = new ExportJsonExcel(option);
            toExcel.saveExcel();
        });
    }



    function onChangeTable(pagination) {
        setPatination(pagination);
    }

    return (
        <div>
            <Card headerStyle={{ border: 'none', height: 'auto', paddingTop: '10px' }} >
                <div className={styles['button-group']}>
                    <Card title='当前订单用户' bordered={false} style={{ width: '20%' }}>
                        {loginPhone}
                    </Card>
                    <Space>
                        <Button type="primary"  onClick={() => setVisible(true)}>
                            {t['searchTable.operations.login']}
                        </Button>
                        <Button type="primary"  onClick={exportExcel}>
                            {t['searchTable.operations.export']}
                        </Button>
                    </Space>
                </div>
            </Card>
            <Card
                title={t['menu.list.searchTable']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '5px' }}
            >
                <Table
                    rowKey="id"
                    loading={loading}
                    scroll={{ y: 400 }}
                    onChange={onChangeTable}
                    rowSelection={{
                        type:'checkbox',
                        onSelect: (selected, record, selectedRows) => {
                            console.log(selectedRows);
                            setSelectedRows(selectedRows);
                        },
                    }}
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
            </Form>
        </Modal>
        </div>
    );
}

export default DayTable;
