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
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';
import { searchParam} from './interface';
const FormItem = Form.Item;

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址

export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable(props: searchParam) {
    const t = useLocale(locale);
    const [selectedRows, setSelectedRows] = useState([]);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const [visible, setVisible] = React.useState(false);
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [loginPhone, setLoginPhone] = React.useState("19912122212");
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 1000,
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
        console.log("查询时候的:"+loginPhone)
        setLoading(true);
        axios.post('/rihainan/findOrderList',{
            pageSize:1000,
            pageNum: current,
            type: props.type,
            phone:loginPhone,
        }).then((res) => {
            console.log(res.data.data)
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
        fetchData();
        setVisible(false);
    }

    function onChangeTable(pagination) {
        setPatination(pagination);
    }

    const exportExcel = () => {
        const dataTable = [];
        if (selectedRows) {
            for (const i in selectedRows) {
                if(selectedRows){
                    const obj = {
                        '订单ID': selectedRows[i].mainOrderId,
                        '下单时间': selectedRows[i].time,
                        '完成状态': selectedRows[i].statusName,
                        '实付金额': selectedRows[i].paidAmount,
                        '收件人姓名': selectedRows[i].receiveName,
                        '地址': selectedRows[i].receiveAddress,
                        '手机号': selectedRows[i].receivePhone,
                        '商品名称': selectedRows[i].goodsName,
                        '数量': selectedRows[i].goodsCount,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '海南订单_'+loginPhone, datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['订单ID','下单时间','完成状态','实付金额','收件人姓名','地址','手机号','商品名称','数量'],
                    sheetHeader:['订单ID','下单时间','完成状态','实付金额','收件人姓名','地址','手机号','商品名称','数量'],
                    columnWidths: [10,10,5,5,5,15,6,15,5],
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
                    rowKey="mainOrderId"
                    loading={loading}
                    scroll={{ y: 400 }}
                    rowSelection={{
                        type:'checkbox',
                        onSelectAll: (selected, selectedRows) =>{
                            console.log(selectedRows);
                            setSelectedRows(selectedRows);
                        },
                    }}
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
                </Form>
            </Modal>
        </div>
    );
}

export default SearchTable;
