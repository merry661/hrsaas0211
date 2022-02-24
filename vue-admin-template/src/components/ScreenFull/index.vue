<template>
  <!-- 封装全屏显示组件 -->
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>
<script>
// 引入全屏显示插件
import ScreenFull from 'screenfull'
export default {
  components: {
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  原生js调用
      ScreenFull.toggle()// 可以切换全屏/非全屏
    }
  }
}
</script>

<style scoped>
</style>
