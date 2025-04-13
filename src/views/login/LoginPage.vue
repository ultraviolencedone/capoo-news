<script setup>
  import { User, Lock } from '@element-plus/icons-vue'
  import { ref, watch } from 'vue'
  import { userRegisterService, userLoginService } from '@/api/user'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/stores'
  import { useRouter } from 'vue-router'

  const isRegister = ref(false)
  // 表单元素
  const modelForm = ref({
    username: 'xydalei',
    password: '123456',
    repassword: '123456'
  })
  // 校验规则
  // 1.用户名非空，长度校验5-10位
  // 2.密码非空，长度为6-15位的非空字符
  // 3.再次输入密码，和密码相同
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 5, max: 10, message: '用户名必须为5-10位的字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: /^\S{6,15}$/,
        message: '密码必须是6-15的非空字符',
        trigger: 'blur'
      }
    ],
    repassword: [
      // {required:true,message:'请输入密码',trigger:'change'},
      // {min:5,max:15,message:'密码必须为6-15位的字符',trigger:'change'},
      {
        validator: (rule, value, callback) => {
          if (value !== modelForm.value.password) {
            callback(new Error('和输入的密码不一致！'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  // 注册事件
  const form = ref()
  const register = async () => {
    // 注册前进行校验
    await form.value.validate()
    const res = await userRegisterService(modelForm.value)
    if (res.data.code === 0) {
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res.data.message)
    }
    // 转向登录
    isRegister.value = false
  }
  // 登录事件
  const router = useRouter()
  const login = async () => {
    // 登录前进行校验
    await form.value.validate()
    const res = await userLoginService(modelForm.value)
    if (res.data.code === 0) {
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res.data.message)
    }
    // 保存token
    const userStore = useUserStore()
    userStore.setToken(res.data.token)
    // 跳转
    router.push('/')
  }
  // 登录注册跳转清空表单
  watch(isRegister, () => {
    modelForm.value = {
      username: '',
      password: '',
      repassword: ''
    }
  })
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        ref="form"
        size="large"
        :rules="rules"
        autocomplete="off"
        v-if="isRegister"
        :model="modelForm"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="modelForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="modelForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="modelForm.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="modelForm"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="modelForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="modelForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            @keyup.enter="login"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .login-page {
    height: 100vh;
    background-color: #fff;
    .bg {
      background: url('@/assets/cover.avif') no-repeat center / 870px auto;
    }
    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      user-select: none;
      .title {
        margin: 0 auto;
      }
      .button {
        width: 100%;
      }
      .flex {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
