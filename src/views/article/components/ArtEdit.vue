<script setup>
  import { ref, defineExpose, nextTick, computed } from 'vue'
  import { useArtStore } from '@/stores/modules/article'
  import {
    artGetinfoService,
    artAddService,
    artUpdataService
  } from '@/api/article'
  import { baseURL } from '@/utils/request'
  import { Plus } from '@element-plus/icons-vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import { urlToFile } from '@/utils/imagetofile'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import moment from 'moment'

  const mode = ref('')
  const isSee = ref(false)
  const channel = ref('')
  const headTtitle = ref('')
  const drawerVisible = ref(false)
  // 抽屉表单结构
  const modelForm = ref({
    title: '', // 文章标题
    cate_id: '', // 文章分类
    cover_img: '', // 文章封面
    content: '', // 文章内容
    state: '' // 已发布or草稿
  })
  // 默认表单
  const defaultForm = {
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: ''
  }
  // 文章详情
  const artInfo = ref({})
  // 暴露方法
  const quillEditorRef = ref()
  const rowId = ref('')
  const show = async (row, action) => {
    drawerVisible.value = true
    mode.value = action
    if (action === 'add') {
      isSee.value = false
      headTtitle.value = '添加文章'
      modelForm.value = defaultForm
      channel.value = ''
      imgUrl.value = ''
      nextTick(() => {
        if (quillEditorRef.value) {
          quillEditorRef.value.setHTML('') // 清空内容
        }
      })
    }
    if (action === 'edit') {
      isSee.value = false
      headTtitle.value = '编辑文章'
      await getArtInfo(row.id)
      channel.value = row.cate_name
      rowId.value = row.id
      modelForm.value.title = artInfo.value.title
      modelForm.value.cate_id = artInfo.value.cate_id
      modelForm.value.cover_img = artInfo.value.cover_img
      modelForm.value.content = artInfo.value.content
      modelForm.value.state = artInfo.value.state
      imgUrl.value = baseURL + artInfo.value.cover_img
    }
    if (action === 'see') {
      headTtitle.value = '文章预览'
      await getArtInfo(row.id)
      isSee.value = true
    }
  }
  defineExpose({
    show
  })
  // 获得文章分类列表
  const artStore = useArtStore()
  const cateList = ref([])
  cateList.value = artStore.channelList
  // 获得文章详情
  const getArtInfo = async id => {
    const {
      data: { data }
    } = await artGetinfoService(id)
    artInfo.value = data
  }
  // 添加图片事件
  const imgUrl = ref('')
  const onUploadFile = uploadFile => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    modelForm.value.cover_img = uploadFile.raw
  }
  // 底部按钮点击事件
  const onSubmit = async state => {
    modelForm.value.cate_id = channel.value
    modelForm.value.state = state
    modelForm.value.cover_img = await urlToFile(
      imgUrl.value,
      modelForm.value.cover_img
    )
    const fd = new FormData()
    for (let key in modelForm.value) {
      fd.append(key, modelForm.value[key])
    }
    if (mode.value === 'add') {
      await artAddService(fd)
      ElMessage.success('发布文章成功！')
      drawerVisible.value = false
    }
    if (mode.value === 'edit') {
      fd.append('id', Number(rowId.value))
      await artUpdataService(fd)
      ElMessage.success('编辑文章成功！')
      drawerVisible.value = false
    }
  }
  // 转化时间
  const pubDate = computed(() => {
    return moment(new Date(artInfo.value.pub_date)).format('YYYY-MM-DD')
  })
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :title="headTtitle"
    direction="rtl"
    size="50%"
  >
    <div v-if="isSee">
      <h3>{{ artInfo.title }}</h3>
      <p>
        作者:{{ artInfo.nickname }} 发布时间：{{ pubDate }} 文章分类：{{
          artInfo.cate_name
        }}
      </p>
      <hr />
      <img :src="baseURL + artInfo.cover_img" alt="" />
      <p v-html="artInfo.content"></p>
    </div>
    <el-form v-else :model="modelForm" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="modelForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <el-select v-model="channel" placeholder="请选择" clearable>
          <el-option
            v-for="item in cateList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="modelForm.content"
            contentType="html"
            ref="quillEditorRef"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('已发布')">发布</el-button>
        <el-button type="info" @click="onSubmit('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 178px;
        height: 178px;
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
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
  }
  .editor {
    width: 100%;
    :deep(.ql-editor) {
      min-height: 200px;
    }
  }
</style>
