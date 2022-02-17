<template>
  <!-- "添加部门" 弹出框组件 -->
  <el-dialog
    v-loading="loading"
    :title="showTitle"
    :visible="showdialog"
    @close="cancelBtn"
  >
    <!-- 弹出框表单数据 label-width设置标题的宽度-->
    <el-form
      ref="deptForm"
      :label-width="formLabelWidth"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="1-50个字符"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item label="部门编码" :label-width="formLabelWidth" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item
        label="部门负责人"
        :label-width="formLabelWidth"
        prop="manager"
      >
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          style="width: 80%"
          @focus="getEmployeeSim"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="(item, index) in employee"
            :key="index"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        :label-width="formLabelWidth"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :row="3"
        />
      </el-form-item>
    </el-form>

    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" class="dialog-footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelBtn">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmBtn"
        >确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
// 引入接口--获取组织架构信息
import { getDepartments, addDepartments, getDepartmentsDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDeptDialog',
  components: {
  },
  props: {
    // 需要父组件传入一个props变量来控制 显示或者隐藏
    showdialog: {
      type: Boolean,
      default: false
    },
    treeNode: { // 当前点击的节点信息
      type: Object,
      default: null
    }
  },
  data() {
    // 3)同级部门中禁止出现重复部门
    // 参数:规则,部门名称,回调函数
    const checkNameRepeat = async(rule, value, callback) => {
      // 1.先获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // arr.filter(func)返回 包含符合条件的 数组项的数组
      // arr.some(func) 有1个符合条件就返回true
      if (this.formData.id) { // 编辑模式:校验规则 除了我之外 同级部门下 不能有重复的部门
        isRepeat = depts.filter(item => item.id !== this.formData.id &&
						item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter((item) => {
          return item.pid === this.treeNode.pid
        }).some((item) => {
          return item.name === value
        })
      }

      isRepeat ? callback(new Error(`同级部门下已有${value}了`)) : callback()
    }
    // 4)部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 1.先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 2.定义一个标记
      let isRepeat = false
      if (this.formData.id) { // 编辑模式:不能校验自己
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 3.遍历组织架构数据,查找code=当前输入值的项
        isRepeat = depts.some(item => {
          return item.code === value && value // value不为空 因为我们的部门有可能没有code
        })
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码了`)) : callback()
    }
    return {
      loading: false, // 用来控制进度弹层的显示和隐藏
      employee: [], // 接收获取的员工简单列表的数据
      formLabelWidth: '120px',
      // 1)定义数据结构
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 2)定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }],

        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],

        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],

        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    // 根据计算属性显示控制标题
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    // 1.获取员工简单列表数据
    async getEmployeeSim() {
      this.loading = true
      try {
        // 1)调获取员工接口
        const data = await getEmployeeSimple()
        // 2)更新employee
        this.employee = data
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 2.点击弹出框的确定按钮--点击确定时，同时支持新增部门和编辑部门两个场景
    confirmBtn() {
      // 1)再一次整体校验表单--手动校验表单
      this.$refs.deptForm.validate(async(valid) => {
        if (valid) { // 手动验证有效的
          if (this.formData.id) { // 编辑模式
            await updateDepartments({ ...this.formData })
          } else {
            // 新增模式
            await addDepartments({ // 2)调用接口,发送数据(接口接收参数:code,introduce,manager,name,pid:父级部门ID)
              ...this.formData, pid: this.treeNode.id
            })
          }
        }
        // 3)在新增成功之后，调用告诉父组件，重新拉取数据
        this.$emit('addDepts') // 触发一个自定义事件
        // 4)让父组件关闭弹出框
        // 子组件 update:固定写法 (update:props名称, 值)
        this.$emit('update:showdialog', false)
      })
    },
    // 3.点击弹出框的取消按钮--取消时重置数据和校验
    cancelBtn() {
      // 1)重置弹出框中的字段
      // 同时重置非表单上的字段
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields()// resetFields 只能重置 "表单上的数据" 非表单上的 比如 编辑中id 不能重置
      // 2)关闭弹出框
      this.$emit('update:showdialog', false)
    },
    // 4. 获取部门详情
    async getDepartDetails(id) {
      // 因为我们是父组件调用子组件的方法  先设置了node 数据 直接调用方法
      // props传值是异步的
      this.formData = await getDepartmentsDetail(id)// 编辑模式的数据回写
    }
  }
}
</script>

<style scoped>
</style>
