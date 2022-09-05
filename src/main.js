/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局样式文件
import "@/styles/index.less";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
