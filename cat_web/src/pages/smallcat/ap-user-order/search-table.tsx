import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Card,
    PaginationProps,
    Button,
    Modal,
    Space, Form, Input,
} from '@arco-design/web-react';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import ExportJsonExcel from 'js-export-excel';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { searchParam} from './interface';
import SearchForm from "./search-form";
const { useForm } = Form;
const FormItem = Form.Item;

function SearchTable(props: searchParam) {
    const t = useLocale(locale);
    const [selectedRows, setSelectedRows] = useState({
        id: '',
    });
    const [handleVisible, setHandleVisible] = useState(false);
    const tableCallback = async (record, type) => {
        setHandleVisible(true);
        setSelectedRows(record);
    };

    const columns = useMemo(() => getColumns(t,props.checkStatus, tableCallback), [t]);
    const [data, setData] = useState([]);
    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 20,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });
    const [loading, setLoading] = useState(true);
    const [formParams, setFormParams] = useState({});
    const [form] = useForm();

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

    function fetchData() {
        const { current, pageSize } = pagination;
        setLoading(true);
        axiosHttp.get('/ap/admin/getOrders',{
            params: {
                current,
                size: pageSize,
                checkStatus:props.checkStatus,
                ...formParams,
            },
        }).then((res) => {
            if (res.data.data) {
                setData(res.data.data.records);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: res.data.data.total,
                });
            }
        }).finally(() => setLoading(false));
    }

    const exportExcel = () => {
        const dataTable = [];
        if (data) {
            for (const i in data) {
                const obj = {
                    '主键编号': data[i].id,
                    '订单编号': data[i].orderId,
                    '用户编号': data[i].userId,
                    '订单平台': data[i].platform,
                    '订单金额': data[i].orderAmt,
                    '下单时间': data[i].placedTime,
                    '返利比例': data[i].returnRate,
                    '返利金额': data[i].returnAmt,
                    '订单状态': data[i].checkStatus,
                    '拒绝原因': data[i].refuseReason,
                }
                dataTable.push(obj);
            }
        }
        const option={fileName : '小程序用户订单_'+new Date().toLocaleDateString(), datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['主键编号','订单编号','用户编号','订单平台','订单金额','下单时间','返利比例','返利金额','订单状态','拒绝原因'],
                    sheetHeader:['主键编号','订单编号','用户编号','订单平台','订单金额','下单时间','返利比例','返利金额','订单状态','拒绝原因'],
                    columnWidths: [8,10,10,5,5,5,15,6,15,5,5],
                }
            ]};
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }


    function onChangeTable(pagination) {
        setPatination(pagination);
    }

    function handleSearch(params) {
        setFormParams(params);
    }

    function handleOrders(checkStatus) {
        const msg = form.getFieldsValue().refuseReason;
        console.log(form.getFieldsValue())
        if (checkStatus == "2" && (typeof msg === 'undefined' || msg == '')) {
            Modal.error({
                title: '请输入拒绝原因',
            });
            return
        }
        axiosHttp.post('/ap/admin/updateOrderStatus',{
            checkStatus:checkStatus,
            id:selectedRows.id,
            refuseReason:msg,
        }).then((res) => {
            if (res.data.data) {
                Modal.success({
                    title: '执行成功',
                });
            }
        }).finally(() => {
            setLoading(false);
            setHandleVisible(false);
        });
        fetchData();
    }

    return (
        <div>
            <Card  title={t['menu.list.searchTable']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}>
                <SearchForm onSearch={handleSearch} />
                <div className={styles['button-group']}>
                    <Space>
                        <Button type="primary" onClick={exportExcel} >
                            {t['searchTable.operations.export']}
                        </Button>
                    </Space>
                </div>
                <Table
                    rowKey="id"
                    loading={loading}
                    scroll={{ y: 400 }}
                    onChange={onChangeTable}
                    pagination={pagination}
                    columns={columns}
                    data={data}
                />
            </Card>
            <Modal
                title='处理订单'
                visible={handleVisible}
                onCancel={() => setHandleVisible(false)}
                autoFocus={false}
                focusLock={true}
                footer={
                <div className={styles['button-group']}>
                    <Space>
                        <Button type="primary"  size="large" onClick={() => handleOrders('1')}>
                            同意
                        </Button>
                        <Button type="primary" status='warning' size="large" onClick={() => handleOrders('2')}>
                            拒绝
                        </Button>
                    </Space>
                </div>
                }
            >
                <Form layout='horizontal' form={form}>
                    <FormItem label='拒绝原因' style={{ width: 500 }} field='refuseReason' >
                        <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                                        showWordLimit
                                        placeholder='最多只能输入100个汉字'
                                        style={{ width: 200, height:100, marginBottom: 24 }}/>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
}

export default SearchTable;
