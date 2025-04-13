<script setup>
  import { ref } from 'vue'
  import { Upload } from '@element-plus/icons-vue'
  import { useUserStore } from '@/stores'
  import { userUploadAvatarService } from '@/api/user.js'

  const userStore = useUserStore()

  const imgUrl = ref(userStore.user.user_pic)
  const onUploadFile = uploadFile => {
    // 确保从正确的属性获取文件对象
    const file = uploadFile.raw || uploadFile
    if (!(file instanceof Blob)) {
      console.error('Invalid file type:', file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file) // 这里使用正确的文件对象
    reader.onload = () => {
      imgUrl.value = reader.result
    }
  }
  const loading = ref(false)
  const onUpdateAvatar = async () => {
    loading.value = true
    await userUploadAvatarService(imgUrl.value)
    await userStore.getUser()
    loading.value = false
    ElMessage({ type: 'success', message: '更换头像成功' })
  }
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <!-- <el-button
        @click="onUploadFile"
        type="primary"
        :icon="Plus"
        size="large">
          选择图片
        </el-button> -->
        <el-button
          @click="onUpdateAvatar"
          type="success"
          :icon="Upload"
          size="large"
          v-loading="loading"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 278px;
        height: 278px;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 278px;
        height: 278px;
        text-align: center;
      }
    }
  }
</style>
