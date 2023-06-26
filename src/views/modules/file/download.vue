<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-sys__download">
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
          prop="url"
          header-align="center"
          align="center"
          label="下载路径">
        </el-table-column>
        <el-table-column
          prop="created"
          header-align="center"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updated"
          header-align="center"
          align="center"
          label="更新时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadHandle(scope.row.url)">下载</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    </div>
  </el-card>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module'
  export default {
    mixins: [mixinViewModule],
    data () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/download/list',
          getDataListIsPage: true,
          deleteURL: '/sys/download/delete',
          deleteIsBatch: true,
        }
      }
    }
  }
</script>