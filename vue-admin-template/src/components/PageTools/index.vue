<template>
  <!--通用-工具栏组件 -->
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 第一列 -->
      <el-col>
        <div class="before">
          <!-- 叹号图标 -->
          <i class="el-icon-info" />
          <!-- 定义前面的插槽 -->
          <slot name="before" />
        </div>
      </el-col>

      <!-- 第二列 -->
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'PageTool',
  components: {
  },
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
}
</script>

<style scoped lang='scss'>
	.page-tools {
		margin: 10px 0;
		.before {
			line-height: 34px;
			i {
				margin-right: 5px;
				color: #409eff;
			}
			display: inline-block;
			padding: 0px 10px;
			border-radius: 3px;
			border: 1px solid rgba(145, 213, 255, 1);
			background: rgba(230, 247, 255, 1);
		}
	}
</style>
