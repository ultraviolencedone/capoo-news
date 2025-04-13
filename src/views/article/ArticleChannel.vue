<script setup>
  import { Delete, Edit } from '@element-plus/icons-vue'
  import { ref, onMounted, provide } from 'vue'
  import { artGetChannelService, artDelChannelService } from '@/api/article'
  import channelEdit from './components/ChannelEdit.vue'
  import { useArtStore } from '@/stores/modules/article'

  const artStore = useArtStore()
  const channelList = ref([])
  // 获取分类列表
  const getChannelList = async () => {
    loading.value = true
    const res = await artGetChannelService()
    channelList.value = res.data.data
    artStore.setChannelList(channelList.value)
    loading.value = false
  }
  onMounted(() => {
    getChannelList()
  })
  // 设置loading
  const loading = ref(true)
  // 把更新视图方法传给子组件
  provide('getChannelList', getChannelList)
  // 添加分类点击事件
  const dialog = ref()
  const onAddChannel = () => {
    dialog.value.show({ cate_name: '', caye_alias: '' }, 'add')
  }
  // 编辑分类点击事件
  const onEditChannel = row => {
    dialog.value.show(row, 'edit')
  }
  // 删除分类点击事件
  const onDelChannel = async id => {
    await ElMessageBox.confirm('真要删除我吗QAQ?', '删除', {
      confirmButtonText: '是的',
      cancelButtonText: '再想想',
      type: 'warning'
    })
    await artDelChannelService(id)
    getChannelList()
  }
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            circle
            plain
            @click="onEditChannel(row)"
          >
          </el-button>
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="onDelChannel(row.id)"
            circle
            plain
          >
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="什么都没找到哦" />
      </template>
    </el-table>
  </page-container>
  <channel-edit ref="dialog"></channel-edit>
</template>
