<template>
  <!-- 组织架构组件 -->
  <div class="dashboard-container">
    <el-card class="tree-card">
      <el-row>
        <!-- 顶部--公司名字 -->
        <tree-tool
          :tree-node="company"
          :is-show="false"
          @addDepts="addDepterments"
        />

        <!-- 中间内容列表部分 -->
        <el-tree
          icon-class="el-icon-circle-plus-outline"
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 使用element-ui的tree的插槽, 作用域插槽 slot-scope="obj" 接收传递给插槽的数据
          解构的data 是每个节点的数据对象 -->
          <tree-tool
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="loadDepartmentData"
            @addDepts="addDepterments"
            @editDepts="editDepterments"
          />
        </el-tree> </el-row></el-card>

    <!-- 放置新增弹层组件:父组件 sync修饰符 -->
    <add-dept-dialog
      ref="addDeptRef"
      :showdialog.sync="showDialog"
      :tree-node="node"
      @addDepts="loadDepartmentData"
    />
  </div>
</template>

<script>
// 引入子组件--树形结构
import TreeTool from './components/tree-tools.vue'
// 引入子组件--新增部门dialog
import AddDeptDialog from './components/add-dept-dialog.vue'
// 引入接口
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTool,
    AddDeptDialog
  },
  data() {
    return {
      // 默认属性：父节点，子节点
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { name: '', manager: '负责人', id: '', pid: '' }, // 头部信息
      departs: [], // 要被遍历的树节点们

      showDialog: false, // 是否显示模态框
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.loadDepartmentData()// 调用自身的方法
  },
  methods: {
    // 1.获取组织架构信息
    async loadDepartmentData() {
      try {
        const result = await getDepartments()

        this.company.name = result.companyName // 头部公司名字
        // this.departs = result.depts
        this.departs = transListToTreeData(result.depts, '')// 中间内容列表部分--需要将接口返回值转化为树形数据
      } catch (error) {
        console.log(error)
      }
    },
    // 2.添加部门信息
    addDepterments(treeNode) {
      this.showDialog = true // 显示弹出框
      this.node = treeNode
    },
    // 3.编辑部门/查看部门
    editDepterments(treeNode) {
      this.showDialog = true // 显示弹出框
      this.node = treeNode
      // 获取当前被点击部门的信息
      // 父组件 调用子组件的方法
      this.$refs.addDeptRef.getDepartDetails(this.node.id)
    }

  }
}
</script>

<style scoped>
	.tree-card {
		padding: 30px 140px;
		font-size: 14px;
	}
	/* .el-tree /deep/ .el-icon-arrow-right:before {
		content: "\e6d9";
	} */
</style>
