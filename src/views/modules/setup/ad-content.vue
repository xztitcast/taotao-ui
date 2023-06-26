<template>
  <div class="mod-ad-content">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="请选择广告名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>查询</el-button>
        <el-button v-if="isAuth('sys:ad:content:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-plus" plain round>新增</el-button>
        <el-button v-if="isAuth('sys:ad:content:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>批量删除</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="广告名称">
      </el-table-column>
      <el-table-column
        prop="categoryId"
        header-align="center"
        align="center"
        label="广告类目">
      </el-table-column>
      <el-table-column
        prop="jumpType"
        header-align="center"
        align="center"
        label="跳转类型">
      </el-table-column>
      <el-table-column
        prop="urls"
        header-align="center"
        align="center"
        label="链接地址"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.pics"
            fit="['fill', 'contain', 'cover', 'none', 'scale-down']">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        sortable="custom"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        sortable="custom"
        label="结束时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:ad:content:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button v-if="isAuth('sys:ad:content:update')" @click="deleteHandle(scope.row.id)" type="text" size="small">删除</el-button>
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
  import AddOrUpdate from './ad-content-add-or-update'
  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/ad/content/list',
          getDataListIsPage: true,
          deleteURL: '/sys/ad/content/delete',
          deleteIsBatch: true,
        },
        dataForm: {
          tisname: '',
          title: ''
        }
      }
      
    },
    components: {
      AddOrUpdate
    }
  }
</script>
<style>
    
</style>