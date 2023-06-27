<template>
  <el-dialog
    title="预览"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="680px">
    <div class="viewboxno">
      <div class="device">
          <div class="swiper-container">
              <div class="swiper-wrapper">
                  <div class="swiper-slide" 
                    v-for="item in previewList"
                    :key="item.id">
                    <img :src="item.pics"> 
                  </div>
                  <div class="swiper-pagination"></div>
              </div>
          </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import "swiper/swiper.min.css"
  import Swiper from 'swiper'
  export default {
    data() {
      return {
        visible: true,
        previewList: []
      }
    },
    mounted() {
      new Swiper ('.swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        // 如果需要滚动条
        scrollbar: '.swiper-scrollbar',
      })
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$http.get(`/sys/ad/content/preview/${id}`).then(({data}) => {
            if(data && data.code === 0){
              this.previewList = data.result || []
            }else {
              this.$message.error(data.message)
            }
          })
        })
      },
    },
  }
</script>
<style>
.device {
  width: 100%;
  max-height: 350px;
  background: #fff;
  position: relative;
  overflow:hidden;
}
.device .arrow-left {
  background: url(~@/assets/img/arrows.png) no-repeat left top;
  position: absolute;
  left: 10px;
  top: 50%;
  margin-top: -15px;
  width: 17px;
  height: 30px;
}
.device .arrow-right {
  background: url(~@/assets/img/arrows.png) no-repeat left bottom;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -15px;
  width: 17px;
  height: 30px;
}
.swiper-pagination-switch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: #999;
  box-shadow: 0px 1px 2px #555 inset;
  margin: 0 3px;
  cursor: pointer;
}
.swiper-active-switch {
  background: #fff;
}
.swiper-slide img{
	width:100%;
}
.previewBox,.previewBoxfixed{
	position:fixed;
	top:0;
	left:0;
    width:100%;
    height:100%;
    z-index: 100;
    background: rgba(0, 0, 0, .45);
    
}
.previewBoxfixed{
	width:0;
	overflow:hidden;
}
.previewBoxfixed.hover{
	width:100%;
}
.viewposition{
	position:absolute;
	top:0;
	right:0;
	bottom:0;
	left:0;
	margin:auto;
	background:#fff;
	-webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    width: 500px;
    height: 400px;
}
.viewbox{
	position:absolute;
	top:0;
	right:0;
	bottom:0;
	left:0;
	margin:auto;
	background: url(~@/assets/img/iphone1.png) no-repeat;
	background-size: 250px;
    width: 250px;
    height: 509px;
    padding: 20px 16px;
}
.viewboxno{
	background: url(~@/assets/img/iphone2.png) no-repeat;
	background-size: 350px;
  width: 350px;
  height: 465px;
  padding: 51px 23px;
  display:inline-block;
  margin-left: 40px;
  padding-top: 101px;
}
.swiper-container {
  width: 100%;
}
.content-slide {
  padding: 20px;
  color: #fff;
}
.title {
  font-size: 25px;
  margin-bottom: 10px;
}
.swiper-slide img{
	width:100%;
}
.control-label{
	text-align:left;
}
.viewboxno .title{
    text-align: center;
    font-size: 13px;
    background: #fff;
    border-bottom: 1px solid #efefef;
    padding: 12px 10px 7px 10px;
}

</style>