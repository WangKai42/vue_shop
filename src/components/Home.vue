<template>
<div>
    <el-button type="info" @click='logout'>退出</el-button>
</div>
</template>
<script>

export default {

props:{

},
data(){
return {

}
},
methods:{
    logout() {
        // 清空本地token
        window.sessionStorage.clear();
        // 跳转
        this.$router.push('/login');
    }
},
components:{

},
};
</script>

<style scoped lang="less">

</style>