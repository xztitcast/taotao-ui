<template>
    <div class="component-upload-image">
      <el-upload
        :action="action.url"
        list-type="picture-card"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :on-error="handleUploadError"
        :show-file-list="false"
        :headers="action.headers"
        style="display: inline-block; vertical-align: top">
        <div v-if="value" class="image">
          <el-image :src="value" style="width:148px;height:148px;" fit="fill"/>
          <div class="mask">
            <div>
              <span title="移除" @click.stop="imageRemoveHandle">
                <i class="el-icon-delete" style="color:aliceblue"/>
              </span>
            </div>
          </div>
        </div>
        <el-image v-else :src="value">
          <div slot="error" class="image-slot">
            <i class="el-icon-plus" />
          </div>
        </el-image>
      </el-upload>
    </div>
  </template>
  
  <script>
  import Cookies from 'js-cookie'
  export default {
    name:'ElUploadPlus',
    data() {
      return {
        action: {
          url: `${window.SITE_CONFIG['apiURL']}/sys/upload/pic`,
          headers: {"token": Cookies.get('token')}
        }
      };
    },
    props: {
      value: {
        type: String,
        default: "",
      },
    },
    methods: {
      handleBeforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleUploadSuccess(res) {
        this.$emit("input", res.url);
      },
      handleUploadError() {
        this.$message({
          type: "error",
          message: "上传失败",
        });
      },
      imageRemoveHandle() {
        this.$emit("input", "");
      }
    }
  };
  </script>
  
<style scoped lang="scss">
 div.image {
  width: 148px;
  height: 148px;
 }
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.452);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}
</style>
  