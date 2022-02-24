<template>
  <!-- 首页的日历组件 -->
  <div>
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>

      <!-- 月 -->
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
        @change="dateChange"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{
          item
        }}</el-option>
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <template slot="dateCell" slot-scope="{ date, data }" class="content">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  name: 'WorkCalender',
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }

  },
  components: {
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      // 日历时间
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },

  computed: {},
  watch: {},
  // 初始化事件
  created() {
    // 1.获取当前的年份
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1 // 组件要求起始时间必须是 周一开始 以一个月为开始
    // 2.根据当前的年 生成可选年份 前后各加5年
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    // 3.钩子函数执行完成之后
    this.dateChange() // 主动调用一下方法
  },
  mounted() { },
  methods: {
    // 1. 是否是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },

    // 2.年月份改变之后,日历跟着改变
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)// 以1号为开始，生成新的日期
    }
  }
}
</script>

<style  scoped>
	/deep/ .el-calendar-day {
		height: auto;
	}
	/deep/ .el-calendar-table__row td,
	/deep/ .el-calendar-table tr td:first-child,
	/deep/ .el-calendar-table__row td.prev {
		border: none;
	}
	.date-content {
		height: 40px;
		text-align: center;
		line-height: 40px;
		font-size: 14px;
	}
	.date-content .rest {
		color: #fff;
		border-radius: 50%;
		background: rgb(250, 124, 77);
		width: 20px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		font-size: 12px;
		margin-left: 10px;
	}
	.date-content .text {
		width: 20px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
	}
	/deep/ .el-calendar-table td.is-selected .text {
		background: #409eff;
		color: #fff;
		border-radius: 50%;
	}
	/deep/ .el-calendar__header {
		display: none;
	}
</style>
