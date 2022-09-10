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
import SearchForm from "./form";
const FormItem = Form.Item;


export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable(props: searchParam) {
    const t = useLocale(locale);
    const tableCallback = async (record, type) => {
        console.log(record, type);
    };
    const columns = useMemo(() => getColumns(t, tableCallback), [t]);
    const [data, setData] = useState([]);
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
        axiosHttp.get('/rsnOrderCoupon/selectAll', {
            params: {
                current,
                size: pageSize,
                ...formParams,
            },
        }).then((res) => {
            setData(res.data.data.records);
            setPatination({
                ...pagination,
                current,
                pageSize,
                total: res.data.data.total,
            });
        }).finally(() => setLoading(false));
    }

    function refresh() {
        setLoading(true);
        axiosHttp.post('/rsnew/getAllMyCoupon', {
            phone: 'all'
        }).finally(() => setLoading(false));
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
                        '优惠券账号':data[i].codePhone,
                        '优惠券ID': data[i].codeid,
                        '优惠券名称': data[i].codename,
                        '是否可用': data[i].isInuse,
                        '刷新时间': data[i].inputTime,
                    }
                    dataTable.push(obj);
                }
            }
        }
        const option={fileName : '中免日上_优惠券', datas:[
                {
                    sheetData:dataTable,
                    sheetName:'sheet',
                    sheetFilter:['优惠券账号','优惠券ID','优惠券名称','是否可用','刷新时间'],
                    sheetHeader:['优惠券账号','优惠券ID','优惠券名称','是否可用','刷新时间'],
                    columnWidths: [8,10,10,5,10],
                }
            ]};

        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }
    function handleSearch(params) {
        setFormParams(params);
    }

    return (
        <div>
            <Card
                title={t['menu.list.searchTable']}
                headerStyle={{ border: 'none', height: 'auto', paddingTop: '20px' }}
            >
                <SearchForm onSearch={handleSearch} />
                <div className={styles['button-group']}>
                    <Space>
                        <Button type="primary"  onClick={exportExcel}>
                            {t['searchTable.operations.export']}
                        </Button>
                        <Button type="primary"  onClick={refresh}>
                            刷新优惠券(预计25分钟)
                        </Button>
                    </Space>
                </div>
                <Table
                    rowKey="codeid"
                    loading={loading}
                    scroll={{ y: 400 }}
                    onChange={onChangeTable}
                    pagination={pagination}
                    columns={columns}
                    data={data}
                />
            </Card>
        </div>
    );
}

export default SearchTable;
