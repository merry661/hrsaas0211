<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- Tab头部门 -->
        <el-tabs>
          <!-- Tab页内容部分 -->
          <!-- 1) 角色管理-tab -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>

            <el-table v-loading="loading" border="" :data="roleList">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                align="center"
                header-align="left"
              />
              <el-table-column
                label="角色名称"
                prop="name"
                width="240"
                align="center"
                header-align="left"
              />
              <el-table-column
                label="描述"
                prop="description"
                align="center"
                header-align="left"
              />
              <el-table-column
                label="操作"
                resizable
                fixed="right"
                min-width="300px"
                align="center"
                header-align="left"
              >
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button type="success">分配权限</el-button>
                  <el-button
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    @click="deleteRoleById(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <!-- 2) 公司信息-tab -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />

            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyFormData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyFormData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyFormData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyFormData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 放置弹层组件(编辑角色/新增角色) -->
    <el-dialog
      :title="roleFormData.id ? '编辑角色' : '新增角色'"
      :visible="showDialog"
      @close="clickDialogCancel"
    >
      <el-form
        ref="dialogFormRole"
        label-width="120px"
        :rules="dialogRules"
        :model="roleFormData"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleFormData.name" />
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="clickDialogCancel">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="clickDialogOk"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口
import { getRoleList, getCompanyInfo, deleteRole, getRole, updateRole, addRole } from '@/api/setting'
// 引入vuex getters 快捷访问
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      roleList: [], // 承接数组 角色信息
      page: { // 分页: 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      companyFormData: {}, // 公司信息
      showDialog: false, // 是否显示“编辑角色”弹出层
      roleFormData: {
        name: '',
        description: ''

      }, // 专门接收新增或者编辑的编辑的表单数据
      // 弹层表单校验规则
      dialogRules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.loadRoleList()
    this.loadCompanyInfo()
  },
  methods: {
    // 1.获取角色信息，绑定角色信息
    async loadRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList({
        page: this.page.page,
        pagesize: this.page.pagesize
      })

      // 为data数据赋值
      this.roleList = rows
      this.page.total = total
      this.loading = false
      // console.log(this.page.page)
      // console.log(rows)
    },
    // 2.点击分页页码/箭头，显示新页面的数据
    changePage(newPage) {
      this.page.page = newPage
      this.loadRoleList()
    },
    // 3.获取公司信息--第二个tab
    async loadCompanyInfo() {
      const data = await getCompanyInfo(this.companyId)
      this.companyFormData = data
      // console.log(data)
    },
    // 4.删除角色
    async deleteRoleById(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id)// 调用删除接口
        // 重新加载数据
        this.loadRoleList()
        // 提示删除成功
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 5.编辑角色信息
    async editRole(id) {
      // 调用接口，显示信息
      const data = await getRole(id)
      this.roleFormData = data
      // 显示dialog弹出框
      this.showDialog = true
    },
    // 6.点击弹出层的 确定按钮
    async clickDialogOk() {
      try {
        // 1)手动校验输入框的输入值
        await this.$refs.dialogFormRole.validate()// 只有校验通过的情况下 才会执行await的下方内容

        // 2) 调用update接口
        if (this.roleFormData.id) { // 有id值,编辑角色
          await updateRole(this.roleFormData)
        } else {
          // 新增角色
          console.log(this.roleFormData)
          await addRole(this.roleFormData)
        }
        // 3)重新拉取数据
        this.loadRoleList()
        // 4)提示操作成功
        this.$message.success('操作成功')
        // 5)清空弹层的input框

        // 6)关闭弹出层
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 7.点击弹出层的 取消按钮
    clickDialogCancel() {
      // 1)清空弹层的input框
      this.$refs.dialogFormRole.resetFields()
      // 2)移除校验
      this.roleFormData = {
        name: '',
        description: ''
      }
      // 2)关闭弹出层
      this.showDialog = false
    }

  }
}
</script>

<style>
</style>
