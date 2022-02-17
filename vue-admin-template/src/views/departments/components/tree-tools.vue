<template>
  <!-- 组织架构--树形结构 -->
  <el-row
    class="tree-card-title"
    type="flex"
    justify="space-between"
    align="middle"
  >
    <!-- 部门 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>

    <!-- 右侧 操作列 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <!-- dropdown下拉菜单的监听事件command -->
          <el-dropdown @command="operateDeps">
            <span> 操作<i class="el-icon-arrow-down" /> </span>

            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isShow"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isShow"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
// 引入部门接口
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  components: {
  },

  // props可以用"数组"来接收数据 也可用"对象"来接收
  props: {
    //   每个树节点要依赖的数据
    treeNode: {
      type: Object,
      required: true
    },
    // 是否显示下拉按钮中的”删除部门“和”编辑部门“
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    //   dropdown下拉菜单的监听事件command
    operateDeps(type) {
      if (type === 'add') { // 添加子部门的操作
        this.$emit('addDepts', this.treeNode)// // 告诉父组件 显示弹层
      } else if (type === 'edit') { //  编辑部门/查看部门的操作
        this.$emit('editDepts', this.treeNode)// // 告诉父组件 显示弹层
      } else { //  删除操作a
        // 1)提示用户是否删除
        this.$confirm('您确定要删除该组织部门吗')
          .then(() => {
            // 2)调用删除接口,返回promise对象
            return delDepartments(this.treeNode.id)
          }).then(() => {
            // 3)删除成功,通知父组件更新数据
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>

<style scoped>
	.tree-card-title {
		width: 100%;
		height: 40px;
	}
</style>
