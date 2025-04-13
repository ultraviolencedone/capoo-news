<script setup>
  import { ref, toRef, onMounted } from 'vue'
  import { Delete, Edit } from '@element-plus/icons-vue'
  import { useArtStore } from '@/stores/modules/article'
  import { artGetListService, artDelService } from '@/api/article'
  import moment from 'moment'
  import ArtEdit from './components/ArtEdit.vue'

  const articleList = ref([])
  const channel = ref('')
  const state = ref('')
  // 总的文章数量
  const total = ref()
  // 分类表单
  const artStore = useArtStore()
  const channelList = toRef(artStore, 'channelList')
  // 文章状态选项
  const optionState = ref([
    { label: '已发布', value: '已发布' },
    { label: '草稿', value: '草稿' }
  ])
  // 请求参数对象
  const params = ref({})
  // 获取文章列表请求
  const getArtList = async params => {
    loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data.map(item => ({
      ...item,
      pub_date: moment(new Date(item.pub_date)).format('YYYY-MM-DD')
    }))
    total.value = res.data.total
    loading.value = false
  }
  // 刚进入时渲染所有
  onMounted(() => {
    params.value.pagenum = 1
    getArtList(params)
  })
  // 搜索事件
  const onSearch = () => {
    params.value.pagenum = 1
    params.value.cate_id = channel.value
    params.value.state = state.value
    getArtList(params)
  }
  // 重置事件
  const onReset = () => {
    channel.value = ''
    state.value = ''
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArtList(params)
  }
  // 绑定弹窗
  const artEditRef = ref()
  // 展示详情事件
  const onSee = row => {
    artEditRef.value.show(row, 'see')
  }
  // 编辑事件
  const onEditArticle = row => {
    artEditRef.value.show(row, 'edit')
  }
  // 添加事件
  const onAddArticle = () => {
    artEditRef.value.show({}, 'add')
  }
  // 删除事件
  const onDeleteArticle = async row => {
    await ElMessageBox.confirm('真的要删除我吗QAQ?', '删除文章', {
      confirmButtonText: '是的',
      cancelButtonText: '再想想',
      type: 'warning'
    })
    await artDelService(row.id)
    getArtList(params)
  }
  // 分页
  const pageSize = ref(5)
  const currentPage = ref(1)
  const onCurrentChange = page => {
    params.value.pagenum = page
    getArtList(params)
  }
  // 添加loading
  const loading = ref(false)
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <el-form :inline="true" class="form-inline">
      <el-form-item label="文章分类">
        <el-select v-model="channel" placeholder="请选择" clearable>
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="state" placeholder="请选择" clearable>
          <el-option
            v-for="item in optionState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="articleList"
      style="width: 100%"
      :row-style="{ height: '75px' }"
    >
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link @click="onSee(row)" type="primary" :underline="false">{{
            row.title
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <el-pagination
      v-model="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-container>
  <ArtEdit ref="artEditRef"></ArtEdit>
</template>

<style>
  .form-inline .el-select {
    --el-select-width: 220px;
  }
</style>
