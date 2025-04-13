<script setup>
  import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
  } from '@element-plus/icons-vue'
  import avatar from '@/assets/default.png'
  import { onMounted } from 'vue'
  import { useUserStore } from '@/stores'
  import { useRouter } from 'vue-router'

  // 获取用户基本信息
  const userStore = useUserStore()
  onMounted(() => {
    userStore.getUser()
  })
  // 登出事件
  const router = useRouter()
  const onCommand = command => {
    if (command === 'logout') {
      onLogout()
    } else {
      router.push(`/user/${command}`)
    }
  }
  const onLogout = () => {
    ElMessageBox.confirm('确定退出登陆吗QAQ?', '退出登录', {
      confirmButtonText: '是的',
      cancelButtonText: '再想想',
      type: 'warning',
      draggable: true
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: '退出登录成功！'
        })
        router.replace('/login')
        userStore.setToken('')
        userStore.setUser({})
      })
      .catch(() => {})
  }
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          你好，<strong>{{ userStore.user.nickname }}</strong
          >！
        </div>
        <el-dropdown @command="onCommand" placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer> -->
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
  .layout-container {
    height: 100vh;
    .el-aside {
      background-color: #232323;
      &__logo {
        height: 120px;
        background: url('@/assets/logo.jpg') no-repeat center / 210px auto;
      }
      .el-menu {
        border-right: none;
      }
    }
    .el-header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-dropdown__box {
        display: flex;
        align-items: center;
        .el-icon {
          color: #999;
          margin-left: 10px;
        }

        &:active,
        &:focus {
          outline: none;
        }
      }
    }
    .el-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
    }
  }
</style>
