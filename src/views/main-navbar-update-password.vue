<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('updatePassword.title')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item :label="$t('updatePassword.username')">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item prop="password" :label="$t('updatePassword.password')">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('updatePassword.password')" show-password></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" :label="$t('updatePassword.newPassword')">
        <el-input v-model="dataForm.newPassword" type="password" :placeholder="$t('updatePassword.newPassword')" show-password></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" :label="$t('updatePassword.confirmPassword')">
        <el-input v-model="dataForm.confirmPassword" type="password" :placeholder="$t('updatePassword.confirmPassword')" show-password></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { clearLoginInfo, doEncrypt } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    dataRule () {
      var validatePasswordStrength = (rule, value, callback) => {
        if (!/^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/.test(value)) {
          return callback(new Error(this.$t('updatePassword.validate.passwordStrength')))
        }
        callback()
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          return callback(new Error(this.$t('updatePassword.validate.confirmPassword')))
        }
        callback()
      }
      return {
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validatePasswordStrength, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validatePasswordStrength, trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        var password = doEncrypt(this.dataForm.password)
        var newPassword = doEncrypt(this.dataForm.newPassword)
        this.$http.put('/sys/user/password', {password, newPassword}).then(({data}) => {
          if(data && data.code === 0){
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                clearLoginInfo()
                this.$router.replace({ name: 'login' })
              }
            })
          }else {
            this.$message.error(data.message)
          }
        }).catch(() => {})
      })
    }, 3000, { 'leading': true, 'trailing': false })
  }
}
</script>
