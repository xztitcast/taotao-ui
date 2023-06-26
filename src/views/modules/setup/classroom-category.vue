<template>
    <div class="mod-classroom:category-category">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="类目名称">
          <el-input v-model="dataForm.name" placeholder="请输入类目名称" :maxlength="6" prefix-icon="el-icon-s-flag" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>查询</el-button>
          <el-button v-if="isAuth('sys:classroom:category:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-plus" plain round>新增</el-button>
          <el-button v-if="isAuth('sys:classroom:category:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>批量删除</el-button>
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
          label="类目名称">
        </el-table-column>
        <el-table-column
          prop="updated"
          header-align="center"
          sortable="custom"
          align="center"
          label="操作时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="updateName"
          header-align="center"
          align="center"
          label="操作人">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:classroom:category:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button v-if="isAuth('sys:classroom:category:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small">删除</el-button>
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
    import AddOrUpdate from './classroom-category-add-or-update'
    export default {
      mixins: [mixinViewModule],
      data() {
        return {
          mixinViewModuleOptions: {
            getDataListURL: '/sys/classroom/category/list',
            getDataListIsPage: true,
            deleteURL: '/sys/classroom/category/delete',
            deleteIsBatch: true,
          },
          dataForm: {
            name: ''
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