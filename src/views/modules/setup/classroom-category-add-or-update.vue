<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="类目名称" prop="name">
        <el-input v-model="dataForm.name" :maxlength="6" placeholder="请输入类目标题"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: null,
          name: ''
        },
        dataRule: {
          name: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/classroom/category/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm = {
              ...this.dataForm,
              ...data.result
            }
          }else {
            this.$message.error(data.message)
          }
        })
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/classroom/category/${this.dataForm.id ? 'update' : 'save'}`,{
              ...this.dataForm
            }).then(({data}) => {
              if(data && data.code === 0){
                this.$message({
                  message: this.$t('prompt.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }else{
                this.$message.error(data.message)
              }
            })
          }
        })
      },1000, { 'leading': true, 'trailing': false })
    }
  }
</script>
<style>
    
</style>