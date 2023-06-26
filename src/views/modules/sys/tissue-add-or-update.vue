<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="150px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="serials">
        <el-input v-model="dataForm.serials" placeholder="请输入编号" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="des">
        <el-input v-model="dataForm.des" placeholder="请输入简称" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="Logo" prop="logos">
        <el-input v-model="dataForm.logos" placeholder="请输入LOGO" :maxlength="120"></el-input>
      </el-form-item>
      <el-form-item label="服务电话" prop="phones">
        <el-input v-model="dataForm.phones" placeholder="请输入服务电话" :maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="tname">
        <el-input v-model="dataForm.tname" placeholder="请输入负责人姓名" :maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="tphone">
        <el-input v-model="dataForm.tphone" placeholder="请输入负责人电话" :maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="机构位置" prop="selectKeys">
        <el-cascader ref="regionTreeList" :options="regionTreeList" v-model="dataForm.selectKeys" clearable></el-cascader>
        <el-tag type="warning" style="margin-left: 40px">省/市/区、县</el-tag>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="请输入详细地址" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="签约时间" prop="signtime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.signtime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="到期时间" prop="expiretime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.expiretime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="账号关联">
        <el-tree
          :data="userList"
          :props="{ label: 'username', children: 'children' }"
          node-key="id"
          ref="userListTree"
          accordion
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">{{ $t('cancel') }}</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { treeDataTranslate } from '@/utils'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        visible: false,
        userList: [],
        regionTreeList: [],
        dataForm: {
          id: null,
          name: '',
          serials: '',
          des:'',
          logos: '',
          phones: '',
          tname: '',
          tphone:'',
          address: '',
          signtime: '',
          expiretime: '',
          selectKeys: [],
          userIdList: []
        },
      }
    },
    computed:{
      dataRule() {
        var validateDateTime = (rule, value, callback) => {
          if(this.dataForm.signtime && this.dataForm.signtime > value){
            return callback(new Error("签约时间不能大于结束时间"))
          }
          callback()
        }
        return {
          name: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          serials: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          des: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          phones: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          tname: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          tphone: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          selectKeys: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          address: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          signtime: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          expiretime: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' },
            { validator: validateDateTime, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.userListTree.setCheckedKeys([])
          Promise.all([
            this.getUserList(),
            this.getRegion()
          ]).then(() => {
            if (this.dataForm.id) {
              this.getInfo()
            }
          })
        })
      },
      getRegion(){
        this.$http.get('/sys/region/select').then(({data}) => {
          if(data && data.code === 0){
            this.regionTreeList = data.result
          }else{
            this.$message.error(data.msg)
          }
        })
      },
       // 获取用户列表
      getUserList () {
        return this.$http.get('/sys/user/tree').then(({data}) => {
          if(data && data.code === 0){
            this.userList = treeDataTranslate(data.result)
          }else{
            this.$message.error(data.msg)
          }
        }).catch(() => {})
      },
      getInfo(){
        this.$http.get(`/sys/tissue/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.name = data.result.name,
            this.dataForm.serials = data.result.serials,
            this.dataForm.des = data.result.des,
            this.dataForm.logos = data.result.logos,
            this.dataForm.phones = data.result.phones,
            this.dataForm.tname = data.result.tname,
            this.dataForm.tphone = data.result.tphone,
            this.dataForm.address = data.result.address,
            this.dataForm.signtime = data.result.signtime,
            this.dataForm.expiretime = data.result.expiretime,
            this.dataForm.selectKeys = [data.result.pid, data.result.cid, data.result.areaId]
            this.dataForm.userIdList = data.result.userIdList.forEach(element => this.$refs.userListTree.setChecked(element, true));
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        if(this.dataForm.selectKeys == null || this.dataForm.selectKeys.length !== 3){
          return this.$message.error("请选择省、市、区")
        }
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/tissue/${this.dataForm.id ? 'update' : 'save'}`,{
              "id": this.dataForm.id,
              "name": this.dataForm.name,
              "serials": this.dataForm.serials,
              "des": this.dataForm.des,
              "logos": this.dataForm.logos,
              "phones": this.dataForm.phones,
              "tname": this.dataForm.tname,
              "tphone": this.dataForm.tphone,
              "pid": this.dataForm.selectKeys[0],
              "cid": this.dataForm.selectKeys[1],
              "areaId": this.dataForm.selectKeys[2],
              "address": this.dataForm.address,
              "signtime": this.dataForm.signtime,
              "expiretime": this.dataForm.expiretime,
              "userIdList": [...this.$refs.userListTree.getHalfCheckedKeys(), ...this.$refs.userListTree.getCheckedKeys()]
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