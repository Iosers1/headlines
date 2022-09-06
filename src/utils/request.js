/**
 * 封装 axios 请求模块
 */
import axios from 'axios'

const request = axios.create({
  // create会返回一个新的axios对象，axios.create的详细介绍看当日资料中的离线文章
  baseURL: 'http://toutiao.itheima.net' // 基础路径
})

export default request
