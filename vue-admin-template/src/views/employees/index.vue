<template>
  <!-- 员工列表页面 -->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- -通用-工具栏组件 -->
      <page-tools>
        <!-- 左侧显示总记录数 :插槽的2种使用方式 -->
        <!-- <span slot="before">共{{ page.total }}条记录</span> -->
        <template v-slot:before>
          <span> 共{{ page.total }}条记录 </span>
        </template>

        <!-- 右侧显示按钮  excel导入 excel导出 新增员工 -->
        <template slot="after">
          <el-button
            type="warning"
            @click="$router.push('/import?type=user')"
          >excel导入</el-button>
          <el-button
            type="danger"
            @click="exportUserInfor"
          >excel导出</el-button>
          <el-button
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border="" :data="employeeList">
          <el-table-column label="序号" sortable type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center" width="120px">
            <template slot-scope="{ row }">
              <img
                v-imagerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="
									border-radius: 50%;
									width: 100px;
									height: 100px;
									padding: 10px;
								"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 用过滤器的方式使用工具类的方法：格式化时间 -->
          <el-table-column label="入职时间" sortable="">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>

          <!-- 用开关组件switch显示 账户状态 -->
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>

          <!-- 用过滤器的方式使用工具类的方法：格式化时间 -->
          <el-table-column label="转正时间" sortable="">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{
              row.correctionTime | formatDate
            }}</template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <!-- 点击查看按钮，跳转到 员工详情页 -->
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
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
            :current-page="page.page"
            :total="page.total"
            :page-size="page.size"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 1)新增员工--弹出框 -->
    <add-employee :show-dialog-add-user.sync="showDialog" />
    <!-- 2)点击员工头像--出现二维码--弹出层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 3)点击角色--显示角色管理弹出框 -->
    <assign-role
      ref="assignRole"
      :show-role-popup.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
// 引入接口
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入枚举文件
import EmployeeEnum from '@/api/constant/employees'
// 引入“新增员工”弹出框
import AddEmployee from './components/add-employee.vue'
// 引入“编辑角色” 弹出框组件
import AssignRole from './components/assign-role.vue'
// 引入格式化时间的第三方工具
import { formatDate } from '@/filters'
// 引入第三方组件：生成二维码
import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      page: { // list 的分页
        page: 1,
        size: 10,
        total: 0
      },
      employeeList: [], // 员工信息列表
      showDialog: false, // 是否显示“新增员工”弹层
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false, // 显示角色弹出框
      userId: null// 用于编辑角色
    }
  },
  created() {
    this.loadEmployeeList()
  },
  methods: {
    // 1.获取员工列表数据
    async loadEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.employeeList = rows
      // console.log(rows, total)
      this.loading = false
    },
    // 2.点击分页页码/箭头
    changePage(newPage) {
      this.page.page = newPage
      // 重新加载数据
      this.loadEmployeeList()
    },
    // 3.格式化聘用形式
    // EmployeeEnum.hireType:枚举文件中的”聘用形式数组“
    // 数组的find()方法:返回符合条件的元素（对象、数值、字符串等）
    // 参数：当前行的对象，当前列的对象，当前单元格的值，当前项的索引值
    formatEmployment(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      const obj = EmployeeEnum.hireType.find((item) => { return item.id === cellValue })// 返回符合cellValue的值
      // console.log(obj)//{id: 1, value: '正式'}
      return obj ? obj.value : '未知'
    },
    // 4.点击删除按钮，删除改行员工
    async deleteEmployee(id) {
      try {
        // 1)确认是否删除
        await this.$confirm('您确定删除该员工吗')
        // 2）确认后，调用删除接口
        await delEmployee(id)
        // 3)重新获取列表数据
        this.loadEmployeeList()
        // 4）删除后，提示删除成功
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },

    // 5.导出员工数据到EXCEL
    exportUserInfor() {
      // 1)定义header 中英文对应关系
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 2）懒加载Export2Excel，并配置excel导出参数
      // 参数excel:是引入文件Export2Excel的导出对象
      // debugger
      import('@/vendor/Export2Excel').then(async(excel) => {
        // 3）调用获取员工列表 接口
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        console.log(rows)// list数组
        // 4）格式化数据
        const data = this.formatJson(headers, rows)
        // 用于复杂表头
        // const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
          // multiHeader, // 复杂表头
          // merges // 合并选项
        })
      })
    },
    // 6.导出---将表头数据和英文header数据进行对应，并且导出时间格式的处理
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    // 7.点击头像，生成二维码
    showQrCode(url) {
      // 1）判断当前项的url是否存在
      if (url) {
        // 2）显示二维码弹出层
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          // 3)将地址转化成二维码
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 8.
    async editRole(id) {
      // 调用接口，获取数据
      this.userId = id
      // props传值 是异步的, 父组件调用子组件方法
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
