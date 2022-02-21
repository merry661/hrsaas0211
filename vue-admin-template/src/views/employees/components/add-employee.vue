<template>
  <!-- 弹出层--用于新增员工 -->
  <div class="add-employee">
    <el-dialog title="新增员工" :visible="showDialogAddUser" @close="clickCancel">
      <!-- 表单 -->
      <el-form
        ref="addEmployeeRef"
        :model="formData"
        label-width="140px"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入姓名"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 50%"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 50%"
            placeholder="请选择入职时间"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <!-- 使用枚举，格式化 formOfEmployment:遍历枚举文件中的数组 -->
          <el-select
            v-model="formData.formOfEmployment"
            style="width: 50%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 50%"
            placeholder="请输入工号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input
            v-model="formData.departmentName"
            style="width: 50%"
            placeholder="请选择部门"
            @focus="getDepartments"
          />
          <!-- 使用 element-ui的 el-tree 树形组件.node-click:树形节点被点击时的触发该回调 -->
          <el-tree
            v-if="isShowTreee"
            v-loading="loading"
            :data="treeData"
            :default-expand-all="true"
            :props="{ label: 'name' }"
            @node-click="selectNode"
          />
        </el-form-item>
        <el-form-item label="转正时间">
          <el-date-picker
            v-model="formData.correctionTime"
            style="width: 50%"
            placeholder="请选择转正时间"
          />
        </el-form-item>
      </el-form>

      <!-- footer插槽 -->
      <div slot="footer">
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="clickCancel">取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="clickConfirm"
            >确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入接口
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
// 引入 树形转换工具文件
import { transListToTreeData } from '@/utils'
// 引入 员工枚举文件
import EmployeeEnum from '@/api/constant/employees.js'
export default {
  name: 'AddEmployee',
  components: {
  },
  props: {
    showDialogAddUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

      // 针对员工属性，添加校验规则
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      //   表单数据
      formData: {
        usernsme: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      treeData: [], // 定义数组 接收树形数据
      isShowTreee: false, // 是否显示部门的 树形组件
      loading: false, // 是否显示el-tree的loading
      EmployeeEnum// 枚举对象，用于格式化“应聘形式”
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    // 1.表单--部门 数据格式化（树形转化）
    async getDepartments() {
      this.loading = true

      // 1)调用接口，获取部门信息
      const { depts } = await getDepartments()
      // 2）数据转化为树形数据:参数，数组，根节点的ip=""
      this.treeData = transListToTreeData(depts, '')
      // 3）treeData数据更新
      // 4）显示树形组件
      this.isShowTreee = true

      this.loading = false
    },
    // 2.当树形节点被点击时，触发该方法
    // 接收3个参数：传递给 :data 的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
    selectNode(nodeObj, Node, nodeComponent) {
      // console.log(arguments)
      // 1)给部门的el-input组件赋值
      this.formData.departmentName = nodeObj.name
      //   2）隐藏属性组件
      this.isShowTreee = false
    },
    // 3.点击"新增员工“弹出框的 确认按钮
    async clickConfirm() {
      try {
        // 1)手动校验 整个表单
        await this.$refs.addEmployeeRef.validate()
        // 2）校验通过，调用提交接口，提交数据
        await addEmployee(this.formData)
        // console.log(data)
        // 4）更新list的数据（父组件）
        //  this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        this.$parent.loadEmployeeList && this.$parent.loadEmployeeList()
        // 5）关闭弹出框( this.$parent找父组件的data树形)
        this.$parent.showDialog = false
        // console.log(this.$parent.showDialog)
      } catch (error) {
        console.log(error)
      }
    },
    // 4.点击"新增员工“弹出框的 取消按钮
    clickCancel() {
      // 1)重置表单数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: ''
      }
      // 2）重置校验结果
      this.$refs.addEmployeeRef.resetFields()
      // 3）关闭弹出框（this.$emit找子组件要求父组件传的值）
      this.$emit('update:showDialogAddUser', false)
      // console.log(this.$parent.showDialog)
    }
  }
}
</script>

<style scoped>
</style>
