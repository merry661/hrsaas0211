<template>
  <!-- 员工详情页 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 表单 -->
            <el-form
              ref="userInfoForm"
              :rules="rules"
              :model="userInfo"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>

              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <!-- 打印（跳转到打印页面） -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 使用员工信息-子组件： vuejs中 内置了一个组件 component  可以放任何组件-->
            <!-- 动态组件 可以切换组件  is必须是变量-->
            <component :is="UserInfoComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <!-- 打印（跳转到打印页面） -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>

            <!-- 岗位信息 -->
            <component :is="JobInfoComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
// 引入接口文件
import { getUserAvatarById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
// 引入子组件：员工信息，岗位信息
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  name: 'EmployeeDetail',
  components: {
    UserInfo,
    JobInfo
  },
  props: {},
  data() {
    return {
      // 用于 动态组件 可以切换组件的is变量
      UserInfoComponent: 'user-info',
      JobInfoComponent: 'JobInfo',
      // 从url中获取用户id,直接将路由中的参数赋值给data中的属性
      userId: this.$route.params.id,
      // 表单校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      userInfo: {
        username: '',
        password2: '' // 为什么叫password2 因为读取出来的password是密文
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserInfor()
  },
  mounted() { },
  methods: {
    //   1.加载页面数据
    async loadUserInfor() {
      this.userInfo = await getUserAvatarById(this.userId)
    },
    // 2.保存修改
    saveUser() {
      // 1）.手动校验表单数据
      this.$refs.userInfoForm.validate().then(async() => {
        // 2）.校验通过，提交数据调用接口
        // 3）将新密码的值替换原密码的值
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        })
        this.$message.success('修改用户信息成功')
      }).catch((error) => {
        console.log(error)
        this.$message.warning('修改失败')
      })
    }
  }
}
</script>

<style scoped>
</style>
