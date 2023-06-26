<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item
        v-for="(content, index) in dataForm.contents"
        :label="'域名' + index"
        :key="content.key"
        :prop="'contents.' + index + '.value'"
        :rules="{
          required: true, message: '必选项不能为空', trigger: 'blur'
        }">
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dataForm: {
          contents: [{
            label: '请输入内容',
            value: ''
          },{
            label: '排序',
            value: ''
          }],
        }
      }
    },
  }
</script>
<style>
    
</style>