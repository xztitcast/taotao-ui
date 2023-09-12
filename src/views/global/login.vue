<template>
  <div class="site-wrapper site-page__login">
    <div class="site-content__wrapper">
      <main class="site-content">
        <div class="login-header">
          <h2 class="login-brand">{{ $t('brand.lg') }}</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">{{ $t('login.title') }}</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-lock"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-safetycertificate"></use></svg>
                    </span>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
            </el-form-item>
          </el-form>
          <Verify @success="successHandle" :mode="'pop'" :captchaType="getCaptchaType" :imgSize="{ width: '430px', height: '235px' }" ref="verify"></Verify>
        </div>
        <div class="login-footer">
          <p>
            <a href="" target="_blank">{{ $t('login.demo') }}</a>
          </p>
          <p><a href="" target="_blank">{{ $t('login.copyright') }}</a>2022 © org.bovine</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { getUUID, doEncrypt } from '@/utils'
import Verify from "@/components/Verifition/Verify";
export default {
  data () {
    return {
      captchaPath: '',
      dataForm: {
        username: 'admin',
        password: 'admin',
        uuid: '',
        captcha: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Verify
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = `${window.SITE_CONFIG['apiURL']}/sys/captcha.jpg?uuid=${this.dataForm.uuid}`
    },
    successHandle(param) {
      param.username = this.dataForm.username
      param.password = doEncrypt(this.dataForm.password)
      param.uuid = this.dataForm.uuid
      param.captcha = this.dataForm.captcha
      this.$http.post('/sys/login', param, { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(({ data }) => {
        if(data && data.code === 0){
          Cookies.set('token', data.result)
          this.$router.replace({ name: 'home' })
        }else {
          this.getCaptcha()
          this.$message.error(data.message)
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if(valid) {
          this.$refs.verify.show();
        }
        /*if (valid) {
          this.$http.post('/sys/login', this.dataForm).then(({ data }) => { //application/json格式请求
            if(data && data.code === 0){
              Cookies.set('token', data.result)
              this.$router.replace({ name: 'home' })
            }else {
              this.getCaptcha()
              this.$message.error(data.message)
            }
          }).catch(() => {})
          var password = doEncrypt(this.dataForm.password)
          var param = { username: this.dataForm.username,uuid: this.dataForm.uuid, captcha: this.dataForm.captcha, password }
          this.$http.post('/sys/login', param, { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).then(({ data }) => {
            if(data && data.code === 0){
              Cookies.set('token', data.result)
              this.$router.replace({ name: 'home' })
            }else {
              this.getCaptcha()
              this.$message.error(data.message)
            }
          }).catch(() => {})
        }*/
      })
    }, 3000, { 'leading': true, 'trailing': false })
  }
}
</script>
