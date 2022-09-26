import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps, Space, Button,
} from '@arco-design/web-react';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import ExportJsonExcel from 'js-export-excel';
import locale from './locale';
import { getColumns } from './constants';
import styles from "@/pages/list/hn-ryg/style/index.module.less";


function SearchTable(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
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
    axiosHttp.get('/rsnOrderPlaced/selectAll', {
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
        setLoading(false);
      });
  }
  const exportExcel = () => {
    const dataTable = [];
    if (data) {
      for (const i in data) {
        if(data){
          const obj = {
            '下单账号':data[i].placedPhone,
            '订单状态': data[i].status==0?'成功':'失败',
            '下单时间':data[i].inputTime,
          }
          dataTable.push(obj);
        }
      }
    }
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const option={fileName : '如意购_'+date, datas:[
        {
          sheetData:dataTable,
          sheetName:'sheet',
          sheetFilter:['下单账号','订单状态','下单时间'],
          sheetHeader:['下单账号','订单状态','下单时间'],
          columnWidths: [8,5,10],
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
             导出excel
            </Button>
          </Space>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          scroll={{ y: 500 }}
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
