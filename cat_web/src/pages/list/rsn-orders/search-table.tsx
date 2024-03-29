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
import { searchParam} from './interface';
const FormItem = Form.Item;

export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchRSNTable(props: searchParam) {
    const t = useLocale(locale);
    const [selectedRows, setSelectedRows] = useState([]);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const [visible, setVisible] = React.useState(false);
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [loginPhone, setLoginPhone] = React.useState("18333187054");
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 1,
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
        if (props.phone != null) {
            setLoginPhone(props.phone);
        }
        setLoading(true);
        axiosHttp.post('/rsnew/getOrderList',{
            pageSize:1,
            page: current,
            status: props.type,
            phone:loginPhone,
        }).then((res) => {
            console.log(res.data.data)
            if (res.data.data) {
                setData(res.data.data.list);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: res.data.data.totalCounts,
                });
            }
        }).finally(() => setLoading(false));
    }

    function exchange() {
        console.log("获取时候的"+loginPhone)
        //codeLogin();
        fetchData();
        setVisible(false);
    }

    function codeLogin() {
        const values = form.getFieldsValue();
        axiosHttp.post('/rsnew/codeLogin', {
            phone:loginPhone,
            messageCode:values.messageCode
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

    function onChangeTable(pagination) {
        setPatination(pagination);
    }

    function sendCode() {
        axiosHttp.post('/rsnew/getPhoneCode',loginPhone).then((res) => {
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

    function setToken() {
        const values = form.getFieldsValue();
        console.log(values)
        axiosHttp.post('/rsnew/setToken', values).then((res) => {
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


    const exportExcel = () => {
        const dataTable = [];
        if (selectedRows) {
            for (const i in selectedRows) {
                if(selectedRows){
                    const obj = {
                        '下单账号':loginPhone,
                        '商户编号': selectedRows[i].merchantNum,
                        '下单时间': selectedRows[i].orderTime,
                        '订单状态': selectedRows[i].statusName,
                        '实付金额': selectedRows[i].price,
                        '收件人姓名': selectedRows[i].userName,
                        '地址': selectedRows[i].address,
                        '手机号': selectedRows[i].mobile,
                        '商品名称': selectedRows[i].goodsNames,
                        '数量': selectedRows[i].quantitys,
                        '订单ID': selectedRows[i].userOrderId,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '中免日上订单_'+loginPhone, datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['下单账号','商户编号','下单时间','订单状态','实付金额','收件人姓名','地址','手机号','商品名称','数量','订单ID'],
                    sheetHeader:['下单账号','商户编号','下单时间','订单状态','实付金额','收件人姓名','地址','手机号','商品名称','数量','订单ID'],
                    columnWidths: [8,10,10,5,5,5,15,6,15,5,5],
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
                    rowKey="userOrderId"
                    loading={loading}
                    scroll={{ y: 400 }}
                    rowSelection={{
                        type:'checkbox',
                        onSelectAll: (selected, selectedRows) =>{
                            console.log(selectedRows);
                            setSelectedRows(selectedRows);
                        },
                        onSelect: (selected, record, selectedRows) => {
                            props.onSelect(record);
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
                <Form layout='horizontal' form={form}>
                    <FormItem label='账号' style={{ width: 500 }} field='phone' rules={[{required: true,message: "账号必输"}]}
                              normalize={(value) => {
                                  setLoginPhone(value) ; return value;}}
                    >
                        <Input style={{ width: 270 }} allowClear placeholder='请输入账号...' />
                    </FormItem>
                    <FormItem label='验证码' style={{ width: 500 }} field='loginCode' rules={[{required: true,message: "验证码必输"}]}>
                        <Input style={{ width: 270 }} allowClear placeholder='验证码...' />
                    </FormItem>
                    <FormItem label='密钥' style={{ width: 500 }} field='accessToken'>
                        <Input style={{ width: 270 }} allowClear  />
                    </FormItem>
                    <FormItem label='memberCode' style={{ width: 500 }} field='memberCode'>
                        <Input style={{ width: 270 }} allowClear  />
                    </FormItem>
                    <FormItem label='userId' style={{ width: 500 }} field='userId'>
                        <Input style={{ width: 270 }} allowClear  />
                    </FormItem>
                    <Button style={{ width: 100 }} type='primary' onClick = {sendCode}>发送验证码</Button>
                    <Button style={{ width: 100 }} type='primary' onClick = {setToken}>设置密钥</Button>
                </Form>
            </Modal>
        </div>
    );
}

export default SearchRSNTable;
