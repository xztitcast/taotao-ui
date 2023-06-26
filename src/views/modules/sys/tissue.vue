<template>
  <div class="mod-core__tissue">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="请输入机构名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>{{ $t('query') }}</el-button>
        <el-button v-if="isAuth('sys:tissue:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-plus" plain round>{{ $t('add') }}</el-button>
        <el-button v-if="isAuth('sys:tissue:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>{{ $t('deleteBatch') }}</el-button>
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
        label="机构名称">
      </el-table-column>
      <el-table-column
        prop="serials"
        header-align="center"
        align="center"
        label="机构编号">
      </el-table-column>
      <el-table-column
        prop="des"
        header-align="center"
        align="center"
        label="机构简称">
      </el-table-column>
      <el-table-column
        prop="signtime"
        header-align="center"
        align="center"
        label="签约时间">
      </el-table-column>
      <el-table-column
        prop="expiretime"
        header-align="center"
        align="center"
        label="到期时间">
      </el-table-column>
      <el-table-column
        prop="tname"
        header-align="center"
        align="center"
        label="负责人姓名">
      </el-table-column>
      <el-table-column
        prop="tphone"
        header-align="center"
        align="center"
        label="负责人电话">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:tissue:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small" >{{ $t('update') }}</el-button>
          <el-button v-if="isAuth('sys:tissue:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small" >{{ $t('delete') }}</el-button>
          <el-button v-if="isAuth('sys:tissue:wx:config:save')" @click="addTissueWxConfigHandle(scope.row.id)" type="text" size="small">微信配置</el-button>
          <el-button v-if="isAuth('sys:tissue:pay:config:save')" @click="addTissuePayConfigHandle(scope.row.id)" type="text" size="small">支付配置</el-button>
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
    <wx-config-add-or-update  v-if="wxConfigAddOrUpdateVisible" ref="wxConfigAddOrUpdate"></wx-config-add-or-update>
  </div>
</template>
<script>
  import mixinViewModule from '@/mixins/view-module'
  import AddOrUpdate from './tissue-add-or-update'
  import WxConfigAddOrUpdate from './tissue-wx-config-add-or-update'
  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/tissue/list',
          getDataListIsPage: true,
          deleteURL: '/sys/ad/tissue/delete',
          deleteIsBatch: true,
        },
        wxConfigAddOrUpdateVisible: false,
        dataForm: {
          name: ''
        }
      }
    },
    created(){
    },
    components: {
      AddOrUpdate,
      WxConfigAddOrUpdate
    },
    methods: {
      addTissueWxConfigHandle(id) {
        this.wxConfigAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.wxConfigAddOrUpdate.dataForm.id = id
          this.$refs.wxConfigAddOrUpdate.init()
        })
      },
      addTissuePayConfigHandle(id) {

      },
    },
  }
</script>
<style>
    
</style>