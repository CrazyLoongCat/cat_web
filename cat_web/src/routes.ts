export const defaultRoute = 'dashboard/workplace';

export const routes = [
  {
    name: 'menu.list',
    key: 'list',
    children: [
      {
        name: '用户管理',
        key: 'list/ri-phone',
      },
      {
        name: '地址管理',
        key: 'list/ri-address',
      },
      {
        name: '优惠券管理',
        key: 'list/ri-code',
      },
      {
        name: '海南APP-商品监控',
        key: 'list/hn-goods',
      },
      {
        name: '海南APP-监控列表',
        key: 'list/hn-monitors',
      },
      {
        name: '海南APP-如意购',
        key: 'list/hn-ryg',
      },
      {
        name: '海旅',
        key: 'list/lv-gou',
      },
      {
        name: '海南APP-对账',
        key: 'list/hn-orders-simple',
        children:[
          {
            name: '全部',
            key: 'list/hn-orders-simple/all',
          },
          {
            name: '对账',
            key: 'list/hn-orders-simple/verifys',
          },
          {
            name: '待支付',
            key: 'list/hn-orders-simple/pre-pay',
          },
          {
            name: '待发货',
            key: 'list/hn-orders-simple/pre-send',
          },
          {
            name: '待收货',
            key: 'list/hn-orders-simple/pre-finish',
          },
          {
            name: '已完成',
            key: 'list/hn-orders-simple/finished',
          }
        ]
      },
      {
        name: '海南APP-订单',
        key: 'list/hn-orders',
        children:[
          {
            name: '全部',
            key: 'list/hn-orders/all',
          },
          {
            name: '待支付',
            key: 'list/hn-orders/pre-pay',
          },
          {
            name: '待发货',
            key: 'list/hn-orders/pre-send',
          },
          {
            name: '待收货',
            key: 'list/hn-orders/pre-finish',
          },
          {
            name: '已完成',
            key: 'list/hn-orders/finished',
          }
        ]
      },
      {
        name: '中免日上-订单',
        key: 'list/rsn-orders',
        children:[
          {
            name: '全部',
            key: 'list/rsn-orders/all',
          },
          {
            name: '待支付',
            key: 'list/rsn-orders/prepay',
          },
          {
            name: '待发货',
            key: 'list/rsn-orders/delivery',
          },
          {
            name: '待收货',
            key: 'list/rsn-orders/receive',
          },
          {
            name: '退款',
            key: 'list/rsn-orders/refund',
          }
        ]
      },
      {
        name: '中免日上-优惠券',
        key: 'list/rsn-coupon',
      },
      /*{
        name: '日上APP-订单',
        key: 'list/ri-placed',
      },*/
      /*{
        name: '日上APP-下单',
        key: 'form/RiPlaceOrder',
      },*/
      {
        name: '中免日上-下单',
        key: 'form/rsn-place-order',
      },
      {
        name: '中免日上-已下订单',
        key: 'list/rsn-ordered',
      },
      {
        name: '中免日上-添加购物车',
        key: 'form/rsn-add-car-and-address',
      },
      {
        name: '海南APP-员工返利信息',
        key: 'list/hn-reward',
      },
    ],
  },
  {
    name: '小程序后台管理',
    key: 'smallcat',
    children: [
      {
        name: '用户订单管理',
        key: 'smallcat/ap-user-order',
        children: [
          {
            name: '全部',
            key: 'smallcat/ap-user-order/all',
          },
          {
            name: '未跟单',
            key: 'smallcat/ap-user-order/unDo',
          },
          {
            name: '未生效返利',
            key: 'smallcat/ap-user-order/needDo',
          },
          {
            name: '审核未通过',
            key: 'smallcat/ap-user-order/refuse',
          },
          {
            name: '已生效返利',
            key: 'smallcat/ap-user-order/needReturn',
          },
          {
            name: '取消',
            key: 'smallcat/ap-user-order/cancel',
          },
          {
            name: '已返利',
            key: 'smallcat/ap-user-order/done',
          },
        ],
      },
      {
        name: '用户返利管理',
        key: 'smallcat/ap-rebate-record',
        children: [
          {
            name: '全部',
            key: 'smallcat/ap-rebate-record/all',
          },
          {
            name: '待返利',
            key: 'smallcat/ap-rebate-record/unDo',
          },
          {
            name: '已返利',
            key: 'smallcat/ap-rebate-record/done',
          },
          {
            name: '取消返利',
            key: 'smallcat/ap-rebate-record/cancel',
          },
          {
            name: '返利拒绝',
            key: 'smallcat/ap-rebate-record/fail',
          },
        ],
      },
      {
        name: '小程序导入订单管理',
        key: 'smallcat/ap-base-order',
      },
      {
        name: '小程序用户查询',
        key: 'smallcat/ap-user-info',
      },
      {
        name: '小程序通知管理',
        key: 'smallcat/ap-message-info',
      },
    ],
  },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};
