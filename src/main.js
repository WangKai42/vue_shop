import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入全局样式
import './assets/css/globle.css'
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'

// 配置请求的根路径

axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";
// token 令牌
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')

    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')