<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="150px">
      <el-form-item prop="special" label="类型:">
          <el-radio-group v-model="dataForm.special">
              <el-radio :label="1" style="margin-left: 10px">页面</el-radio>
              <el-radio :label="2" style="margin-left: 10px">扫一扫</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item prop="navigateName" label="导航名称:" v-if="dataForm.special==1">
          <el-input v-model="dataForm.navigateName" placeholder="导航名称最多8个字" :maxlength="8"></el-input>
      </el-form-item>
      <el-form-item  prop="sorted" label="序号:">
        <el-input-number v-model.number="dataForm.sorted" :min="0" :max="9999"></el-input-number>
      </el-form-item>
      <el-form-item  prop="selectIcon" label="选中图片:" v-if="dataForm.special==1">
        <el-upload-plus v-model="dataForm.selectIcon"></el-upload-plus>
      </el-form-item>
      <el-form-item prop="defaultIcon" label="默认图片:">
        <el-upload-plus v-model="dataForm.defaultIcon"></el-upload-plus>
      </el-form-item>
      <el-form-item prop="pagePath" label="页面:" v-if="dataForm.special==1">
        <el-radio-group v-model="dataForm.pagePath" v-for="path in navigatePahtList" :key="path.id">
          <el-radio :label="path.navigatePath" style="margin-left: 10px">
            {{path.navigateName}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="pagePath" label="页面路径:" v-if="dataForm.special==1">
        <el-input v-model="dataForm.pagePath" disabled></el-input>
      </el-form-item>
      <el-form-item prop="pageParameters" label="页面参数:" v-if="dataForm.special==1">
        <el-input v-model="dataForm.pageParameters" placeholder="请输入页面参数" :maxlength="120"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import ElUploadPlus from '@/components/el-upload-plus'
  import debounce from 'lodash/debounce'
  export default {
    components: { ElUploadPlus },
    data() {
      return {
        visible: false,
        navigatePahtList: [],
        pathTemp: '',
        dataForm: {
          id: null,
          special: 1,
          navigateName: '',
          sorted: 1,
          selectIcon: '',
          defaultIcon: '',
          pagePath: '',
          pageParameters: '',
          layoutId: null
        },
        dataRule: {
          special: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ],
          navigateName: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ],
          sorted: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ],
          selectIcon: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ],
          defaultIcon: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ],
          pagePath: [
            {required: true, message: this.$t('validate.required'), trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          Promise.all([
            this.getNavigatePath()
          ]).then(() => {
            if (this.dataForm.id) {
              this.getInfo()
            }
          })
        })
      },
      getNavigatePath() {
        this.$http.get('/sys/layout/navigate/path').then(({data}) => {
          if(data && data.code === 0){
            this.navigatePahtList = data.result || []
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/layout/navigate/info/${this.dataForm.id}`).then(({data}) => {
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
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/layout/navigate/${this.dataForm.id ? 'update' : 'save'}`,{
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
    
</style>