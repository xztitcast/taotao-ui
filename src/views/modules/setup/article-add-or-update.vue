<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" :maxlength="30" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章类目" prop="categoryId">
        <el-select v-model="dataForm.categoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="dataForm.author" :maxlength="4" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="pic">
        <el-upload-plus v-model="dataForm.pic"></el-upload-plus>
      </el-form-item>
      <el-form-item label="发布时间" prop="pushTime" v-if="dataForm.pushTime">
        <el-input v-model="dataForm.pushTime"></el-input>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <ck-editor v-model="dataForm.content"></ck-editor>
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
  import ckEditor from '@/components/CKEditor5'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        options: [],
        dataForm: {
          id: null,
          title: '',
          categoryId: '',
          author:'',
          pic: '',
          pushTime: '',
          content: ''
        },
        dataRule: {
          title: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          author: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          pic: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          content: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      ckEditor,
      ElUploadPlus
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          Promise.all([
            this.getSelector()
          ]).then(() => {
            if (this.dataForm.id) {
              this.getInfo()
            }
          })
        })
      },
      getSelector(){
        this.$http.get('/sys/article/category/selector').then(({data}) => {
          if(data && data.code === 0){
            this.options = data.result
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/article/info/${this.dataForm.id}`).then(({data}) => {
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
            this.$http.post(`/sys/article/${this.dataForm.id ? 'update' : 'save'}`,{
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
    }
  }
</script>
<style>

</style>