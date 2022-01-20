import React, { useState, useEffect, useMemo } from 'react';
import ExportJsonExcel from 'js-export-excel';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space, Form, Input, Modal,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';

export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

const FormItem = Form.Item;

function SearchTable() {
  const t = useLocale(locale);
  const [visible, setVisible] = React.useState(false);
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formParams, setFormParams] = useState({});

  const downloadExcel = () => {
    const dataTable = [];
    if (selectedRows) {
      console.log(selectedRows);
      for (const i in selectedRows) {
        if(selectedRows){
          const obj = {
            '优惠券编号': selectedRows[i].id,
            '优惠券': selectedRows[i].code,
            '是否可用': selectedRows[i].isInuse,
            '使用状态': selectedRows[i].isUsed,
            '登记时间': selectedRows[i].inputTime,
          }
          dataTable.push(obj);
        }
      }
    }
    const option={fileName : '花花的优惠券', datas:[
        {
          sheetData:dataTable,
          sheetName:'sheet',
          sheetFilter:['优惠券编号','优惠券','是否可用','使用状态','登记时间'],
          sheetHeader:['优惠券编号','优惠券','是否可用','使用状态','登记时间'],
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
    console.log(pagination)
    setLoading(true);
    axios.get('/riOrderConvolutionCode/selectAll', {
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
  let codeString ='';

  function saveData() {
    setLoading(true);
    console.log(codeString)
    axios.post('/riOrderConvolutionCode/insertBatch', {
       codeString,
    }).then((res) => {
      setLoading(false);
      if(res.data.data){
        Modal.success({
          title: res.data.msg,
        });
      } else {
        Modal.error({
          title: res.data.msg,
        });
      }
      setVisible(false);
      fetchData();
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
            <Button type="primary" icon={<IconPlus />} onClick={() => setVisible(true)}>
              {t['searchTable.operations.upload']}
            </Button>
            <Button type="primary" icon={<IconPlus />} onClick={downloadExcel}>
              导出excel
            </Button>
          </Space>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          scroll={{ y: 400 }}
          data={data}
          rowSelection={{
            type:'checkbox',
            onSelect: (selected, record, selectedRows) => {
              console.log("2222222222", selectedRows);
            },
            onSelectAll: (selected, selectedRows) =>{
              setSelectedRows(selectedRows);
            },
          }}

        />
      </Card>
      <Modal
          title='新增'
          visible={visible}
          onOk={saveData}
          onCancel={() => setVisible(false)}
          autoFocus={false}
          focusLock={true}
      >
        <Form layout='horizontal' >
          <FormItem label='备注' field='remark' style={{ width: 500 }}
                    normalize={(value) => {
                      codeString = value;return value;}}
          >
            <Input.TextArea maxLength={{ length: 10000, errorOnly: true }}
                            showWordLimit
                            placeholder='最多只能输入10000个汉字'
                            style={{ width: 300, height:300, marginBottom: 24 }}/>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default SearchTable;
