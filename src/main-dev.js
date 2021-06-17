import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入全局样式
import './assets/css/globle.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器 样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 nprogress 的 js 和 css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

// 配置请求的根路径

axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";
// token 令牌
// 在 request 拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {

    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')

    return config
})

//  在 response  拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 将富文本编辑器进行全局注册
Vue.use(VueQuillEditor)

// 格式化事件
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')
    const hh = (dt.getHours() + 1 + '').padStart(2, '0')
    const min = (dt.getMinutes() + 1 + '').padStart(2, '0')
    const s = (dt.getSeconds() + 1 + '').padStart(2, '0')
    return `${y}-${m}-${d}  ${hh}:${min}:${s}`

})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')