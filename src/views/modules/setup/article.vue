<template>
    <div class="mod-article">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="资讯标题">
          <el-input v-model="dataForm.title" placeholder="请输入资讯标题" :maxlength="20" prefix-icon="el-icon-s-flag" clearable></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="dataForm.author" placeholder="请输入作者" :maxlength="4" prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dataForm.status" placeholder="请选择状态" prefix-icon="el-icon-star-off" clearable>
            <el-option label="待发布" :value="1"></el-option>
            <el-option label="已发布" :value="2"></el-option>
            <el-option label="已下架" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>查询</el-button>
          <el-button v-if="isAuth('sys:article:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-plus" plain round>新增</el-button>
          <el-button v-if="isAuth('sys:article:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table 
        border
        :data="dataList"
        v-loading="dataListLoading"
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="created"
          header-align="center"
          sortable="custom"
          align="center"
          label="创建时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="author"
          header-align="center"
          align="center"
          label="作者">
        </el-table-column>
        <el-table-column
          prop="pushTime"
          header-align="center"
          align="center"
          sortable="custom"
          width="120"
          label="发布时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="updateName"
          header-align="center"
          align="center"
          label="操作人">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="warning">待发布</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.status === 3" type="info">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:article:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button v-if="isAuth('sys:article:top') && scope.row.top === 0" @click="articleTopHandle(scope.row, 1)" type="text" size="small">置顶</el-button>
            <el-button v-if="isAuth('sys:article:top') && scope.row.top === 1" @click="articleTopHandle(scope.row, 0)" type="text" size="small">取消置顶</el-button>
            <el-button v-if="isAuth('sys:article:hot') && scope.row.hot === 0" @click="articleHotHandle(scope.row, 1)" type="text" size="small">设为热门</el-button>
            <el-button v-if="isAuth('sys:article:hot') && scope.row.hot === 1" @click="articleHotHandle(scope.row, 0)" type="text" size="small">取消热门</el-button>
            <el-button v-if="isAuth('sys:article:change') && scope.row.status === 1 || scope.row.status === 3" @click="articleChangeHandle(scope.row, 2)" type="text" size="small">上架</el-button>
            <el-button v-if="isAuth('sys:article:change') && scope.row.status === 2" @click="articleChangeHandle(scope.row, 3)" type="text" size="small">下架</el-button>
            <el-button v-if="isAuth('sys:article:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </template>
  <script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './article-add-or-update'
    export default {
      mixins: [mixinViewModule],
      data() {
        return {
          mixinViewModuleOptions: {
            getDataListURL: '/sys/article/list',
            getDataListIsPage: true,
            deleteURL: '/sys/article/delete',
            deleteIsBatch: true,
          },
          dataForm: {
            title: '',
            author: '',
            status: null
          }
        }
      },
      components: {
        AddOrUpdate
      },
      methods: {
        articleTopHandle(row, top) {
          this.$confirm(`${top ? '确定是否置顶' : '确定是否取消置顶'}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/sys/article/top', {
              "id": row.id,
              "top": top
            }).then(({data}) => {
              if(data && data.code === 0){
                this.getDataList()
              }else{
                this.$message.error(data.message)
              }
            })
          })
        },
        articleHotHandle(row, hot) {
          this.$confirm(`${hot ? '确定是否设为热门' : '确定是否取消设为热门'}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/sys/article/hot', {
              "id": row.id,
              "hot": hot
            }).then(({data}) => {
              if(data && data.code === 0){
                this.getDataList()
              }else{
                this.$message.error(data.message)
              }
            })
          })
        },
        articleChangeHandle(row, status) {
          this.$confirm(`${status === 2? '确定是否上架' : '确定是否下架'}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/sys/article/change', {
              "id": row.id,
              "status": status
            }).then(({data}) => {
              if(data && data.code === 0){
                this.getDataList()
              }else{
                this.$message.error(data.message)
              }
            })
          }) 
        },
      },
    }
  </script>
  <style>
  
  </style>