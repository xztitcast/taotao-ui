<template>
  <div id="ck-editer">
    <ckeditor
      :editor="editor"
      :config="editorConfig"
      v-model="editorData"
      @ready="onReady">
    </ckeditor>
  </div>
</template>  
<script>
  import Cookies from 'js-cookie'
  import axios from "axios";
  import CKEditor from "@ckeditor/ckeditor5-vue2";
  import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
  import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn";
  export default {
    name: "ckeditor5",
    components: {
        ckeditor: CKEditor.component
    },
    data() {
      return {
        editor: DecoupledEditor,
        editorConfig: {
          language: "zh-cn",
        }
      }
    },
    props:{
      value: {
        type: String,
        default: ""
      }
    },
    computed: {
      editorData: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        },
      }
    },
    methods: {
      onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
         return new ckEditorUploadAdapter( loader );
        };  
      }
    }
  }
  class ckEditorUploadAdapter {
    constructor( loader ) {
      this.loader = loader;
    }
    async upload() {
      const data = new FormData();
      data.append('file', await this.loader.file);
  
      return new Promise((resolve, reject) => {
        axios({
          url: `${window.SITE_CONFIG['apiURL']}/sys/upload/pic`,
          method: 'post',
          data,
          headers: {
            'token': Cookies.get('token')
          },
          withCredentials: true // true 为不允许带 token, false 为允许，可能会遇到跨域报错：Error: Network Error 弹窗提示（感谢@ big_yellow 指正）
        }).then(res => {
          var resData = res.data;
          resData.default = resData.url;
          resolve(resData);
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
</script>
<style lang="scss">
  #ck-editer {
  // 编辑器高度，边框
  .ck-content {
    min-height: 400px;
    border: 1px solid #ccc !important;
    background-color: white;
  }
}
</style>
  
  