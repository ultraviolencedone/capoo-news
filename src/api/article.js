import request from '@/utils/request'
// 获得文章分类
export const artGetChannelService = () => request.get('/my/cate/list')
// 更新文章分类
export const artEditChannelService = channel =>
  request.put('/my/cate/info', channel)
// 增加文章分类
export const artAddChannelService = channel =>
  request.post('/my/cate/add', channel)
// 删除文章分类
export const artDelChannelService = id =>
  request.delete('/my/cate/del', { params: { id } })
// 获得文章列表
export const artGetListService = obj =>
  request.get('/my/article/list', {
    params: {
      pagenum: obj.pagenum,
      pagesize: 5, // 默认一页十篇文章
      cate_id: obj.cate_id,
      state: obj.state
    }
  })
// 删除文章
export const artDelService = id =>
  request.delete('/my/article/info', { params: { id } })
// 获取文章详情
export const artGetinfoService = id =>
  request.get('/my/article/info', { params: { id } })
// 发布文章
export const artAddService = formData =>
  request.post('/my/article/add', formData)
// 更新文章
export const artUpdataService = form => request.put('/my/article/info', form)
