import React, { useEffect, useState } from 'react';
import { CardBlockType,Monitor } from './interface';
import {
    Button,
    Card,
    Descriptions, Form, Input, Modal, Select,
    Skeleton,
} from '@arco-design/web-react';
import styles from './style/index.module.less';
import cs from 'classnames';
import axios from "axios";
import SearchTable from "@/pages/list/ri-phone";
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://localhost:9090';   //配置接口地址
const FormItem = Form.Item;

function CardBlock(props: CardBlockType) {
  const { type, card = {} } = props;
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(props.loading);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<Monitor>({});
  const [visiblePhone, setVisiblePhone] = React.useState(false);
  const [clickKey, setClickKey] = React.useState("");

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

    function selectPhone(phoneList) {
        if (phoneList != null && phoneList[0] != null) {
            formData[clickKey] = phoneList[0].phone;
            form.setFieldsValue({ [clickKey]: phoneList[0].phone, });
        }
    }
    async function saveData() {
        try{
            await form.validate()
            axios.post('/hnMonitor/insertOrUpdate', form.getFields()).then((res) => {
                setLoading(false);
                if(res.data.data){
                    Modal.success({
                        title: res.data.msg,
                    });
                    setFormVisible(false);
                } else {
                    Modal.error({
                        title: res.data.msg,
                    });
                }
            });
        }catch (e){

        }
    }
    function showForm() {
        axios.get('/hnMonitor/getByGoodsId/'+card.goodsId, {
        }).then((res) => {
            if(0 == res.data.code && res.data.data != null){
                form.setFieldsValue(res.data.data);
                setFormData(res.data.data)
            }
            form.setFieldsValue({ monitorGoodsId: card.goodsId, });
            form.setFieldsValue({ monitorGoodsName: card.productName, });
            formData.monitorGoodsId = card.goodsId;
            formData.monitorGoodsName = card.productName;
        });
        setFormVisible(true);
    }
  const getButtonGroup = () => {
      return (
        <>
          <Button type="primary" style={{ marginLeft: '12px' }} loading={loading} onClick={showForm}>
            监控
          </Button>
        </>
      );
  };

  const getContent = () => {
    if (loading) {
      return (
        <Skeleton text={{ rows: 2 }} animation  className={styles['card-block-skeleton']} />
      );
    }
    return (
      <Descriptions labelStyle={{ paddingRight: 20 }} style={{ marginBottom: 30 }}
                    column={1} data={[ { label: '产品名称', value: card.productName },
        { label: '出售价格', value: card.salesPrice }, ]} />
    );
  };

  const className = cs(styles['card-block'], styles[`${type}-card`]);

  return (
      <div>
    <Card bordered={true} className={className}
      title={ loading ? (
          <Skeleton animation text={{ rows: 1, width: ['100%'] }}
            style={{ width: '120px', height: '24px' }}
            className={styles['card-block-skeleton']}
          />
        ) : (
          <>
            <div className={cs(styles.title, { [styles['title-more']]: visible, })} >
              {card.goodsId}
            </div>
          </>
        )
      }
    >
      <div className={styles.content}>{getContent()}</div>
      <div className={styles.extra}>{getButtonGroup()}</div>
    </Card>
          <Modal
              title='监控'
              visible={formVisible}
              onOk={saveData}
              onCancel={() => setFormVisible(false)}
              autoFocus={false}
              focusLock={true}
          >
              <Form form={form} >
                  <FormItem label='监控账号' style={{ width: 500 }} field='monitorPhone' rules={[{required: true,message: "监控账号必输"}]}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input onClick={() => {
                          setVisiblePhone(true);
                          setClickKey("monitorPhone");
                      }} style={{ width: 270 }}  />
                  </FormItem>
                  <FormItem label='下单用户' field='placedPhone' style={{ width: 500 }} rules={[{required: true,message: "下单用户必输"}]}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input onClick={() => {
                          setVisiblePhone(true);
                          setClickKey("placedPhone");
                      }} style={{ width: 270 }} />
                  </FormItem>
                  <FormItem label='总数' field='placedNum' style={{ width: 500 }} rules={[{required: true,message: "下单数量必输"}]}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input style={{ width: 270 }} />
                  </FormItem>
                  <FormItem label='一单数量' field='placedOnceNum' style={{ width: 500 }} rules={[{required: true,message: "一单数量必输"}]}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input style={{ width: 270 }}   />
                  </FormItem>
                  <FormItem label='下单折扣价' field='discount' style={{ width: 500 }}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input style={{ width: 270 }} placeholder='请输入1-10的任意数字' />
                  </FormItem>
                  <FormItem label='下单商品ID' field='monitorGoodsId' style={{ width: 500 }}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input style={{ width: 270 }}  disabled />
                  </FormItem>
                  <FormItem label='下单商品名称' field='monitorGoodsName' style={{ width: 500 }}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input style={{ width: 270 }}  disabled />
                  </FormItem>
                  <FormItem label='生效状态' field='status' style={{ width: 500 }} rules={[{required: true,message: "生效状态必输"}]}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Select style={{ width: 270 }} defaultValue='0'>
                          <Select.Option value="0">生效</Select.Option>
                          <Select.Option value="1">失效</Select.Option>
                      </Select>
                  </FormItem>
                  <FormItem label='备注' field='remark' style={{ width: 500 }}
                            normalize={(value) => {
                                return value;}}
                  >
                      <Input.TextArea maxLength={{ length: 100, errorOnly: true }}
                                      showWordLimit
                                      placeholder='最多只能输入100个汉字'
                                      wrapperStyle={{ width: 300, marginBottom: 24 }}/>
                  </FormItem>
              </Form>
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
      </div>
  );
}

export default CardBlock;
