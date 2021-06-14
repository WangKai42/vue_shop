<template>
<div>
     <!-- 面包屑导航区 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addDilogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
         <!-- 角色列表 -->
         <el-table :data="roleList" border stripe>
             <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' :'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row :class="[i2 === 0 ? '' :'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag 
                                    type="success"
                                    closable
                                    @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag 
                                    v-for="(item3,i3) in item2.children" :key="item3.id" 
                                    type="warning" 
                                    closable
                                    @close='removeRightById(scope.row,item3.id)'>
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column> 
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 修改用户信息对话框 -->
    <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%">
            <el-form :model="editForm" label-width="70px" ref="editFormRef">
                 <el-form-item label="角色名称" prop="roleName">
                   <el-input v-model="editForm.roleName"></el-input>
                 </el-form-item>
                 <!-- 角色描述 -->
                 <el-form-item label="角色描述" prop="roleDesc">
                   <el-input v-model="editForm.roleDesc"></el-input>
                 </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesInfo">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDilogVisible"
      width="50%"
      @close="addDilogColsed">
      <!-- 内容主体 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
    </el-form>
        <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDilogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close="setRightDialogClosed">
          <!-- 树形控件 -->
            <el-tree 
            :data='rightList' 
            :props="treeProps" 
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defKeys"
            ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
</div>
</template>
<script>

export default {

props:{

},
data(){
return {
    // 角色·列表·
    roleList:[],
    editDialogVisible:false,
    // 查询到的用户信息对象
    editForm:{}, 
    addDilogVisible:false,
    addForm:{
        roleName:'',
        roleDesc:'',
    },
    // 控制分配权限对话框显示隐藏
    setRightDialogVisible:false,
    // 所有权限数据
    rightList:[],
    // 树形控件的属性绑定对象
    treeProps:{
        label:'authName',
        children:'children',
    },
    // 默认选中的节点id值数组
    defKeys:[],
    // 即将分配权限的角色id
    roleId:'',
}
},
created() {
    this.getRolesList()
},
methods:{
    // 获取所有角色列表
  async  getRolesList() {
    const {data:res} = await this.$http.get('roles')
    if(res.meta.status !==200) {
        return this.$message.error('获取失败');
    }
    this.roleList = res.data;
    },
    // 编辑信息
    async showEditDialog(id) {
    const {data:res} = await this.$http.get('roles/' +id)
    if(res.meta.status !==200) {
        return this.$message.error('查询失败')
    }
    this.editForm = res.data
    this.editDialogVisible = true;
    },
      // 修改用户信息并提交
      editRolesInfo() {
        this.$refs.editFormRef.validate(async valid=>{
            // console.log(valid);
            if (!valid) return
            // 通过——发起修改用户信息的请求
        const {data:res} =  await this.$http.put('roles/' + this.editForm.roleId,{
            roleName :this.editForm.roleName,
            roleDesc:this.editForm.roleDesc
            })
            if(res.meta.status !==200) {
                console.log(res)
                return this.$message.error('更新用户信息失败')
            }
            
            // 关闭对话框
            this.editDialogVisible = false
            // 更新用户列表
            this.getRolesList()
            // 提示修改成功
            this.$message.success('更新用户信息成功')
        })
    },
    //   监听添加用户对话框关闭
       addDilogColsed() {
        this.$refs.addFormRef.resetFields();
    },
    // 点击添加新角色
    addUser(){
     this.$refs.addFormRef.validate(async valid=>{
            // console.log(valid);
            if (!valid) return
            // 可以发起添加用户的网络请求
     const {data:res}= await  this.$http.post('roles',this.addForm)
     if(res.meta.status !==201) {
         this.$message.error('添加用户失败')
     }
     this.$message.success('添加用户成功!')
    //  隐藏添加用户的对话框
     this.addDilogVisible = false
    //  刷新列表 重新获取用户列表数据
    this.getRolesList()
        })
    },
        // 根据id删除对应用户信息
  async  removeRolesById(id){
      const confirmResult = await  this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除则返回字符串 confirm
        // 如果用户取消删除则返回字符串 cancel
            //console.log(confirmResult);
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }
     const {data:res} =  await this.$http.delete('roles/' +id)
     if (res.meta.status !== 200) {
         return this.$message.error('删除失败')
     }
     this.$message.success('删除用户成功!')
    //  刷新
     this.getRolesList()
    },

     // 根据Id删除对应权限
   async removeRightById(role,rightId) {
    // 弹框提示用户是否删除
    const confirmResult =  await  this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }
    const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
    if(res.meta.status !==200) {
        return this.$message.error('删除权限失败')
        }
        this.$message.success('删除权限成功!')

        // this.getRolesList()
        role.children = res.data
    },
    // 分配权限对话框
   async showSetRightDialog(role) {
         //    保存id
         this.roleId = role.id
        // 获取所有权限数据
    const {data:res} =  await this.$http.get('rights/tree')
    if(res.meta.status !==200) {
        return this.$message.error('获取权限失败')
    }
    // 获取到权限数据保存到data中
        this.rightList = res.data

    // 递归获取三级节点的ID
    this.getLeafKeys(role,this.defKeys)

        this.setRightDialogVisible = true
    },
    // 通过递归形式，获取角色下所有三级权限的ID，并保存到defKeys数组中
    getLeafKeys(node,arr) {
        // 如果当前 node 节点不包含 children 属性则是三级节点
        if(!node.children) {
            return arr.push(node.id)
        }
        node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
        })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
        this.defKeys = []
    },
    // 为角色分配权限
   async allotRights() {
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        const idStr = keys.join(',')

    const {data:res} = await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
    if(res.meta.status !==200) {
        return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
    },
},
   

components:{

},
};
</script>

<style scoped lang='less'>
    .el-tag {
        margin:7px;
    }
    .bdtop {
            border-top: 1px solid #eee;
        }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>