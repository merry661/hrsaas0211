<template>
  <!-- 首页部分 -->
  <div class="dashboard-container">
    <!-- 头部内容 -->
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <!-- 头像 -->
            <img v-imagerror="defaultImg" :src="userInfor.staffPhoto">
          </div>
          <div class="headInfoTip">
            <!-- 将首页的信息换成真实的用户资料 -->
            <p class="firstChild">
              早安，{{ userInfor.username }}}，祝你开心每一天！
            </p>
            <p class="lastChild">
              {{ userInfor.username }} | {{ userInfor.companyName }} -{{
                userInfor.departmentName
              }}
            </p>
          </div>
        </div>
        <div class="fr" />
      </div>
    </el-card>
    <!-- 主要内容 -->
    <el-row type="flex" justify="space-between">
      <!-- 左侧内容 -->
      <el-col :span="13" style="padding-right: 26px">
        <!-- 工作日历 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>工作日历</span>
            <WorkCalender />
          </div>
          <!-- 放置日历组件 -->
        </el-card>
        <!-- 公告 -->
        <el-card class="box-card">
          <div class="advContent">
            <div class="title">公告</div>
            <div class="contentItem">
              <ul class="noticeList">
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第1期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第2期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p>
                        <span class="col">朱继柳</span> 发布了
                        第3期“传智大讲堂”互动讨论获奖名单公布
                      </p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="11">
        <el-card class="box-card">
          <div class="header headTit">
            <span>流程申请</span>
          </div>
          <div class="sideNav">
            <el-button
              class="sideBtn"
              @click="showLeaveDialog = true"
            >加班离职</el-button>
            <el-button class="sideBtn">请假调休</el-button>
            <el-button class="sideBtn" @click="$router.push('/users/approvals')">审批列表</el-button>
            <el-button class="sideBtn" @click="$router.push('/users/info')">我的信息</el-button>
          </div>
        </el-card>

        <!-- 绩效指数 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>绩效指数</span>
          </div>
          <!-- 放置雷达图 -->
          <Radar />
        </el-card>
        <!-- 帮助连接 -->
        <el-card class="box-card">
          <div class="header headTit">
            <span>帮助链接</span>
          </div>
          <div class="sideLink">
            <el-row>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconGuide" />
                  <p>入门指南</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconHelp" />
                  <p>在线帮助手册</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconTechnology" />
                  <p>联系技术支持</p>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹出层 -->
    <el-dialog title="离职申请" :visible="showLeaveDialog" @close="btnCancel">
      <el-form ref="leaveForm" :model="leaveForm" style="label-width: 110px" :rules="rules">
        <el-form-item label="离职时间" prop="exceptTime">
          <el-date-picker
            v-model="leaveForm.exceptTime"
            placeholder="请选择离职时间"
            type="datetime"
          />
        </el-form-item>

        <el-form-item label="离职原因" prop="reason">
          <el-input
            v-model="leaveForm.reason"
            placeholder="请输入内容"
            style="width: 70%"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')
// 引入日历组件
import WorkCalender from './components/work-calendar.vue'
// 引入雷达图组件
import Radar from './components/radar'
// 引入离职审批接口
import { startProcess } from '@/api/approvals'

export default {
  name: 'Dashboard',
  components: {
    WorkCalender, Radar
  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg'),
      // 离职申请弹出层
      showLeaveDialog: false,
      leaveForm: {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      },
      rules: {
        exceptTime: [{ required: true, message: '离职时间不能为空' }],
        reason: [{ required: true, message: '离职原因不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    ...mapState(['userInfor'])
  },
  methods: {
    // 1.点击弹层的确定按钮
    btnOK() {
      this.$refs.leaveForm.validate(async(validate) => {
        if (validate) {
          // 如果校验成功，调用接口
          await startProcess({ ...this.leaveForm,
            userId: this.userInfor.userId,
            username: this.userInfor.username })

          this.$message.success('离职申请提交成功')
          this.showLeaveDialog = false
        }
      })
    },
    // 2.点击弹层的取消按钮
    btnCancel() {
      this.leaveForm = {
        // 离职时间
        exceptTime: '',
        // 离职原因
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      }
      this.$refs.leaveForm.resetFields()
      this.showLeaveDialog = false
    }
  }

}
</script>

<style lang="scss" scoped>
	.dashboard-container {
		margin: 10px;
		li {
			list-style: none;
		}
		.headImg {
			float: left;
			width: 100px;
			height: 100px;
			border-radius: 50%;
			background: #999;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.headInfoTip {
			padding: 25px 0 0;
			margin-left: 120px;
			p {
				padding: 0 0 15px;
				margin: 0;
				&.firstChild {
					font-size: 24px;
				}
				&.lastChild {
					font-size: 20px;
					color: #7f8c8d;
				}
			}
		}
	}

	.box-card {
		padding: 5px 10px;
		margin-top: 20px;
		.header {
			span {
				color: #2c3e50;
				font-size: 24px;
			}
			.item {
				color: #97a8be;
				float: right;
				padding: 3px 0;
			}
		}
		.headTit {
			span {
				border-bottom: 4px solid #8a97f8;
				padding-bottom: 10px;
			}
		}
	}
	.header-card {
		position: relative;
		.header {
			position: absolute;
			right: 20px;
			top: 15px;
			z-index: 1;
		}
	}

	.advContent {
		background: #fff;
		border-radius: 5px 5px 0px 0px;
		.title {
			font-size: 16px;
			padding: 20px;
			font-weight: bold;
			border-bottom: solid 1px #ccc;
		}
		.contentItem {
			padding: 0 30px;
			min-height: 350px;
			.item {
				display: flex;
				padding: 18px 0 10px;
				border-bottom: solid 1px #ccc;
				.col {
					color: #8a97f8;
				}
				img {
					width: 56px;
					height: 56px;
					border-radius: 50%;
					margin-right: 10px;
				}
				p {
					padding: 0 0 8px;
				}
			}
		}
	}
	.noticeList {
		margin: 0;
		padding: 0;
	}
	.sideNav,
	.sideLink {
		padding: 30px 0 12px;
		.sideBtn {
			padding: 16px 26px;
			font-size: 16px;
			margin: 10px 5px;
		}
	}
	.sideLink {
		text-align: center;
		.icon {
			display: inline-block;
			width: 76px;
			height: 76px;
			background: url("./../../assets/common/icon.png") no-repeat;
		}
		.iconGuide {
			background-position: 0 0;
		}
		.iconHelp {
			background-position: -224px 0;
		}
		.iconTechnology {
			background-position: -460px 0;
		}
	}
</style>
