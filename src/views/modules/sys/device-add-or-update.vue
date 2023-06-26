<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="resetFieldHandle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="dataForm.name" :maxlength="50" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="密钥" prop="key">
        <el-input v-model="dataForm.key" readonly></el-input>
      </el-form-item>
      <el-form-item label="盐" prop="slat">
        <el-input v-model="dataForm.slat" readonly></el-input>
      </el-form-item>
      <el-form-item label="关联机构" prop="tisid">
        <el-select v-model="dataForm.tisid" placeholder="请选择" @change="selectChangeHandle">
          <el-option :label="1" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提示:">
        <span style="color: red">密钥和盐生成后将不再显示请及时复制出来交付给前后端研发人员</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { AESEncrypt, randomStr } from '@/utils'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        options: [],
        dataForm: {
          id: null,
          name: '',
          key: '',
          slat: '',
          tisid: null,
          tisname: '',
        },
        dataRule: {
          name: [
            { required: true, message: "公司名称不能为空", trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.key = randomStr(16)
          this.dataForm.slat = randomStr(16)
        })
      },
      /**
       * 选择器事件
       * @param {*} value 
       */
      selectChangeHandle(value) {
        var object = this.options.find(item => item.value === value)
        this.tisname = object.label
      },
      resetFieldHandle(){
        this.dataForm = this.$options.data().dataForm
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post('/sys/estate/save',{
              "name": this.dataForm.name,
              "key": AESEncrypt(this.dataForm.key),
              "slat": AESEncrypt(this.dataForm.slat),
              "tisid": this.dataForm.tisid,
              "tisname": this.dataForm.name
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
                this.$message.error(data.msg)
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