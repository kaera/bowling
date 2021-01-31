import Vue from "vue";
import wrap from "@vue/web-component-wrapper";
import Game from "./components/Game.vue";

window.customElements.define("v-app", wrap(Vue, Game));

// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");

Vue.config.productionTip = false;
