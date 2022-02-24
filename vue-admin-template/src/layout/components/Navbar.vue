<template>
  <div class="navbar">
    <!-- 顶部/头部组件 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="app-breadcrumb">
      江苏传智播客教育科技股份有限公司
      <span class="breadBtn">体验版</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 顶部-右侧下拉菜单设置 -->
    <div class="right-menu">
      <!-- 全屏显示 插件 -->
      <screen-full
        class="right-menu-item"
      />
      <!-- 换肤/主题插件 -->
      <ThemePicker class="right-menu-item" />
      <!-- 切换语言 -->
      <lang-select class="right-menu-item" />

      <el-dropdown
        class="
        avatar-container"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <!-- 用于处理异常图片的-自定义指令 -->
          <img
            v-imagerror="defaultImage"
            :src="userPhoto"
            class="user-avatar"
          >
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/shuiruohanyu/hrsaas53">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data() {
    return {
      defaultImage: require('@/assets/common/head.jpg')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userPhoto'
    ])
  },
  methods: {
    // 1. 点击合并左侧菜单
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 2. 点击退出登录
    async logout() {
      this.$store.dispatch('user/logoutSystem') // 1)调用vuex-->actions中的logout方法

      this.$router.push('/login') // 2)页面跳转到登录页
    }
  }
}
</script>

<style lang="scss" scoped>
	.navbar {
		height: 50px;
		overflow: hidden;
		position: relative;
		// background: #fff;
		background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
		box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
		.app-breadcrumb {
			display: inline-block;
			font-size: 18px;
			line-height: 50px;
			margin-left: 10px;
			color: #ffffff;
			cursor: text;
			.breadBtn {
				background: #84a9fe;
				font-size: 14px;
				padding: 0 10px;
				display: inline-block;
				height: 30px;
				line-height: 30px;
				border-radius: 10px;
				margin-left: 15px;
			}
		}
		.hamburger-container {
			line-height: 46px;
			height: 100%;
			float: left;
			cursor: pointer;
			transition: background 0.3s;
			-webkit-tap-highlight-color: transparent;

			&:hover {
				background: rgba(0, 0, 0, 0.025);
			}
		}

		// .breadcrumb-container {
		// 	float: left;
		// }

		.right-menu {
			float: right;
			height: 100%;
			line-height: 50px;

			&:focus {
				outline: none;
			}

			.right-menu-item {
				display: inline-block;
				padding: 0 8px;
				height: 100%;
				font-size: 18px;
				color: #5a5e66;
				vertical-align: middle;

				&.hover-effect {
					cursor: pointer;
					transition: background 0.3s;

					&:hover {
						background: rgba(0, 0, 0, 0.025);
					}
				}
			}

			.avatar-container {
				margin-right: 30px;

				.avatar-wrapper {
					margin-top: 5px;
					position: relative;

					// 右侧下拉--头像
					.user-avatar {
						cursor: pointer;
						width: 30px;
						height: 30px;
						border-radius: 15px;
						vertical-align: middle;
					}
					// 右侧下拉--用户角色名
					.name {
						color: #fff;
						vertical-align: middle;
						margin-left: 5px;
					}
					// 右侧下拉--下拉框内容部分
					.user-dropdown {
						color: #fff;
					}
					// 右侧下拉--下拉三角
					.el-icon-caret-bottom {
						cursor: pointer;
						position: absolute;
						right: -20px;
						top: 18px;
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
