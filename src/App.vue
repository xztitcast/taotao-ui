<template>
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</template>

<style>
  .el-table th.gutter{
    display: table-cell!important;
  }
</style>
<script>
import Cookies from 'js-cookie'
import { messages } from '@/i18n'
export default {
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
    /*this.$nextTick(() => {
      // 1.禁用右键菜单
      document.oncontextmenu = new Function("event.returnValue=false");
      // 2.禁用鼠标选中
      document.onselectstart = new Function("event.returnValue=false");
      // 3.禁止键盘F12键
      document.addEventListener("keydown", function (e) {
        if (e.key == "F12") {
          e.preventDefault(); // 如果按下键F12,阻止事件
        }
      });
    });*/
  },
  methods: {
    i18nHandle (val, oldVal) {
      Cookies.set('language', val)
      document.querySelector('html').setAttribute('lang', val)
      document.title = messages[val].brand.lg
      // 非登录页面，切换语言刷新页面
      if (this.$route.name !== 'login' && oldVal) {
        window.location.reload()
      }
    }
  }
}
</script>
