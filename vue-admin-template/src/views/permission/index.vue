<template>
  <!-- 权限管理页面 -->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermissionBtn(1, '0')"
          >添加权限</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <!-- 如果需要树表， 需要给**el-table**配置**row-key**属性  id -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <i class="el-icon-folder-opened" />
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="名称" prop="name" /> -->
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 添加按钮只在 访问权的层级显示 当type==1 时才显示添加按钮 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermissionBtn(2, row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹出层：用来编辑新增节点（添加、编辑角色） -->
    <el-dialog
      :title="`${showText}权限点`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'PermissionPage',
  data() {
    return {
      list: [], // 权限列表数据
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false // 是否显示角色 弹出层
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 1.获取权限列表数据
    async getPermissionList() {
      // 2.将接口数据转换成树形结构,参数：要转换的数组，根节点id的值
      this.list = transListToTreeData(await getPermissionList(), '0')
    },

    // 2.点击弹层的取消按钮
    btnCancel() {
      this.formData = { // 1)重置表单数据
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }

      this.$refs.perForm.resetFields() // 2）移除校验

      this.showDialog = false // 3）隐藏弹层
    },

    // 3.点击弹层的确定按钮
    btnOK() {
      this.$refs.perForm.validate().then(() => { // 1)手动校验表单
        if (this.formData.id) { // 2）校验成功，判断是编辑还是新增
          return updatePermission(this.formData) // 4）编辑，调用编辑接口,参数：弹出层表单的值
        } else {
          return addPermission(this.formData) // 3）新增，调用新增接口
        }
      }).then(() => {
        // 5）提示操作成功，并调用接口更新list数据
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false// 关闭弹出层
      })
    },

    // 4.添加权限：记录当前添加的权限类型，父节点的标志
    // 参数：权限种类，当前数据的父节点
    addPermissionBtn(type, pid) {
      // 2）获取数据，将数据显示在弹层
      this.formData.type = type
      this.formData.pid = pid

      this.showDialog = true // 1)显示弹层
    },
    // 5.编辑权限
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)// 1）获取表单数据
      this.showDialog = true// 2）显示弹出层
    },

    // 6.删除list中的某个权限
    delPermission(id) {
      this.$confirm('确认删除该权限点吗').then(() => { // 1）询问，确定删除吗
        return delPermission(id) // 2）确定：调用接口删除
      }).then(() => {
        // 3）提示删除成功，重新拉取list数据
        this.$message.success('删除成功')
        this.getPermissionList()
      })
    }
  }
}
</script>

<style>
</style>
