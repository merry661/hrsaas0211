<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>
<script>
// import XLSX from 'xlsx' //这样引入会报错
import * as XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    // 来自父组件，当解析成功会触发
    onSuccess: Function// eslint-disable-line 
  },
  data() {
    return {
      loading: false, // 是否显示加载中
      excelData: { // 解析excel导入的数据，分为头和内容2部分
        header: null,
        results: null
      }
    }
  },
  methods: {
    // 处理，解析后的excel header数据和result数据
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      //   console.log(this.excelData, '导入的数据')//包含header数组和result数组的对象
      this.onSuccess && this.onSuccess(this.excelData)// 将处理结果作为参数传给onSuccess()函数
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },

    // 1.点击上传按钮后，触发该方法，间接触发”隐藏的input“的click事件，调出选择文件的弹框
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    // 2.隐藏的input的click事件被触发后，调用该函数
    handleClick(e) {
      const files = e.target.files// 读取excel的files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    // 3.
    upload(rawFile) {
    // 1）为隐藏的input的value赋值
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)// 2）读取上传的文件的数据
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 4.读取文件的数据
    readerData(rawFile) {
      this.loading = true// 进度效果显示
      // 返回promise对象
      return new Promise((resolve, reject) => {
        const reader = new FileReader()// 原生JS的读取文件方法
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)// excel的头部标题
          const results = XLSX.utils.sheet_to_json(worksheet)// excel的内容部分
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
   margin-top: 100px;
   .excel-upload-input{
       display: none;
        z-index: -9999;
     }
   .btn-upload , .drop{
      border: 1px dashed #bbb;
      width: 350px;
      height: 160px;
      text-align: center;
      line-height: 160px;
   }
   .drop{
       line-height: 80px;
       color: #bbb;
      i {
        font-size: 60px;
        display: block;
      }
   }
}
</style>
