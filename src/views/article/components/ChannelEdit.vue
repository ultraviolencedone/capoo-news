<script setup>
  import { ref, inject } from 'vue'
  import { artAddChannelService, artEditChannelService } from '@/api/article'
  import { ElMessage } from 'element-plus'

  const dialogVisible = ref(false)
  const title = ref('')
  // 定义传入方法
  const modelForm = ref()
  const mode = ref('')
  const show = (row, action) => {
    dialogVisible.value = true
    mode.value = action
    if (action === 'edit') {
      title.value = '编辑分类'
    }
    if (action === 'add') {
      title.value = '添加分类'
    }
    modelForm.value = { ...row }
  }
  defineExpose({
    show
  })

  // 校验规则
  // 1.分类名必须是1-10位的非空字符
  // 2.分类别名必须是1-15位的字母数字
  const rules = {
    cate_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      {
        pattern: /^\S{1,10}$/,
        message: '分类名必须是1-10位的非空字符',
        trigger: 'blur'
      }
    ],
    cate_alias: [
      { required: true, message: '请输入分类别名', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9]{1,15}$/,
        message: '分类别名必须是1-15位的字母数字',
        trigger: 'blur'
      }
    ]
  }

  // 收集更新视图方法
  const getChannelList = inject('getChannelList')
  // 添加分类
  const onAdd = async () => {
    await artAddChannelService(modelForm.value)
    getChannelList()
    ElMessage.success('添加成功！')
  }
  // 编辑分类
  const onEdit = async () => {
    await artEditChannelService(modelForm.value)
    getChannelList()
    ElMessage.success('编辑成功！')
  }

  // 弹窗确定事件
  const form = ref()
  const onConfirm = async () => {
    await form.value.validate()
    dialogVisible.value = false
    if (mode.value === 'add') {
      onAdd()
    }
    if (mode.value === 'edit') {
      onEdit()
    }
  }
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="40%">
    <el-form :model="modelForm" :rules="rules" ref="form">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="modelForm.cate_name" minlength="1" maxlength="15" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="modelForm.cate_alias" minlength="1" maxlength="15" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
