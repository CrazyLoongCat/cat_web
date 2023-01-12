export const defaultRoute = 'dashboard/workplace';

export const routes = [
    {
        name: 'menu.list',
        key: 'list',
        children: [
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
