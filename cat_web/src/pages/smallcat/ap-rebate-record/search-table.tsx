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

    const columns = useMemo(() => getColumns(t,props.rebateStatus, tableCallback), [t]);
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
        axiosHttp.get('/ap/admin/getRebates',{
            params: {
                current,
                size: pageSize,
                rebateStatus:props.rebateStatus,
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
                    '用户编号': data[i].userId,
                    '返利金额': data[i].rebateSum,
                    '返利状态': data[i].rebateStatus,
                    '申请返利时间': data[i].rebateSubmitTime,
                    '返利成功时间': data[i].rebateSuccessTime,
                    '拒绝原因': data[i].refuseReason,
                }
                dataTable.push(obj);
            }
        }
        const option={fileName : '小程序用户返利记录_'+new Date().toLocaleDateString(), datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['主键编号','用户编号','返利金额','返利状态','申请返利时间','返利成功时间','拒绝原因'],
                    sheetHeader:['主键编号','用户编号','返利金额','返利状态','申请返利时间','返利成功时间','拒绝原因'],
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

    function handleOrders(status) {
        const msg = form.getFieldsValue().refuseReason;
        console.log(form.getFieldsValue())
        if (status == "3" && (typeof msg === 'undefined' || msg == '')) {
            Modal.error({
                title: '请输入拒绝原因',
            });
            return
        }
        axiosHttp.post('/ap/admin/updateRebate',{
            rebateStatus:status,
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
            fetchData();
        });
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
                title='处理返利'
                visible={handleVisible}
                onCancel={() => setHandleVisible(false)}
                autoFocus={false}
                focusLock={true}
                footer={
                <div className={styles['button-group']}>
                    <Space>
                        <Button type="primary"  size="large" onClick={() => handleOrders('1')}>
                            已线下返利
                        </Button>
                        <Button type="primary" status='warning' size="large" onClick={() => handleOrders('3')}>
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
