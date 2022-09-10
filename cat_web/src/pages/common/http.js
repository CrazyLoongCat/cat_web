import axios from "axios";
// 配置不同环境下，调用不同接口

switch(process.env.NODE_ENV){
    // 生产环境，部署到服务器上的环境
    case 'production':
        axios.defaults.baseURL='http://82.156.242.246:9090/webapi';
        break;
    //开发环境接口地址
    default:
        axios.defaults.baseURL='http://localhost:9090/webapi'
}
/**
 * 设置超时时间和跨域是否允许携带凭证
 */
axios.defaults.timeout=10000  //设置十秒
/**
 * 设置请求数据参数传递的格式，默认是json格式，但是在登录校验中后台一般设置请求格式：x-www-form-urlencoded(name=xxx,age=xxx)
 * 看服务器要求什么格式
 */
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


export default axios