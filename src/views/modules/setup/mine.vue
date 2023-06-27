<template>
  <div class="mod-mine">
    <div id="iphonemodel">
      <div class="iphonebox">
        <div class="addmaskboxs" v-if="maskAdd">
          <div class="addmodelbox">
            <p class="addmodelboxtitle">新增模块</p>
            <div class="addmodelboxform">
                <div><span class="bitian" style="color: red">*</span>模块名称:</div>
                <input placeholder="请输入模块名称" v-model="dataModuleForm.name" :maxlength="6">
            </div>
            <div class="addmodelboxform">
                <input type="file" class="addmodelfile">
                <div class="addmodelboxform" style="margin-right: 40px; height: 58px;line-height: 58px;">
                  <span class="bitian" style="color: red">*</span>
                  图标:
                </div>
                <el-upload-plus v-model="dataModuleForm.icon"></el-upload-plus>
            </div>
            <div class="addmodelboxform">
              <div><span class="bitian" style="color: red">*</span>页面路径:</div>
              <input placeholder="请输入页面路径" v-model="dataModuleForm.url" :maxlength="120">
            </div>
            <div class="addmodelboxbottom">
              <div>
                <el-button @click="dataModuleFormSubmitHandle()" type="primary" icon="el-icon-check" plain>确认</el-button>
              </div>
              <div>
                <el-button @click="cancelMineModuleHandle()" type="info" icon="el-icon-close" plain>取消</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="maskboxs" v-show="maskbox" >
          <div class="maskboxstop" @click="maskAdd = true">新增</div>
          <div style="width: 100%;">
              <p class="maskboxstoptitle">选择模块</p>
              <div class="maskboxscenter" >
                <div class="maskboxscenterlist" >
                  <div class="maskboxscenterlisticon"
                    v-for="item in mineModuleList" :key="item.id"
                    @click="choiceMineModuleHandle(item.id)">
                    <img :src="item.icon">
                    <div>{{item.name}}</div>
                    <div class="iconclose iconcloses2" @click.stop="editMineModuleHandle(item.id)">
                      <i class="el-icon-edit"></i>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="maskboxsbottom" @click="maskbox = false" style="margin-top: 500px;">返回</div>
        </div>
        <div class="iphoneboxs" v-show="!maskbox">
          <div class="topbox" :style="{backgroundImage: `url(${dataMineForm.topbox ? dataMineForm.topbox : defaultTopbox})`}">
            <div class="userimgbox"></div>
            <div class="pnhonenum">
                <div>乌干达分达</div>
                <div>188****8888</div>
            </div>
            <div class="rightbox">
              <div class="vipbox">
                  <div class="viptitle">会员中心</div>
                  <div v-if="dataMineForm.member==1" class="vipboxbtn" @click="commentUpdateHandle({'member': 2})">隐藏</div>
                  <div v-if="dataMineForm.member==2" class="vipboxbtn" @click="commentUpdateHandle({'member': 1})">显示</div>
              </div>
              <div class="addmodelbtn">
                  <div class="addicon" @click="visible = true">+</div>
                  <div class="addtitles">
                      <div>背景设置</div>
                      <div>尺寸690*230</div>
                  </div>
              </div>
              <div>
                <el-dialog
                  center
                  title="新增背景图片"
                  width="15%"
                  :visible.sync="visible"
                  :close-on-click-modal="false">
                  <div class="addmodelboxform">
                    <div style="font-weight: bold;"><span class="bitian" style="color: red;">*</span>背景图:</div>
                    <el-upload-plus v-model="dataMineForm.topbox" style="margin: auto"></el-upload-plus>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dataMineFormSubmitHandle()" type="primary" icon="el-icon-check" plain>确定</el-button>
                    <el-button @click="visible = false" type="info" icon="el-icon-close" plain>取消</el-button>
                  </div>
                </el-dialog> 
              </div>
            </div>
          </div>
          <div class="cententbox">
            <div class="fromlistbox" v-for="area in minArealist" :key="area.id">
              <div class="iconcloses" @click="addOrUpdateHandle({'id': area.id, 'status': 1})">删除</div>
              <input placeholder="请输入模块标题" v-model="area.title" class="fromlistboxinput" @blur="addOrUpdateHandle(area)" :maxlength="5">
              <div class="iconlistbox justconte">
                <div class="iconlist" v-for="item in area.minModuleList" :key="item.id">
                  <img :src="item.icon">
                  <div>{{item.name}}</div>
                  <div class="iconclose" @click="deleteIconHandle({'areaId': area.id, 'moduleId': item.id})">x</div>
                </div>
                <div class="iconlist" v-if="!area.minModuleList || area.minModuleList.length != 12">
                  <div class="iconlistadd" @click="currentSelectedAreaId = area.id; addMineModuleIconHandle()">+</div>
                </div>
              </div>
            </div>
            <div class="addmodels" @click="addOrUpdateHandle({'mineId': dataMineForm.id})" v-if="this.minArealist.length < 3">+添加区域</div>
            <div class="bottombox">
              <div class="bottomboxlist justconte">
                <div>常见问题解答</div>
                <div v-if="dataMineForm.problem==1" class="sorf" @click="commentUpdateHandle({'problem': 2})">隐藏</div>
                <div v-if="dataMineForm.problem==2" class="sorf" @click="commentUpdateHandle({'problem': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>我的特权码</div>
                <div v-if="dataMineForm.privilegeCode==1" class="sorf" @click="commentUpdateHandle({'privilegeCode': 2})">隐藏</div>
                <div v-if="dataMineForm.privilegeCode==2" class="sorf" @click="commentUpdateHandle({'privilegeCode': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>客服微信</div>
                <div v-if="dataMineForm.customer==1" class="sorf" @click="commentUpdateHandle({'customer': 2})">隐藏</div>
                <div v-if="dataMineForm.customer==2" class="sorf" @click="commentUpdateHandle({'customer': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>关于我们</div>
                <div v-if="dataMineForm.aboutUs==1" class="sorf" @click="commentUpdateHandle({'aboutUs': 2})">隐藏</div>
                <div v-if="dataMineForm.aboutUs==2" class="sorf" @click="commentUpdateHandle({'aboutUs': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>用户协议</div>
                <div v-if="dataMineForm.agreement==1" class="sorf" @click="commentUpdateHandle({'agreement': 2})">隐藏</div>
                <div v-if="dataMineForm.agreement==2" class="sorf" @click="commentUpdateHandle({'agreement': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>建议反馈</div>
                <div v-if="dataMineForm.feedback==1" class="sorf" @click="commentUpdateHandle({'feedback': 2})">隐藏</div>
                <div v-if="dataMineForm.feedback==2" class="sorf" @click="commentUpdateHandle({'feedback': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>数字人民币服务</div>
                <div v-if="dataMineForm.digital==1" class="sorf" @click="commentUpdateHandle({'digital': 2})">隐藏</div>
                <div v-if="dataMineForm.digital==2" class="sorf" @click="commentUpdateHandle({'digital': 1})">显示</div>
              </div>
              <div class="bottomboxlist justconte">
                <div>密码管理</div>
                <div v-if="dataMineForm.password==1" class="sorf" @click="commentUpdateHandle({'password': 2})">隐藏</div>
                <div v-if="dataMineForm.password==2" class="sorf" @click="commentUpdateHandle({'password': 1})">显示</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ElUploadPlus from '@/components/el-upload-plus'
  export default {
    components: { ElUploadPlus },
    data() {
      return {
        visible: false,
        maskAdd: false,
        maskbox: false,
        defaultTopbox: require('../../../assets/img/topimg.jpg'),
        minArealist: [],
        mineModuleList: [],
        currentSelectedAreaId: null,
        dataMineForm: {
          id: null,
          topbox: '',
          problem: 1,
          privilegeCode: 1,
          customer: 1,
          aboutUs: 1,
          agreement: 1,
          feedback: 1,
          digital: 1,
          password: 1,
          member: 1
        },
        dataModuleForm: {
          id: null,
          name: '',
          icon: '',
          url: ''
        }
      }
    },
    created() {
      this.refresh().then(() => this.getAreaList())
    },
    methods: {
      /**
       * 我的页面初始化刷新
       */
      refresh(){
        return this.$http.get('/sys/mine/info').then(({data}) => {
          if(data && data.code === 0){
            this.dataMineForm = {
              ...this.dataMineForm,
              ...data.result
            }
          }else {
            this.$message.error(data.message)
          }
        })
      },
      /**
       * 获取我的区域列表
       */
      getAreaList() {
        this.$http.get(`/sys/mine/area/select/${this.dataMineForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.minArealist = data.result || []
          }else{
            this.$message.error(data.message)
          }
        })
      },
      /**
       * 添加一个区域或者修改区域的标题
       * @param {*} e 
       */
      addOrUpdateHandle(e) {
        this.$http.post(`/sys/mine/area/${e.id ? 'update' : 'save'}`, {...e}).then(({data}) => {
          if(data && data.code === 0){
            this.getAreaList()
          }
        })
      },
      /**
       * 我的页面删除区域模块
       * @param {*} e 
       */
      deleteIconHandle(e) {
        this.$http.delete('/sys/mine/module/remove', {"data": e}).then(({data}) => {
          if(data && data.code === 0){
            this.getAreaList()
          }
        })
      },
      /**
       * 获取我的页面还未被其他区域选中的模块数据列表
       * @param {*} id  选中的区域ID
       */
      addMineModuleIconHandle() {
        this.$http.get('/sys/mine/module/list/').then(({data}) => {
          if(data && data.code === 0){
            this.mineModuleList = data.result || []
            this.maskbox = true
          }
        })
      },
      /**
       * 新增背景图
       */
      dataMineFormSubmitHandle(){
        if(!this.dataMineForm.topbox){
          return this.$message.error("必选项不能为空!")
        }
        this.$http.post('/sys/mine/update', {"id": this.dataMineForm.id, "topbox": this.dataMineForm.topbox}).then(({data}) => {
          if(data && data.code === 0){
            this.visible = false
            this.refresh()
          }else {
            this.$message.error(data.message)
          }
        })
      },
      /**
       * 我的页面通用的修改状态方法
       * @param {*} value 对象需要更新的值
       */
      commentUpdateHandle(value={}){
        this.$http.post('/sys/mine/update',{
          "id": this.dataMineForm.id,
          ...value
        }).then(({data}) => {
          if(data && data.code === 0){
            this.refresh()
          }else {
            this.$message.error(data.message)
          }
        })
      },
      /**
       * 我的页面选中对应的模块
       * @param {*} id 模块ID
       */
      choiceMineModuleHandle(id) {
        this.$http.post('/sys/mine/module/choice',{"areaId": this.currentSelectedAreaId, "moduleId": id}).then(({data}) => {
          if(data && data.code === 0){
            this.getAreaList()
            this.maskbox = false
          }else {
            this.$message.error(data.message)
          }
        })
      },
      /**
       * 我的页面编辑对应的模块
       * @param {*} id 模块ID
       */
      editMineModuleHandle(id) {
        this.dataModuleForm.id = id
        this.$http.get(`/sys/mine/module/info/${id}`).then(({data}) => {
          if(data && data.code === 0){
            this.maskAdd = true
            this.dataModuleForm.name = data.result.name
            this.dataModuleForm.icon = data.result.icon
            this.dataModuleForm.url = data.result.url
          }else {
            this.$message.error(data.message)
          }
        })
      },
      cancelMineModuleHandle(){
        this.maskAdd = false;
        this.dataModuleForm = this.$options.data().dataModuleForm
      },
      /**
       * 表单提交
       */
      dataModuleFormSubmitHandle() {
        if(!this.dataModuleForm.name || !this.dataModuleForm.icon || !this.dataModuleForm.url){
          return this.$message.error("必选项不能为空!")
        }
        this.$http.post(`/sys/mine/module/${this.dataModuleForm.id ? 'update': 'save'}`, {...this.dataModuleForm}).then(({data}) => {
          if(data && data.code === 0){
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.maskAdd = false
                this.addMineModuleIconHandle()
                this.cancelMineModuleHandle()
              }
            })
          }else{
            this.$message.error(data.message)
          }
        })
      }
    },
  }
</script>
<style lang="scss">
  .mod_mine {
    margin: 0;
    padding: 0;
  }

  #iphonemodel {
    padding-left: 500px; 
    padding-top: 20px;
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

    .topbox {
      margin-top: 15px;
      width: 345px;
      height: 115px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      padding: 15px 0;
    }

    .userimgbox {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      background-image: url(~@/assets/img/userimg.jpg);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      margin-left: 15px;
    }

    .pnhonenum {
      color: #D4C375;
      margin-left: 10px;
      line-height: 30px;
    }

    .rightbox {
      margin-left: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .addmodelbtn {
      width: 120px;
      height: 40px;
      background: #0080FF;
      line-height: 40px;
      border-radius: 5px;
      font-size: 24px;
      margin-top: 10px;
      display: flex;
      color: #FFFFFF;
      position: relative;
      cursor: pointer;
    }
    
    .addmodelbtn input{
      width: 120px;
      height: 40px;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      margin: auto;
      opacity: 0;
    }
    .vipbox {
      width: 120px;
      height: 26px;
      background: #D4C375;
      display: flex;
      font-size: 14px;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
      line-height: 26px;

    }

    .viptitle {
      width: 80px;
      height: 100%;
      text-align: center;
    }

    .vipboxbtn {
      font-size: 16px;
      width: 50px;
      height: 100%;
      text-align: center;
      background: #0080FF;
      color: #FFFFFF;
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
      cursor: pointer;
    }

    .addicon {
      margin-left: 10px;
      font-size: 30px;
    }

    .addtitles {
      font-size: 12px;
      line-height: 20px;
      flex: 1;
      text-align: center;
    }

    .cententbox {
      margin-top: 15px;
      width: 325px;
      background: #FFFFFF;
      padding: 10px;
      box-shadow: 0 5px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
      border-radius: 5px;
    }

    .fromlistbox {
      margin-bottom: 20px;
      position: relative;
    }

    .fromlistboxinput {
      display: block;
      outline: none;
      height: 30px;
      margin-bottom: 10px;
    }

    .iconlistbox {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .iconlistbox:after {
      content: "";
      flex: auto;
    }

    .iconlist {
      width: 25%;
      display: flex;
      /* justify-content: center; */
      align-items: center;
      flex-direction: column;
      margin-top: 10px;
      position: relative;
    }

    .iconlist img {
      width: 55px;
      height: 55px;
    }

    .iconlist div {
      color: #333333;
      font-size: 14px;
    }

    .iconcloses {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 18px;
      cursor: pointer;
      color: #0080FF;
    }

    .iconclose {
      position: absolute;
      top: -10px;
      right: -5px;
      font-size: 26px;
      cursor: pointer;
      font-weight: bold;
    }

    .justconte {
      justify-content: space-between;
    }

    .confirmbtn {
      width: 100%;
      height: 50px;
      background: #0080FF;
      text-align: center;
      line-height: 50px;
      color: #FFFFFF;
      font-size: 16px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      cursor: pointer;
    }

    .addmodels {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #333333;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      border: 1px solid #cfcfcf;
      margin-bottom: 30px;
      border-radius: 5px;
    }

    .iconlistadd {
      width: 55px;
      height: 55px;
      line-height: 50px;
      text-align: center;
      border: 1px solid #cfcfcf;
      color: #333333 !important;
      font-size: 36px !important;
      cursor: pointer;
    }
    .bottomboxlist {
      height: 35px;
      width: 100%;
      border-bottom: 1px solid #cfcfcf;
      display: flex;
      line-height: 35px;
      margin-bottom: 5px;
    }

    .sorf {
      border-radius: 5px;
      cursor: pointer;
      width: 80px;
      height: 35px;
      background: #0080FF;
      color: #FFFFFF;
      text-align: center;
      line-height: 35px;
    }

    .maskboxs {
      position: relative;
      background: #f1f6f8;
      width: 385px;
      height: 650px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .maskboxsbottom {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #0080FF;
      text-align: center;
      color: #FFFFFF;
      font-size: 16px;
      cursor: pointer;
    }

    .maskboxstop {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #0080FF;
      text-align: center;
      color: #FFFFFF;
      font-size: 16px;
      cursor: pointer;
    }

    .maskboxstoptitle {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      line-height: 40px;
      margin: 0;
    }
    .iconcloses2{
      position: absolute;
      right: 10px !important;
      top: -15px !important;
    }
    .maskboxscenterlist {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    
    .maskboxscenterlist:after {
      content: "";
      flex: auto;
    }
    
    .maskboxscenterlisticon {
      width: 25%;
      display: flex;
      /* justify-content: center; */
      align-items: center;
      flex-direction: column;
      margin-top: 10px;
      position: relative;
      cursor: pointer;
    }
    
    .maskboxscenterlisticon img {
      width: 55px;
      height: 55px;
    }
    
    .maskboxscenterlisticon div {
      color: #333333;
      font-size: 14px;
    }
    .addmaskboxs{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      z-index: 1000;
    }
    .addmodelbox{
      width: 300px;
      height: 450px;
      background: #FFFFFF;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      z-index: 1000;
      padding: 25px;
    }
    .addmodelboxtitle{
      text-align: center;
      line-height: 30px;
      font-size: 18px;
      color: #333333;
      font-weight: bold;
    }
    .addmodelboxform{
      display: flex;
      line-height:30px ;
      margin-bottom: 10px;
      position: relative;
    }
    .addmodelfile{
      width: 100%;
      height:100%;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      margin: auto;
      opacity: 0;
    }
    .addmodelboxform input{
      margin-left: 8px;
      height: 30px;
      outline: none;
      border:1px solid #cfcfcf;
    }
    .addmodelboxbottom{
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .addmodelboxbottom div{
      width: 55%;
      height: 100%;
      //background: #0080FF;
      //color: #FFFFFF;
      text-align: center;
      line-height: 40px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
</style>