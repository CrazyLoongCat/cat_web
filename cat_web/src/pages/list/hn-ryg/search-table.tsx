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
    const [loginPhone, setLoginPhone] = React.useState("18333187054");
    const [loginCode, setLoginCode] = React.useState("");
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 1000,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });
    const [loading, setLoading] = useState(true);
    const [formParams, setFormParams] = useState({type:'',name:''});

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

    function fetchData() {
        const { current, pageSize } = pagination;
        setLoading(true);
        axiosHttp.post('/ryg/getStaffOrders',{
            pageSize:1000,
            pageNum: current,
            type: formParams.type ? formParams.type : 1,
            name: formParams.name ? formParams.name : '',
            phone:loginPhone,
            code:loginCode,
        }).then((res) => {
            console.log(res.data.data)
            if (res.data.data) {
                setData(res.data.data);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: 100000,
                });
            }

        }).finally(() => setLoading(false));
    }

    function sendCode() {
        axiosHttp.post('/ryg/sendCode',{
            phone:loginPhone,
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
                        '下单账号':loginPhone,
                        '订单编号': data[i].orderNo,
                        '下单时间': data[i].createTime,
                        '订单状态': data[i].status==1?'有效':'无效',
                        '实付金额': data[i].payAmount1,
                        '订单子编号': data[i].orderDetailNo,
                        '商品ID': data[i].goodsId,
                        '商品名称': data[i].name,
                        '数量': data[i].quantity,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '如意购_'+loginPhone, datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['下单账号','订单编号','下单时间','订单状态','实付金额','订单子编号','商品ID','商品名称','数量'],
                    sheetHeader:['下单账号','订单编号','下单时间','订单状态','实付金额','订单子编号','商品ID','商品名称','数量'],
                    columnWidths: [8,10,10,5,5,10,5,15,5],
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
                    rowKey="mainOrderId"
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
                    <FormItem label='验证码' style={{ width: 500 }} field='loginCode' rules={[{required: true,message: "验证码必输"}]}
                              normalize={(value) => {
                                  setLoginCode(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='验证码...' />
                    </FormItem>
                    <Button style={{ width: 100 }} type='primary' onClick = {sendCode}>发送验证码</Button>

                </Form>
            </Modal>
        </div>
    );
}

export default SearchTable;
