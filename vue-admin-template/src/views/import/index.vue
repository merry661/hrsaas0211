<template>
  <!-- "公共导入"组件 -->
  <UploadExcel :on-success="success" />
</template>
<script>
// 导入接口
import { importEmployee } from '@/api/employees'
export default {
  name: 'ImportPage',
  components: {
  },
  props: {},
  data() {
    return {
    //   type: this.$router.query.type
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    // 1.获取导入的excel数据, 导入excel接口
    async success(obj) {
      // 1）获取XLSX 工具解析excel后，传来的数据
      const { results } = obj
      // 2)建立中英文对应关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 3)将excel传进来的中文标题，转换为对应的英文
      // let arr = []
      //   results.forEach(element => {
      //     const obj1 = {}
      //     // console.log(Object.keys(element))//每一项的key值 组成的数组
      //     // ['手机号', '姓名', '入职日期', '转正日期', '工号']
      //     // map() 方法返回一个新数组，包含”原始数组元素调用函数处理后的值“
      //     Object.keys(element).map((item) => {
      //       obj1[userRelations[item]] = element[item]
      //     })
      //     arr.push(obj1)
      //   })
      var arr = results.map(item => { // 遍历results数组
        var userInfo = {}

        Object.keys(item).forEach(key => { // 遍历每一项的key值组成的数组
          // 后端接口 限制了 不能是字符串， 将excel传来的事件转化为正常的时间类型
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            console.log(this.formatDate(item[key], '/'))

            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            // 将excel传进来的中文标题，转换为对应的英文标题
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })

      // 4)用转化后的值，作为参数，调用接口
      await importEmployee(arr)
      this.$message.success('导入成功')
      // 5)导入完数据，返回员工管理页面
      this.$router.back()
    },
    // 2.转化EXCEl导入的不正确的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>
</style>
