import React, {useContext, useState} from 'react';
import {
  Steps,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Card,
  Result, Modal, Select,
} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import axiosHttp  from '../../common/http'
import SearchAddress from "@/pages/list/ri-address/index";
import SearchTable from "@/pages/list/ri-phone/index";
import SearchRSNTable from '../../list/rsn-orders/search-table';


const { Title, Paragraph } = Typography;
function StepForm() {
  const t = useLocale(locale);
  const [current, setCurrent] = useState(1);
  const [visiblePhone, setVisiblePhone] = React.useState(false);
  const [visibleAddress, setVisibleAddress] = React.useState(false);
  const [visibleOrder, setVisibleOrder] = React.useState(false);
  const [form] = Form.useForm();
  const [orders, setOrders] = useState({});
  const [phoneList, setPhoneList] = useState([{id:'',phone:''}]);
  const [address, setAddress] = useState({id:'',address:''});


  function selectOrder(orders) {
    setOrders(orders);
    console.log()
    form.setFieldsValue({ order: orders.orderId, });
  }

  function selectPhone(phoneList) {
    setPhoneList(phoneList);
    form.setFieldsValue({ orderPhone: phoneList[0].phone, });
  }

  function selectAddress(address) {
    setAddress(address);
    form.setFieldsValue({ address: address.address, });
  }


  const placeOrder = () => {
    const values = form.getFields();
    axiosHttp.post('/rsnew/addCarAndAddress', {
      phone: values.orderPhone,
      addressId: address.id,
      myOrderId: values.order,
      limitNum: values.limitNum,
      isNew: values.isNew,
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
  };


  return (
    <div className={styles.container}>
      <Card>
        <Title heading={5}>{t['stepForm.desc.basicInfo']}</Title>
        <div className={styles.wrapper}>
          <Steps current={current} lineless>
            <Steps.Step
              title={t['stepForm.title.channel']}
              description={t['stepForm.desc.channel']}
            />
          </Steps>
          <Form form={form} className={styles.form}>
            {current === 1 && (
              <Form.Item noStyle>
                <Form.Item label='订单账号' required field="orderPhone"
                           rules={[ {
                             required: true,
                             message: '订单账号必输',
                           }, ]} >
                  <Input onClick={() => setVisiblePhone(true)}
                         placeholder={t['stepForm.channel.order.placeholder']}
                  />
                </Form.Item>
                <Form.Item label='购物车内容' required field="order"
                  rules={[ {
                      required: true,
                      message: t['stepForm.channel.order.required'],
                    },
                  ]} >
                  <Input onClick={() => setVisibleOrder(true)}
                    placeholder={t['stepForm.channel.order.placeholder']}
                  />
                </Form.Item>
                <Form.Item label='添加地址' required field="address"
                  rules={[ {
                      required: true,
                      message: t['stepForm.channel.address.required'],
                    }, ]} >
                  <Input onClick={() => setVisibleAddress(true)}
                    placeholder={t['stepForm.channel.address.placeholder']}
                  />
                </Form.Item>
                <Form.Item label='数量限制' field='limitNum' rules={[{required: true,message: "数量限制必输"}]} >
                  <Input   placeholder='请输入数量限制...' />
                </Form.Item>
                <Form.Item label='账号类型' field="isNew"  rules={[{required: true,message: "账号类型必输"}]} >
                  <Select   >
                    <Select.Option value="0">新账号</Select.Option>
                    <Select.Option value="1">旧帐号</Select.Option>
                  </Select>
                </Form.Item>
              </Form.Item>
            )}
              <Form.Item label=" ">
                <Space>
                    <Space>
                      <Button
                          key="text"
                          type="primary"
                          style={{ marginRight: 16 }}
                          onClick={placeOrder}
                      >
                        添加购物车及地址
                      </Button>
                    </Space>
                </Space>
              </Form.Item>
          </Form>
        </div>
        {current === 2 && (
          <div className={styles['form-extra']}>
            <Title heading={6}>{t['stepForm.created.extra.title']}</Title>
            <Paragraph type="secondary">
              {t['stepForm.created.extra.desc']}
              <Button type="text">{t['stepForm.created.extra.detail']}</Button>
            </Paragraph>
          </div>
        )}
      </Card>
      <Modal
          title='我的订单'
          visible={visibleOrder}
          onOk={()=>{setVisibleOrder(false);}}
          onCancel={() => setVisibleOrder(false)}
          autoFocus={false}
          focusLock={true}
          style={{ top: 20,width:1200,height:800 }}
      >
        <SearchRSNTable type={"all"} phone={form.getFields().orderPhone} onSelect={selectOrder} />
      </Modal>
      <Modal
          title='用户'
          visible={visiblePhone}
          onOk={()=>{setVisiblePhone(false);}}
          onCancel={() => setVisiblePhone(false)}
          autoFocus={false}
          focusLock={true}
          style={{ top: 20,width:1200,height:800 }}
      >
        <SearchTable onSelect={selectPhone}/>
      </Modal>
      <Modal
          title='账号'
          visible={visibleAddress}
          onOk={()=>{setVisibleAddress(false);}}
          onCancel={() => setVisibleAddress(false)}
          autoFocus={false}
          focusLock={true}
          style={{ top: 20,width:1200,height:800 }}
      >
        <SearchAddress onSelect={selectAddress}/>
      </Modal>
    </div>
  );
}

export default StepForm;
