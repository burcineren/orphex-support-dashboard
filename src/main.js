import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import HighchartsVue from "highcharts-vue";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(HighchartsVue);
app.mount("#app");
