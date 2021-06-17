import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login.vue'

const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/login.vue')

// import Home from '../components/Home.vue'

const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Welcome from '../components/Welcome.vue'
/* import User from '../components/user/user.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue' */
const User = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/user/user.vue')
const Rights = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/power/Rights.vue')

const Roles = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const List = () =>
    import ( /* webpackChunkName: "List_Add" */ '../components/goods/List.vue')

const Add = () =>
    import ( /* webpackChunkName: "List_Add" */ '../components/goods/Add.vue')

const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')


Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
    routes: [{
            // 重定向
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: User
                },
                // 权限列表
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    component: Cate
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/goods',
                    component: List
                },
                {
                    path: '/goods/add',
                    component: Add
                },
                {
                    path: '/orders',
                    component: Order
                },
                {
                    path: '/reports',
                    component: Report
                },
            ]
        },
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from 代表从那个路径而来
    // next 一个函数，表示放行 
    //  next() 放行  next('/login')  强制跳转
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login')
    next()
})

export default router