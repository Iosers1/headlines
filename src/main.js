/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
// 动态rem基准值
import "amfe-flexible";

// 全局样式文件
import "@/styles/index.less";
// 注册使用 Vant 组件库
Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
