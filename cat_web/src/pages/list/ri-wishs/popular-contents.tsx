import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Button, Card, Modal, PaginationProps, Radio, Space, Table, Typography} from '@arco-design/web-react';
import axios from 'axios';
import useLocale from './locale/useLocale';
import { getColumns } from './constants';
import styles from "@/pages/list/ri-wishs/style/index.module.less";
import ExportJsonExcel from 'js-export-excel';
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址

function PopularContent(props: {
  token: any,
  phone?:any,
  width:number,
  onSelect: (values: Record<string, any>) => void;
}) {
  const t = useLocale();
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };
  const columns = useMemo(() => getColumns(t, tableCallback), [t]);
  const [type, setType] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total] = useState(1000);
  const [token] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios.post('/ri/getwishs', {
          type: type,
          token:  props.token,
          pageNum: page-1,
      }).then((res) => {
        if (res.data.code == 0) {
          if (res.data.data != null) {
            setData(res.data.data);
          } else {
            setData([]);
          }

        } else if (res.data.code != 0){
          Modal.error({
            title: res.data.msg,
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  }, [page, type]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const exportExcel = () => {
    const dataTable = [];
    if (selectedRows) {
      for (const i in selectedRows) {
        if(selectedRows){
          const obj = {
            '下单账号':props.phone,
            '订单编号': selectedRows[i].code,
            '下单时间': selectedRows[i].creatdate,
            '订单状态': selectedRows[i].statedesc,
            '实付金额': selectedRows[i].prices,
            '收件人姓名': selectedRows[i].contacts,
            '地址': selectedRows[i].address,
            '手机号': selectedRows[i].tel,
            '商品名称': selectedRows[i].abname,
            '数量': selectedRows[i].num,


          }
          dataTable.push(obj);
        }
      }
    }
    const option={fileName : '日上订单_'+props.phone, datas:[
        {
          sheetData:dataTable,
          sheetName:'sheet',
          sheetFilter:['下单账号','订单编号','下单时间','订单状态','实付金额','收件人姓名','地址','手机号','商品名称','数量'],
          sheetHeader:['下单账号','订单编号','下单时间','订单状态','实付金额','收件人姓名','地址','手机号','商品名称','数量'],
          columnWidths: [8,10,10,5,5,5,15,6,15,5],
        }
      ]};

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  return (
    <Card
      title={t['workplace.popularContents']}
      headerStyle={{ borderBottom: 0 }}
    >
      <Radio.Group
        type="button"
        value={type}
        onChange={setType}
        options={[
          { label: t['workplace.unSubmit'], value: 0 },
          { label: t['workplace.submit'], value: 1 },
          { label: t['workplace.finished'], value: 2 },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div className={styles['button-group']}>
        <Space>
          <Button type="primary"  onClick={exportExcel}>
              导出excel
          </Button>

        </Space>
      </div>
      <Table
        rowKey="code"
        columns={columns}
        virtualized={true}
        scroll={{ y: props.width }}
        data={data}
        loading={loading}
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
        tableLayoutFixed
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        pagination={{ total, current: page, pageSize: 100, simple: true }}
      />
    </Card>
  );
}

export default PopularContent;
