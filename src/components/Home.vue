<template>
    

<el-container class="home_container">
  <el-header>
      <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click='logout'>退出</el-button>
  </el-header>
  <!-- 页面主体 -->
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '65px' :'200px'">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="$route.path">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板 -->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span> {{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item 
        :index="'/'+ subItem.path + '' " 
        v-for="subItem in item.children" 
        :key="subItem.id">

            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}} </span>
        </template>

        </el-menu-item>

      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 内容 -->
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>
<script>

export default {
    created() {
        this.getMenuList()
    },

props:{

},
data(){
return {
    // 左侧菜单数据
    menulist:[],
    // 图标
    iconObj:{
        '125':'el-icon-s-custom',
        '103':'el-icon-platform-eleme',
        '101':'el-icon-s-goods',
        '102':'el-icon-tickets',
        '145':'el-icon-monitor',
       
    },
    // 是否折叠
    isCollapse : false
}
},
methods:{
    logout() {
        // 清空本地token
        window.sessionStorage.clear();
        // 跳转
        this.$router.push('/login');
    },
    // 获取所有菜单
   async getMenuList() {
    const {data:res} = await this.$http.get('menus')
    if(res.meta.status !==200) {
        this.$message.error(res.meta.msg)
    }else {
        this.menulist = res.data
    }
    console.log(res);
    },
    // 切换导航菜单的折叠展开
    toggleCollapse() {
        this.isCollapse = !this.isCollapse
    }
},
components:{

},
};
</script>

<style scoped lang="less">
.home_container {
        height: 100%;
}
.el-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    background-color: #373d41;
    justify-items: center;
    color: white;
    font-size: 20px;
    div {
        display: flex;
        align-items: center;
        img {
            width: 60px;
            height: 60px;
        }
        span {
            padding-left: 10px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: 0;
    }
    .toggle_button {
        background-color: #4a5064;
        color: white;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
}
.el-main {
    background-color: #eaedf1;
    // height: 100%;
}
</style>