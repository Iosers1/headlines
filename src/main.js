import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// vant组件库所有导入
import Vant from 'vant'
import 'vant/lib/index.css'
// 动态rem基准值
import 'amfe-flexible'
// 格式化日期模块导入
import './utils/dayjs'

// 全局样式文件
import '@/styles/index.less'
// 注册使用 Vant 组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
