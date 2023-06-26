<template>
  <div class="mod-ad">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="请选择模块页" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>查询</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="navigateName"
        header-align="center"
        align="center"
        label="模块页">
      </el-table-column>
      <el-table-column
        prop="position"
        header-align="center"
        align="center"
        label="位置">
      </el-table-column>
      <el-table-column
        prop="change"
        header-align="center"
        align="center"
        label="是否切屏">
      </el-table-column>
      <el-table-column
        prop="nums"
        header-align="center"
        align="center"
        label="广告条数">
      </el-table-column>
      <el-table-column
        prop="sorted"
        header-align="center"
        sortable="custom"
        align="center"
        label="排序(升序)">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:ad:update')"  @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">配置</el-button>
          <el-button v-if="isAuth('sys:ad:list')"  @click="adPreviewHandle(scope.row.id)" type="text" size="small">预览</el-button>
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
    <!-- 弹窗, 新增 / 修改  -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
     <!-- 预览 -->
    <ad-preview v-if="adPreviewVisible" ref="adPreview"></ad-preview>
  </div>
</template>
<script>
  import mixinViewModule from '@/mixins/view-module'
  import AddOrUpdate from './ad-add-or-update'
  import AdPreview from './ad-preview'
  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/ad/list',
          getDataListIsPage: true
        },
        adPreviewVisible: false,
        dataForm: {
          title: ''
        }
      }
    },
    components: {
      AddOrUpdate,
      AdPreview
    },
    methods: {
      adPreviewHandle(id) {
        this.adPreviewVisible = true
        this.$nextTick(() => {
          this.$refs.adPreview.init(id)
        })  
      }
    },
  }
</script>
<style>
    
</style>