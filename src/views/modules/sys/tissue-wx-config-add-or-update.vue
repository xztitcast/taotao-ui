<template>
  <el-dialog
    title="机构微信配置"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="200px">
      <el-form-item label="小程序APPID" prop="miniAppid">
        <el-input v-model="dataForm.miniAppid" placeholder="请输入小程序APPID" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="小程序密钥" prop="miniAppsecret">
        <el-input v-model="dataForm.miniAppsecret" placeholder="请输入小程序密钥" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="小程序消息服务TOKEN" prop="token">
        <el-input v-model="dataForm.token" placeholder="请输入小程序消息服务TOKEN" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="小程序消息服务AESKEY" prop="aesKey">
        <el-input v-model="dataForm.aesKey" placeholder="请输入小程序消息服务AESKEY" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="消息格式,XML或者JSON" prop="msgDataFormat">
        <el-input v-model="dataForm.msgDataFormat" placeholder="请输入消息格式,XML或者JSON" :maxlength="4"></el-input>
      </el-form-item>
      <el-form-item label="公众号APPID" prop="pubAppid">
        <el-input v-model="dataForm.pubAppid" placeholder="请输入公众号APPID" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="公众号密钥" prop="pubAppsecret">
        <el-input v-model="dataForm.pubAppsecret" placeholder="请输入公众号密钥" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="公众号回调" prop="pubCallback">
        <el-input v-model="dataForm.pubCallback" placeholder="请输入公众号回调" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
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
import { runInThisContext } from 'vm'
  export default {
    data() {
      return {
        label: null,
        visible: false,
        options: [],
        dataForm: {
          id: null,
          miniAppid: '',
          miniAppsecret: '',
          token: '',
          aesKey: '',
          pubAppid: '',
          pubAppsecret: '',
          pubCallback: '',
          status: 0,
        },
        dataRule: {
          miniAppid: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          miniAppsecret: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          status: [
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
        this.$http.get(`/sys/tissue/wx/config/info/${this.dataForm.id}`).then(({data}) => {
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
            this.$http.post('/sys/tissue/wx/config/content/saveOrUpdate',{
              "miniAppsecret": this.dataForm.miniAppsecret,
              "token": this.dataForm.token,
              "aesKey": this.dataForm.aesKey,
              "pubAppid": this.dataForm.pubAppid,
              "pubAppsecret": this.dataForm.pubAppsecret,
              "pubCallback": this.dataForm.pubCallback,
              "status": this.dataForm.status
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