import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import "./style.css";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(HighchartsVue);
app.mount("#app");
