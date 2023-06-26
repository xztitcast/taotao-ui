<template>
  <div class="mod-navigate">
    <div class="iphonebox" style="margin: 0 auto">
        <div class="topbox">
          <el-select v-model="dataForm.type" placeholder="选择布局终端" @change="init">
            <el-option label="小程序" :value="1"></el-option>
            <el-option label="安卓" :value="2"></el-option>
            <el-option label="IOS" :value="3"></el-option>
          </el-select>
        </div>
        <div class="centerbtn" v-if="isAuth('sys:layout:save')" @click="colorSetupHandle()">文字颜色设置</div>
        <div class="bottombox">
          <div class="bottomboxlist" v-for="navigate in navigateList" :key="navigate.id">
            <div class="deletebtn" @click="layoutNavigateDeleteHandle(navigate)">删除</div>
            <el-image :src="navigate.defaultIcon" @click="layoutNavigateHandle(navigate.id)" slot="reference">
              <div slot="error" class="image-slot"   @click="layoutNavigateHandle(navigate.id)">
                  <i class="el-icon-full-screen"></i>
              </div>
            </el-image>
            <div class="nametitle" v-if="navigate.special==1">{{navigate.navigateName}}</div>
            <div class="nametitle" v-if="navigate.special==2">扫一扫</div>
          </div>
          <div class="addbtn" v-if="navigateList.length < 5 && dataForm.id" @click="layoutNavigateHandle()">+</div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="table-page col-table-page clearfix">
          <template>
            <el-dialog
              :title="!dataForm.id ? '新增' : '修改'"
              :close-on-click-modal="false"
              :visible.sync="visible">
              <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="150px">
                <el-form-item  prop="color" label="文字默认颜色:">
                    <div class="block">
                        <el-color-picker v-model="dataForm.color"></el-color-picker>
                    </div>
                </el-form-item>
                <el-form-item  prop="selectedColor" label="文字选中时的颜色:">
                    <div class="block">
                        <el-color-picker v-model="dataForm.selectedColor"></el-color-picker>
                    </div>
                </el-form-item>
                <el-form-item  prop="backgroundColor" label="背景色:">
                    <div class="block">
                        <el-color-picker v-model="dataForm.backgroundColor"></el-color-picker>
                    </div>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
                <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">确定</el-button>
              </span>
            </el-dialog>
          </template>
        </div>
      </div>
      <layout-navigate v-if="layoutNavigateVisible" ref="layoutNavigate" @refreshDataList="init"></layout-navigate>
  </div>
</template>
<script>
  import LayoutNavigate from './layout-navigate'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        layoutNavigateVisible: false,
        navigateList: [],
        dataForm: {
          id: null,
          color: '',
          type: 1,
          selectedColor: '',
          backgroundColor: ''
        },
        dataRule: {
          color: [
                {required: true, message: this.$t('validate.required'), trigger: 'change'}
            ],
            selectedColor: [
                {required: true, message: this.$t('validate.required'), trigger: 'change'}
            ],
            backgroundColor: [
                {required: true, message: this.$t('validate.required'), trigger: 'change'}
            ]
        }
      }
    },
    created() {
      this.init()
    },
    components:{
      LayoutNavigate
    },
    methods: {
      init () {
        this.$http.get(`/sys/layout/select/${this.dataForm.type}`).then(({data}) => {
          if(data && data.code === 0 && data.result){
            this.dataForm = {
              ...this.dataForm,
              ...data.result
            }
          }else {
            this.dataForm.id = null
            this.dataForm.color = ''
            this.dataForm.selectedColor = ''
            this.dataForm.backgroundColor = ''
          }
        }).then(() => {
          if(this.dataForm.id) {
            this.$http.get('/sys/layout/navigate/list/', {
              params: {layoutId : this.dataForm.id}
            }).then(({data}) => {
              if(data && data.code === 0){
                this.navigateList = data.result || []
              }
            })
          }else {
            this.navigateList = []
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/layout/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm = {
              ...this.dataForm,
              ...data.result
            }
          }else {
            this.$message.error(data.msg)
          }
        })
      },
      colorSetupHandle() {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      layoutNavigateHandle(id) {
        this.layoutNavigateVisible = true
        this.$nextTick(() => {
          this.$refs.layoutNavigate.dataForm.id = id
          this.$refs.layoutNavigate.dataForm.layoutId = this.dataForm.id
          this.$refs.layoutNavigate.init()
        })
      },
      layoutNavigateDeleteHandle(navigate) {
        this.$confirm(`确定删除[${navigate.navigateName}]导航吗？`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: 'warning'
        }).then(() => {
          this.$http.delete('/sys/layout/navigate/delete', {
            "data": [navigate.id]
          }).then(({data}) => {
            if(data && data.code === 0){
              this.$message({
                message: this.$t('prompt.success'),
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.init()
                }
              })
            }else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/layout/${this.dataForm.id ? 'update' : 'save'}`,{
              ...this.dataForm
            }).then(({data}) => {
              if(data && data.code === 0){
                this.$message({
                  message: this.$t('prompt.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.init()
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
<style lang="scss">
  .mod-navigate {
    .iphonebox {
      position: relative;
      width: 385px;
      height: 700px;
      border-radius: 20px;
      border: 1px solid #cfcfcf;
      box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
    }

    .iphoneboxs {
      position: relative;
      background: #f1f6f8;
      width: 385px;
      height: 650px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .topbox{
      font-size: 16px;
      padding: 10px 0;
      text-align: center;
      background: #ebebeb;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      color: #333333;
    }

    .centerbtn{
      cursor: pointer;
      position: absolute;
      left: 0;
      right: 0;
      bottom:0;
      top: 0;
      margin: auto;
      background: #0080FF;
      color: #FFFFFF;
      border-radius: 5px;
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
    }
    .bottombox{
      width: 100%;
      padding: 5px 0;

      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      border-top: 1px solid #cfcfcf;
      display: flex;
      justify-content:space-around;
    }
    .bottomboxlist{
      position: relative;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      text-align: center;
    }
    .bottomboxlist img{
      width: 35px;
      height: 35px;
    }
    .addbtn{
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 35px;
      border: 1px solid #cfcfcf;
      cursor: pointer;
      font-size: 30px;
    }
    .deletebtn{
      cursor: pointer;
      position: absolute;
      left: 0;
      right: 0;
      top: -25px;
      margin: auto;
      color: #0080FF;
    }    
    .el-image {
      margin: 0 auto;
    }
    .fontSelect {
      float: left;
      margin-left: 20%;
    }
    .el-icon-full-screen{
      width: 100px;
      height: 100px;
      font-size: 100px;
    }
  }
</style>