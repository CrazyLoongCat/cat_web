import React, { useState, useEffect, useMemo } from 'react';
import ExportJsonExcel from 'js-export-excel';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space, Form, Input, Modal,
} from '@arco-design/web-react';
import axiosHttp  from '../../common/http'
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';


export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable(props: {
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale(locale);
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const downloadExcel = () => {
    const dataTable = [];
    if (selectedRows) {
      console.log(selectedRows);
      for (const i in selectedRows) {
        if(selectedRows){
          const obj = {
            '订单编号': selectedRows[i].orderCode,
            '生成订单用户': selectedRows[i].orderUser,
            '姓名': selectedRows[i].addressName,
            '电话': selectedRows[i].addressPhone,
            '地址': selectedRows[i].address,
            '商品名称': selectedRows[i].goodsName,
            '商品数量': selectedRows[i].goodsNum,
            '订单实付': selectedRows[i].goodsPrice,
            '订单应付': selectedRows[i].goodsOprice,
            '订单日期': selectedRows[i].inputDate,
          }
          dataTable.push(obj);
        }
      }
    }
    const option={fileName : '花花的订单', datas:[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:['订单编号','生成订单用户','姓名','电话','地址','商品名称','商品数量','订单实付','订单应付','订单日期'],
        sheetHeader:['订单编号','生成订单用户','姓名','电话','地址','商品名称','商品数量','订单实付','订单应付','订单日期'],
      }
    ]};

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    axiosHttp.get('/riOrderPlaced/selectAll', {
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
            <Button type="primary" onClick={downloadExcel}>
              导出Excel表格
            </Button>
          </Space>
        </div>
        <Table
          rowKey="inputTime"
          scroll={{ y: 400 }}
          rowSelection={{
            type:'checkbox',
            onSelect: (selected, record, selectedRows) => {
              console.log("2222222222", selectedRows);
            },
            onSelectAll: (selected, selectedRows) =>{
              setSelectedRows(selectedRows);
            },
          }}
          border={false}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
