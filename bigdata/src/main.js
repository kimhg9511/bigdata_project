import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import transitions from "@/styles/transitions.css";
import fonts from "@/styles/reg_font.css";
Vue.config.productionTip = false;

new Vue({
  fonts,
  transitions,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
