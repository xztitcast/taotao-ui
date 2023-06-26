<template>
  <div class="mod-protocol">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="240px">
      <el-form-item label="客服电话" prop="sphone">
        <el-input v-model="dataForm.sphone" placeholder="请输入客服电话"></el-input>
      </el-form-item>
      <el-form-item label="人工客服在线时间" prop="dateArray">
        <div class="block">
          <el-date-picker
            v-model="dataForm.dateArray"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="公众号太阳码" prop="oasuncodepic">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="dataForm.oasuncodepic" :src="dataForm.oasuncodepic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="区域限制" prop="citylimitlist">
        <el-input v-model="dataForm.citylimitlist" placeholder="请选择限制的区域"></el-input>
      </el-form-item>
      <el-form-item label="平台简介" prop="aboutpf">
        <ck-editor v-model="dataForm.aboutpf"></ck-editor>
      </el-form-item>
      <el-form-item label="用户服务协议" prop="csprotool">
        <ck-editor v-model="dataForm.csprotool"></ck-editor>
      </el-form-item>
      <el-form-item label="商户入驻协议" prop="enterprotocl">
        <ck-editor v-model="dataForm.enterprotocl"></ck-editor>
      </el-form-item>
      <el-form-item label="个人隐私协议" prop="privacyprotocol">
        <ck-editor v-model="dataForm.privacyprotocol"></ck-editor>
      </el-form-item>
      <el-form-item label="商户隐私协议" prop="merchantPrivacyProtocol">
        <ck-editor v-model="dataForm.merchantPrivacyProtocol"></ck-editor>
      </el-form-item>
      <el-form-item label="会员服务协议" prop="memberprotocol">
        <ck-editor v-model="dataForm.memberprotocol"></ck-editor>
      </el-form-item>
      <el-form-item label="中国邮政储蓄银行电子账户服务协议" prop="psbcelectronicprotocol">
        <ck-editor v-model="dataForm.psbcelectronicprotocol"></ck-editor>
      </el-form-item>
      <el-form-item label="中国邮政储蓄银行YOU商街授权协议" prop="authProtocl">
        <ck-editor v-model="dataForm.authProtocl"></ck-editor>
      </el-form-item>
      <el-form-item label="中国邮政储蓄银行开户隐私协议" prop="psbcPrivacyProtocol">
        <ck-editor v-model="dataForm.psbcPrivacyProtocol"></ck-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { dateFormat } from '@/utils'
  import ckEditor from '@/components/CKEditor5'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: null,
          sphone: '',
          oasuncodepic: '',
          csprotool:'',
          enterprotocl: '',
          dateArray: [new Date(2000, 10, 11, 10, 10), new Date(2000, 10, 11, 10, 10)],
          citylimitlist: '',
          privacyprotocol: '',
          memberprotocol: '',
          psbcelectronicprotocol: '',
          aboutpf: '',
          authProtocl: '',
          psbcPrivacyProtocol: '',
          numberWalletProtocol: '',
          merchantPrivacyProtocol: ''
        },
        dataRule: {
          
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        
      }
    },
    components: {
      ckEditor
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
        this.$http.get(`/sys/tissue/config/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.id = data.result.id
            this.dataForm.sphone = data.result.sphone
            this.dataForm.oasuncodepic = data.result.oasuncodepic
            this.dataForm.csprotool = data.result.csprotool
            this.dataForm.enterprotocl = data.result.enterprotocl
            this.dataForm.dateArray = [data.result.stimestart, dataresult.stimeend]
            this.dataForm.citylimitlist = data.result.citylimitlist
            this.dataForm.privacyprotocol = data.result.privacyprotocol
            this.dataForm.memberprotocol = data.result.memberprotocol
            this.dataForm.psbcelectronicprotocol = data.result.psbcelectronicprotocol
            this.dataForm.aboutpf = data.result.aboutpf
            this.dataForm.authProtocl = data.result.authProtocl
            this.dataForm.psbcPrivacyProtocol = data.result.psbcPrivacyProtocol
            this.dataForm.numberWalletProtocol = data.result.numberWalletProtocol
            this.dataForm.merchantPrivacyProtocol = data.result.merchantPrivacyProtocol
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.dataForm.oasuncodepic = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/tissue/config/${this.dataForm.id ? 'update' : 'save'}`,{
              "id": this.dataForm.id,
              "sphone": this.dataForm.sphone,
              "oasuncodepic": this.dataForm.oasuncodepic,
              "csprotool": this.dataForm.csprotool,
              "enterprotocl": this.dataForm.enterprotocl,
              "stimestart": dateFormat(this.dataForm.dateArray[0]),
              "stimeend": dateFormat(this.dataForm.dateArray[1]),
              "citylimitlist": this.dataForm.citylimitlist,
              "privacyprotocol": this.dataForm.privacyprotocol,
              "memberprotocol": this.dataForm.memberprotocol,
              "psbcelectronicprotocol": this.dataForm.psbcelectronicprotocol,
              "aboutpf": this.dataForm.aboutpf,
              "authProtocl": this.dataForm.authProtocl,
              "psbcPrivacyProtocol": this.dataForm.psbcPrivacyProtocol,
              "numberWalletProtocol": this.dataForm.numberWalletProtocol,
              "merchantPrivacyProtocol": this.dataForm.merchantPrivacyProtocol
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
    },
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  } 
  .mod-protocol {
    width: 80%;
    margin: 0 auto;
  }
</style>