<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入广告名称" :maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="广告类目" prop="categoryId">
        <el-select v-model="dataForm.categoryId" placeholder="请选择" @change="selectChangeHandle">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType">
        <el-select v-model="dataForm.jumpType" placeholder="请选择">
          <el-option label="内部小程序" :value="1"></el-option>
          <el-option label="外部小程序" :value="2"></el-option>
          <el-option label="H5" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APPID" prop="jumpAppid" v-if="dataForm.jumpType === 2">
        <el-input v-model="dataForm.jumpAppid" placeholder="请输入APPID" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="页面路径" prop="jumpUrl">
        <el-input v-model="dataForm.jumpUrl" placeholder="请输入页面路径" :maxlength="120"><template slot="prepend">Http://</template></el-input>
      </el-form-item>
      <el-form-item :label="label" prop="urls" v-if="this.label">
        <el-input v-model="dataForm.urls" placeholder="请输入链接地址" :maxlength="120"><template slot="prepend">Http://</template></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.startTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="结束时间" prop="startTime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="广告图" prop="pics">
        <el-upload-plus v-model="dataForm.pics"></el-upload-plus>
      </el-form-item>
      <el-form-item label="是否分享" prop="shared">
        <el-radio-group v-model="dataForm.shared">
          <el-radio :label="1" value>是</el-radio>
          <el-radio :label="0">否</el-radio>
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
  import { dateFormat } from '@/utils'
  import ElUploadPlus from '@/components/el-upload-plus'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        label: null,
        visible: false,
        options: [],
        dataForm: {
          id: null,
          name: '',
          categoryId: '',
          categoryName: '',
          jumpType: 1,
          jumpAppid: '',
          jumpUrl: '',
          urls: '',
          pics: '',
          shared: 1,
          startTime: '',
          endTime: ''
        },
        dataRule: {
          name: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          jumpType: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          jumpAppid: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          jumpUrl: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          urls: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          pics: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ]
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    components:{
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
        this.$http.get('/sys/ad/category/selector').then(({data}) => {
          if(data && data.code === 0){
            this.options = data.result
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/ad/content/info/${this.dataForm.id}`).then(({data}) => {
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
      /**
       * 选择器事件
       * @param {*} value 
       */
      selectChangeHandle(value) {
        var object = this.options.find(item => item.id === value)
        this.dataForm.categoryName = object.name
        this.label = object.label
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/ad/content/${this.dataForm.id ? 'update' : 'save'}`,{
              ...this.dataForm,
              "startTime": dateFormat(this.dataForm.startTime),
              "endTime": dateFormat(this.dataForm.endTime)
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