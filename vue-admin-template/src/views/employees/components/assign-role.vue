<template>
  <div>
    <el-dialog title="分配角色" :visible="showRolePopup" @close="btnCancel">
      <el-checkbox-group v-model="roleIds">
        <!-- 选项 -->
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
// 引入接口
import { getRoleList } from '@/api/setting'
import { getUserAvatarById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  components: {
  },
  props: {
    showRolePopup: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [], // 负责存储当前所有的角色id
      roleIds: []// 负责存储 当前用户所拥有的角色id
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList()
  },
  mounted() { },
  methods: {
    // 1.获取所有角色
    async getRoleList(id) {
      try {
        const { rows } = await getRoleList(id)

        this.roleList = rows
      } catch (error) {
        console.log(error)
      }
    },
    // 2.获取该用户的角色
    // 这个方法是给父组件调用的,props传值是异步的 所以这里不能用this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserAvatarById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 3.点击弹出框的取消按钮

    // 4.点击弹出框的确定按钮
    async btnOK() {
      // 1)调用接口
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 2）告诉父组件，关闭弹出框
      this.$emit('update:showRolePopup', false)
    //   console.log(this.$parent.showRoleDialog)
    },
    btnCancel() {
      // 取消
      this.roleIds = [] // 重置数组 将它还原成一个空
      this.$emit('update:showRolePopup', false)
    }
  }
}
</script>

<style scoped>
</style>
