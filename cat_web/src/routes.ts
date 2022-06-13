export const defaultRoute = 'dashboard/workplace';

export const routes = [
  {
    name: 'menu.dashboard',
    key: 'dashboard',
    children: [
      {
        name: 'menu.dashboard.workplace',
        key: 'dashboard/workplace',
      },
      {
        name: 'menu.dashboard.monitor',
        key: 'dashboard/monitor',
      },
    ],
  },
  {
    name: 'menu.visualization',
    key: 'visualization',
    children: [
      {
        name: 'menu.visualization.dataAnalysis',
        key: 'visualization/data-analysis',
      },
      {
        name: 'menu.visualization.multiDimensionDataAnalysis',
        key: 'visualization/multi-dimension-data-analysis',
      },
    ],
  },
  {
    name: 'menu.list',
    key: 'list',
    children: [
      {
        name: 'menu.list.searchTable',
        key: 'list/search-table',
      },
      {
        name: 'menu.list.cardList',
        key: 'list/card',
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
        name: '海南APP-员工返利信息',
        key: 'list/hn-reward',
      },
      {
        name: '日上APP-用户管理',
        key: 'list/ri-phone',
      },
      {
        name: '日上APP-地址管理',
        key: 'list/ri-address',
      },
      {
        name: '日上APP-优惠券管理',
        key: 'list/ri-code',
      },
      {
        name: '日上APP-下单',
        key: 'form/RiPlaceOrder',
      },
      {
        name: '日上APP-订单',
        key: 'list/ri-placed',
      },
    ],
  },
  {
    name: 'menu.form',
    key: 'form',
    children: [
      {
        name: 'menu.form.group',
        key: 'form/group',
      },
      {
        name: 'menu.form.step',
        key: 'form/step',
      },
    ],
  },
  {
    name: 'menu.profile',
    key: 'profile',
    children: [
      {
        name: 'menu.profile.basic',
        key: 'profile/basic',
      },
    ],
  },

  {
    name: 'menu.result',
    key: 'result',
    children: [
      {
        name: 'menu.result.success',
        key: 'result/success',
        breadcrumb: false,
      },
      {
        name: 'menu.result.error',
        key: 'result/error',
        breadcrumb: false,
      },
    ],
  },
  {
    name: 'menu.exception',
    key: 'exception',
    children: [
      {
        name: 'menu.exception.403',
        key: 'exception/403',
      },
      {
        name: 'menu.exception.404',
        key: 'exception/404',
      },
      {
        name: 'menu.exception.500',
        key: 'exception/500',
      },
    ],
  },
  {
    name: 'menu.user',
    key: 'user',
    children: [
      {
        name: 'menu.user.info',
        key: 'user/info',
      },
      {
        name: 'menu.user.setting',
        key: 'user/setting',
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
