const i18n = {
  'zh-CN': {
    'small.cat': '小程序后台管理',
    'small.cat.user.order': '用户订单管理',
    'menu.list.searchTable': '查询表格',
    'cardList.order.title.all': '全部',
    'cardList.order.title.prePay': '待支付',
    'cardList.order.title.preSend': '待发货',
    'cardList.order.title.preFinish': '待收货',
    'cardList.order.title.finished': '已完成',
    'cardList.order.all.placeholder': '搜索',
    'cardList.add.quality': '点击创建质检内容队列',
    'cardList.enable': '启用',
    'cardList.disable': '禁用',
    'cardList.action': '操作',
    'cardList.detail': '详细信息',
    'cardList.tab.title.announcement': '最近公告',
    'cardList.announcement.noData': '暂无公告',
    'cardList.statistic.enable': '已启用',
    'cardList.statistic.disable': '未启用',
    'cardList.statistic.applicationNum': '应用数',

    'searchTable.form.search': '查询',
    'searchTable.form.reset': '重置',

    'searchTable.operations.export': '导出excel',

    'searchTable.columns.id': '主键编号',
    'searchTable.columns.orderId': '订单编号',
    'searchTable.columns.userId': '用户编号',
    'searchTable.columns.platform': '订单平台',
    'searchTable.columns.orderAmt': '订单金额',
    'searchTable.columns.placedTime': '下单时间',
    'searchTable.columns.returnRate': '返利比例',
    'searchTable.columns.returnAmt': '返利金额',
    'searchTable.columns.checkStatus': '订单状态',
    'searchTable.columns.refuseReason': '拒绝原因',

    'searchTable.columns.userName': '用户名称',
    'searchTable.columns.userPhone': '用户手机号',
    'searchTable.columns.lastLoginTime': '最近登录时间',
    'searchTable.columns.inputTime': '登记时间',
    'searchTable.columns.updateTime': '更新时间',

    'searchTable.columns.tipMessage': '提示信息',
    'searchTable.columns.tipPlatform': '提示平台',
    'searchTable.columns.tipBeginTime': '提示开始日期',
    'searchTable.columns.tipEndTime': '提示结束日期',

    'searchTable.columns.rebateSum': '返利金额',
    'searchTable.columns.rebateStatus': '返利状态',
    'searchTable.columns.rebateSubmitTime': '申请返利时间',
    'searchTable.columns.rebateSuccessTime': '返利成功时间',

    'searchTable.columns.signTime': '签收时间',
    'searchTable.columns.rejectTime': '退货时间',
    'searchTable.columns.goodsName': '商品名称',
    'searchTable.columns.buySum': '购买数量',
    'searchTable.columns.actualPaySum': '实付款',
    'searchTable.columns.commissionRate': '佣金比例%',
    'searchTable.columns.returnStatus': '商品返佣状态',
  },
};

export const platform = [{ id:'0',value:'所有'}, { id:'1',value:'cdf会员购海南'}, { id:'2',value:'cdf会员购'}, { id:'3',value:'cdf会员购广州'},]
export const checkStatusEnum = [{ id:'0',value:'未跟单'}, { id:'1',value:'未生效返利'}, { id:'2',value:'审核未通过'}, { id:'3',value:'已生效返利'},
  { id:'4',value:'取消'},{ id:'5',value:'已返利'},]
export const rebateStatusEnum = [{ id:'0',value:'待返利'}, { id:'1',value:'已返利'}, { id:'2',value:'取消返利'}, { id:'3',value:'返利拒绝'},]


export default i18n;

