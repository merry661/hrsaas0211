<template>
  <!-- 上传组件 -->
  <!-- 1. 可以显示传入的图片地址
2. 可以删除传入的图片地址
3. 可以上传图片到云服务器
4. 上传到腾讯云之后，可以返回图片地址，显示
5. 上传成功之后，可以回调成功函数 -->
  <div>
    <!-- 限定上传的图片数量和action -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :before-upload="beforeUpload"
      :http-request="upload"
      :on-change="changeFile"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :class="{ disabled : fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />
    <!-- 点击预览--出现弹窗 -->
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%">
    </el-dialog>
  </div>
</template>
<script>
// 1.引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
// 2.实例化COS对象
// 拷贝自己的秘钥和key 只有用自己的key和自己的秘钥才能上传到自己的存储桶里面
const cos = new COS({
  SecretId: 'AKIDDH6h27wXszsVszrTqxnpdCYgcIirqfFZ', // 身份识别 ID
  SecretKey: '96oGSRBgwvfAPPAessc6OREm46sPgkbC' // 身份密钥
})
export default {
  name: 'ImageUpload',
  components: {
  },
  props: {},
  data() {
    return {
      imgUrl: '', // 预览图片的地址
      showDialog: false, // 是否显示图片预览弹出框
      fileList: [], // 图片地址列表
      currentFileUid: null, // 当前正在上传的uid
      showPercent: false, // 上传图片的进度条
      percent: 0// 当前上传图片的百分比
    }
  },
  computed: {
    // 如果它为true 表示就不应该显示 +号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    // 1.点击图片预览按钮
    preview(file) {
      this.imgUrl = file.url// 本地图片地址
      this.showDialog = true // 显示弹出框
    },
    // 2.上传图片到腾讯云，调用接口
    upload(params) {
      //   console.log(params)
      if (params.file) {
        // 1)配置腾讯云，执行上传操作
        cos.putObject({
          Bucket: '125359-1259632149', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 2)当前上传图片的百分比
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // 3)处理回传数据
          console.log(err || data)
          if (!err && data.statusCode === 200) { // 上传成功
            // 4)回传数据data中的图片与本地已上传的图片uid比对，确定要往本地fileList中那条对象更新url
            // 遍历本地fileList
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                // 5)保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                return { url: 'http://' + data.Location, upload: true }
              }
              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
              return item
            })
            // 6)上传完毕后--关闭进度条，重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    },
    // 3.点击加号，触发组件的change事件，
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    //   console.log(this.fileList, '000')
    },
    // 4.上传之前，校验文件
    beforeUpload(file) {
      // 1)校验文件类型
      const fileType = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      console.log(file.type)
      if (!fileType.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false// 终止上传
      }
      // 2）校验文件大小 5M 1M = 1024KB 1KB = 1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
      // 3） 确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid

      this.showPercent = true// 显示进度条
      return true
    },
    // 5.删除文件
    // file是要删除的文件
    // fileList是删过之后的文件
    handleRemove(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
    //   console.log(this.fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    //   this.fileList = fileList
    }
  }
}
</script>

<style>
 .disabled .el-upload--picture-card {
     display: none
 }
</style>
