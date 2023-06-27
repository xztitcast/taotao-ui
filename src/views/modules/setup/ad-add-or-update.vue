<template>
  <el-dialog
    title="配置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="560px"
    center>
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <div v-for="(item, index) in dataForm.adContentIdList" :key="index">
        <el-form-item
          :label="'配置广告' + (index + 1)"
          :prop="'adContentIdList.' + index + '.adContentId'"
          :rules="{ 
            required: true, message: '必选项不能为空', trigger: 'blur'
          }">
          <el-select v-model="item.adContentId" placeholder="请选择" @change="selectChangeHandle(item.adContentId, index)">
            <el-option 
              v-for="option in options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled">
            </el-option>
          </el-select>
          <el-button @click.prevent="removeFormItemHandle(item)" type="warning" style="margin-left: 10px" icon="el-icon-delete" plain round>删除</el-button>
        </el-form-item>
        <el-form-item
          label="排序(升序)"
          :prop="'adContentIdList.' + index + '.sorted'"
          :rules="{ 
            required: true, message: '必选项不能为空', trigger: 'blur'
          }">
          <el-input-number v-model="item.sorted" :min="0" :max="999" :step="1"></el-input-number>
      </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addFormItemHandle()" type="success" icon="el-icon-plus">新增</el-button>
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { sync } from 'glob'
import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        options: [],
        disabledQueue: [],
        dataForm: {
          adContentIdList: [{
            adContentId: null,
            sorted: 0
          }],
          id: null,
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getSelector().then(()=> {
            if (this.dataForm.id) {
              this.getInfo()
            }
          })
        })
      },
      getInfo(){
        this.$http.get(`/sys/ad/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.adContentIdList = data.result || [{adContentId: null,sorted: 0}]
            for(var index in this.dataForm.adContentIdList) {
              this.selectChangeHandle(this.dataForm.adContentIdList[index].adContentId, index)
            }
          }else {
            this.$message.error(data.message)
          }
        })
      },
      getSelector(){
        return this.$http.get('/sys/ad/content/selector').then(({data}) => {
          if(data && data.code === 0){
            this.options = data.result || []
          }else {
            this.$message.error(data.message)
          }
        })
      },
      removeFormItemHandle(item) {
        if(this.dataForm.adContentIdList.length === 1){
          this.$message.error("最后一组元素不允许删除")
        }else {
          var index = this.dataForm.adContentIdList.indexOf(item)
          this.dataForm.adContentIdList.splice(index, 1)
        }
      },
      addFormItemHandle() {
        if(this.dataForm.adContentIdList.length >= 9){
          this.$message.error("最多添加9个元素")
        }else {
          this.dataForm.adContentIdList.push({
            adContentId: null,
            sorted: 1,
            key: Date.now()
          });
        }
      },
      selectChangeHandle(id, index){
        var e = this.disabledQueue[index]
        if(e){
          this.setupSelectOption(e, false)
        }
        this.disabledQueue[index] = id
        this.setupSelectOption(id, true)
      },
      setupSelectOption(id, isDisabled){
        for(var i = 0; i< this.options.length; i++){
          if(id == this.options[i].value){
            this.options[i].disabled = isDisabled
            break
          }
        }
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post('/sys/ad/save',{
              "adId": this.dataForm.id,
              "joinViewList": this.dataForm.adContentIdList
            }).then(({data}) => {
              if(data && data.code === 0){
                this.$message({
                  message: this.$t('prompt.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.disabledQueue = []
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
