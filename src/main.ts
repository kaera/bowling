import Vue from "vue";
import wrap from "@vue/web-component-wrapper";
import Game from "./components/Game.vue";

window.customElements.define("v-game", wrap(Vue, Game));

Vue.config.productionTip = false;
