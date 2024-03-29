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
import PopularContents from "@/pages/list/ri-wishs/popular-contents";
import SearchAddress from "@/pages/list/ri-address/index";
import SearchTable from "@/pages/list/ri-phone/index";
import { GlobalToken} from '@/context';


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
  const [token, setToken] = useState({});
  const { setGlobalToken } = useContext(GlobalToken);


  function selectOrder(orders) {
    setOrders(orders);
    form.setFieldsValue({ order: orders.code, });
  }

  function selectPhone(phoneList) {
    setPhoneList(phoneList);
    form.setFieldsValue({ name: phoneList[0].phone+".......", });
  }

  function selectAddress(address) {
    setAddress(address);
    form.setFieldsValue({ address: address.address, });
  }


  const placeOrder = () => {
    const values = form.getFields();
    axiosHttp.post('/ri/placeOrderByCode', {
      //phoneId: phone.id,
      addressId: address.id,
      orderNum: values.number,
      type: values.type,
      preferentialSum: values.preferentialSum,
      wishPageRsp:orders,
      token:token,
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

  const reCreateForm = () => {
    form.resetFields();
    setCurrent(1);
  };
  const toNext = async () => {
    try {
      await form.validate();
      setCurrent(current + 1);
    } catch (_) {}
  };
  function riLogin() {
    const phoneNameList = [];
    phoneList.map((value) => {
      phoneNameList.push(value.phone)
    })
    const values = form.getFields();
    axiosHttp.post('/ri/riLogin', {
      phoneList: phoneNameList,
      password: values.basic.authorization,
    }).then((res) => {
      if(res.data.code === 0){
        setToken(res.data.data);
        form.setFieldsValue({ token: res.data.data});
        setGlobalToken(res.data.data);
      } else {
        Modal.error({
          title: res.data.msg,
        });
      }
    });
  }

  return (
    <div className={styles.container}>
      <Card>
        <Title heading={5}>{t['stepForm.desc.basicInfo']}</Title>
        <div className={styles.wrapper}>
          <Steps current={current} lineless>
            <Steps.Step
              title={t['stepForm.title.basicInfo']}
              description={t['stepForm.desc.basicInfo']}
            />
            <Steps.Step
              title={t['stepForm.title.channel']}
              description={t['stepForm.desc.channel']}
            />
            <Steps.Step
              title={t['stepForm.title.created']}
              description={t['stepForm.desc.created']}
            />
          </Steps>
          <Form form={form} className={styles.form}>
            {current === 1 && (
              <Form.Item noStyle>
                <Form.Item
                  label={t['stepForm.basicInfo.name']}
                  required
                  field="name"
                  rules={[
                    {
                      required: true,
                      message: t['stepForm.basicInfo.name.required'],
                    },
                  ]}
                >
                  <Input onClick={() => setVisiblePhone(true)}
                    placeholder={t['stepForm.basicInfo.name.placeholder']}
                  />
                </Form.Item>
                <Form.Item
                  label={t['stepForm.basicInfo.authorization']}
                  required
                  field="basic.authorization"
                  rules={[
                    {
                      required: true,
                      message: t['stepForm.basicInfo.authorization.required'],
                    },
                  ]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                    label={t['stepForm.basicInfo.token']}
                    field="token"
                >
                  <Input/>
                </Form.Item>
              </Form.Item>
            )}
            {current === 2 && (
              <Form.Item noStyle>
                <Form.Item
                  label={t['stepForm.channel.order']}
                  required
                  field="order"
                  rules={[
                    {
                      required: true,
                      message: t['stepForm.channel.order.required'],
                    },
                  ]}
                >
                  <Input onClick={() => setVisibleOrder(true)}
                    placeholder={t['stepForm.channel.order.placeholder']}
                  />
                </Form.Item>
                <Form.Item
                  label={t['stepForm.channel.address']}
                  required
                  field="address"
                  rules={[
                    {
                      required: true,
                      message: t['stepForm.channel.address.required'],
                    },
                  ]}
                >
                  <Input onClick={() => setVisibleAddress(true)}
                    placeholder={t['stepForm.channel.address.placeholder']}
                  />
                </Form.Item>
                <Form.Item
                    label={t['stepForm.channel.number']}
                    required
                    field="number"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                    label={t['stepForm.channel.type']}
                    required
                    field="type"
                    rules={[ { required: true, },]}
                >
                  <Select placeholder={ t['stepForm.channel.type'] } >
                    <Select.Option value="1">公用券码</Select.Option>
                    <Select.Option value="2">用户券码</Select.Option>
                    <Select.Option value="3">无须券码</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                    label={t['stepForm.channel.preferentialSum']}
                    field="preferentialSum"
                >
                  <Select placeholder={ t['stepForm.channel.preferentialSum'] } >
                    <Select.Option value="P28">P28</Select.Option>
                    <Select.Option value="P38">P38</Select.Option>
                    <Select.Option value="P58">P58</Select.Option>
                    <Select.Option value="P88">P88</Select.Option>
                  </Select>
                </Form.Item>
              </Form.Item>
            )}
            {current !== 3 ? (
              <Form.Item label=" ">
                <Space>
                  {current === 2 && (
                    <Space>
                      <Button
                          size="large"
                          onClick={() => setCurrent(current - 1)}
                      >
                        {t['stepForm.prev']}
                      </Button>
                      <Button type="primary" size="large" onClick={toNext}>
                        {t['stepForm.next']}
                      </Button>
                    </Space>
                  )}
                  {current === 1 && (
                    <Space>
                      <Button type="primary" size="large" onClick={riLogin}>
                        登陆
                      </Button>
                      <Button type="primary" size="large" onClick={toNext}>
                        {t['stepForm.next']}
                      </Button>
                    </Space>
                  )}
                </Space>
              </Form.Item>
            ) : (
              <Form.Item noStyle>
                <Result
                  title="点击下方按钮开始下单"
                  extra={[
                    <Button
                        key="prev"
                        style={{ marginRight: 16 }} type="primary"
                        onClick={() => setCurrent(current - 1)}
                    >
                      {t['stepForm.prev']}
                    </Button>,
                    <Button
                      key="text"
                      type="primary"
                      style={{ marginRight: 16 }}
                      onClick={placeOrder}
                    >
                      开始下单
                    </Button>,
                    <Button key="again" type="primary" onClick={reCreateForm}>
                      {t['stepForm.created.success.again']}
                    </Button>,
                  ]}
                />
              </Form.Item>
            )}
          </Form>
        </div>
        {current === 3 && (
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
        <PopularContents token={token} width={300} onSelect={selectOrder}/>
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
