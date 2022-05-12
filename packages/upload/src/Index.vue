<template>
  <div :class="props.slotType === 'multipleimage' ? 'flex-row' : ''">
    <template v-if="props.slotType === 'multipleimage'">
      <transition-group name="drag">
        <div
          v-for="(item, index) in multipleArr"
          :key="index"
          class="img-list"
          :draggable="drag ? true : false"
          @dragstart="dragstart(index)"
          @dragenter.prevent
          @dragover.prevent
          @drop="drop(index)"
        >
          <el-icon class="img-close" :size="20" color="#999" @click.stop.prevent="clear(index)">
            <circle-close-filled />
          </el-icon>
          <img :src="imgSrc(item)" @click="imgPreview(imgSrc(item))" />
        </div>
      </transition-group>
    </template>
    <el-upload
      class="base-upload"
      v-bind="props"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :before-upload="handlebeforeUpload"
      :file-list="fileListArr"
      ref="baseupload"
      :class="props.slotType === 'input' ? 'input-upload' : ''"
    >
      <!-- 自定义 -->
      <slot v-if="props.slotType === 'custom'" />

      <!-- 输入框 -->
      <el-input size="small" v-else-if="props.slotType === 'input'" readonly v-model="fileName" placeholder="请选择文件"
        ><template #append>
          <el-button size="small">选择上传</el-button>
        </template>
      </el-input>

      <template v-else-if="props.slotType === 'multipleimage'">
        <el-icon>
          <plus />
        </el-icon>
      </template>

      <!-- 图片上传 -->
      <div v-else-if="props.slotType === 'image' || props.slotType === 'video'" class="flex image-upload-container">
        <div class="img-label" :style="{ width: props.labelWidth }" @click.stop.prevent>{{ props.label }}</div>
        <div class="img-upload">
          <p class="imageUpload" :style="{ background: `#d8d8d8 url(${imgDefault}) no-repeat 50%` }">
            <img class="close" :src="imgClose" v-if="fileUrl" @click.stop.prevent="clearImg" />
            <img class="img" :src="imgSrc(fileUrl)" v-if="fileUrl" @click.stop.prevent />
          </p>
        </div>
        <div class="txtleft">
          <div class="upload-tip" @click.stop.prevent>
            尺寸为{{ props?.width || 'auto' }}*{{ props?.height || 'auto' }}像素，格式为
            {{ props.accept.replace(/\./g, '') }} {{ props.accept.includes('mp4') ? '视频' : '图片' }}大小不可大于{{
              alowedSize
            }}。
          </div>
          <slot name="imgTip"></slot>
          <el-button size="small" class="btn">选择上传</el-button>
        </div>
      </div>

      <!-- 图片上传-简化版 -->
      <div v-else-if="props.slotType === 'easyimage'" class="image-upload-container">
        <div class="img-upload" style="margin: 0">
          <p class="imageUpload" :style="{ background: `#d8d8d8 url(${imgDefault}) no-repeat 50%` }">
            <img class="close" :src="imgClose" v-if="fileUrl" @click.stop.prevent="clearImg" />
            <img class="img" :src="fileUrl" v-if="fileUrl" @click.stop.prevent />
          </p>
        </div>
        <div><el-button size="small">选择上传</el-button></div>
      </div>
    </el-upload>
    <div class="grey-tip ml10 mt10 mb10" @click.stop.prevent v-if="props.slotType === 'multipleimage'">
      尺寸为{{ props?.width || 'auto' }}*{{ props?.height || 'auto' }}像素，格式为
      {{ props.accept.replace(/\./g, '') }} {{ props.accept.includes('mp4') ? '视频' : '图片' }}大小不可大于{{
        alowedSize
      }}。
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, computed, reactive, watch, h } from 'vue'
import { ElUpload, ElMessage, ElMessageBox } from 'element-plus'
import { imageDefault, imageClose,  } from './config'
import type { UploadFile, ElFile } from 'element-plus/src/upload/types'

export default defineComponent({
  name: 'sum-upload',
  props: {
    ...ElUpload.props,
    ...{
      drag: {
        type: Boolean,
        default: false
      },
      action: {
        type: String,
        default: '/upload/file'
      },
      limit: {
        type: Number,
        default: 1
      },
      multiple: {
        // 支持多选文件
        type: Boolean,
        default: false
      },
      onSuccess: {
        type: Function
      },
      showFileList: {
        // 是否显示已上传文件列表
        type: Boolean,
        default: false
      },
      fileUrl: {
        // 单文件绑定的 fileUrl
        type: [String, Array],
        default: ''
      },
      fileName: {
        // 是否显示已上传文件 fileName
        type: [String, Array],
        default: ''
      },
      size: {
        // 限制大小 默认1MB
        type: Number,
        default: 1024 * 1024
      },
      slotType: {
        // slotType：input | custom | image
        type: String,
        default: 'input'
      },
      label: {
        // 图片的label
        type: String,
        default: ''
      },
      labelWidth: {
        // 图片的label宽度
        type: [String, Number],
        default: 'auto'
      },
      width: {
        // 图片的width
        type: [String, Number],
        default: 'auto'
      },
      height: {
        // 图片的height
        type: [String, Number],
        default: 'auto'
      },
      headers: {
        type: Object,
        default: {}
      },
      multipleArr: {
        // 图片的width
        type: Array,
        default: []
      },
      canvas: {
        type: Object,
        default: () => ({})
      },
      maxHeight: [String, Number],
      minHeight: [String, Number],
      maxWidth: [String, Number],
      minWidth: [String, Number]
    }
  },
  emits: ['update:fileUrl', 'update:fileName', 'update:multipleArr', 'update:canvas', 'uploadSuccess'],
  setup(props, { emit }) {
    const baseupload = ref(null) as any
    const isMultiple = props.limit > 1
    const data = !isMultiple
      ? reactive({ fileName: '', fileUrl: '' })
      : reactive({ fileName: [] as any, fileUrl: [] as any })
    const fileListArr = computed(
      () => props?.fileList || (props?.fileName && props?.fileUrl ? [{ name: props.fileName, url: props.fileUrl }] : [])
    )
    const alowedSize = computed(() =>
      props.size / 1024 / 1024 < 1 ? `${props.size / 1024}KB` : `${props.size / 1024 / 1024}MB`
    )
    const imgDefault = ref(imageDefault)
    const imgClose = ref(imageClose)
    let dragIndex = 0

    watch(
      () => props,
      val => {
        if (val.fileName) {
          data.fileName = val.fileName
        }
        if (val.fileUrl) {
          data.fileUrl = val.fileUrl
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

    const dragstart = (index: number) => {
      console.log('dragstart', index)
      dragIndex = index
    }
    const drop = (index: number) => {
      if (dragIndex !== index) {
        const source = props.multipleArr[dragIndex]
        const arr = props.multipleArr || []

        arr.splice(dragIndex, 1)
        arr.splice(index, 0, source)
        emit('update:multipleArr', arr)
      }
    }
    const validHeightWidth = (file: ElFile, props: any) => {
      const { height, width, maxHeight, minHeight, maxWidth, minWidth } = props
      // 图片类型才校验
      return new Promise((resolve, reject) => {
        let isValidHeight = true
        let isValidWidth = true
        let valid = true
        let validRange = true
        const validWidth = width - 0
        const validHeight = height - 0
        const URL = window.URL || window.webkitURL
        if (props.accept.includes('jpg') || props.accept.includes('png') || props.accept.includes('jpeg')) {
          const image = new Image()
          image.onload = () => {
            if (width !== 'auto') {
              isValidWidth = image.width === validWidth
            }
            if (height !== 'auto') {
              isValidHeight = image.height === validHeight
            }
            valid = isValidHeight && isValidWidth

            // check range
            if (maxHeight && minHeight) {
              validRange = image.height <= maxHeight && image.height >= minHeight
            }
            if (maxWidth && minWidth) {
              validRange = image.width <= maxWidth && image.height >= minWidth
            }
            // 宽高-图片
            !valid && ElMessage.error(`上传文件尺寸为${props.width}*${props.height}像素!`)
            !validRange && ElMessage.error('上传的文件尺寸不符合要求')
            resolve(valid && validRange)
          }
          image.src = URL.createObjectURL(file)
        } else {
          resolve(true)
        }
      })
    }

    const handlebeforeUpload = (file: ElFile) => {
      console.log('handlebeforeUpload', file)
      const isFormat = props.accept.includes(`.${file.name.replace(/.+\./, '')}`)
      const fitSize = file.size < props.size
      if (!isFormat) {
        // 格式
        ElMessage.error('上传的文件格式不符合要求!')
      }
      if (!fitSize) {
        // 大小
        ElMessage.error(`上传文件大小不能超过 ${alowedSize.value}!`)
      }
      return new Promise((resolve, reject) => {
        validHeightWidth(file, props).then(valid => {
          if (isFormat && fitSize && valid) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    }
    const updateFileNameUrl = (name: string, url: string) => {
      data.fileName = name
      data.fileUrl = url
      emit('update:fileUrl', data.fileUrl)
      emit('update:fileName', data.fileName)
    }

    const updateMultiple = (name: string, url: string) => {
      // 如果是多图片上传，设置了fileUrl和fileName，则为该数组的key,否则就是默认值往数组里添加url
      const arr = props.multipleArr || []
      if (!props.fileName && !props.fileUrl) {
        arr.push(url)
      } else {
        arr.push({ [props.fileUrl]: url, [props.fileName]: name })
      }
      emit('update:multipleArr', arr)
    }

    const handleSuccess = (res: any, file: UploadFile, fileList: UploadFile[]) => {
      console.log('handleSuccess', res, file, fileList)
      if (res?.success || res?.code === '0') {
        ElMessage.success('上传成功')
        if (!isMultiple) {
          // 单文件 清空 fileList
          if (fileList.length) {
            baseupload.value.clearFiles()
          }
          let data = ''
          if (props.data.bitRateList && props.data.resolutionRatio) {
            emit('update:canvas', res.data)
          } else if (props.accept.includes('.svga')) {
            data = res.data
          } else {
            data = `${res.data}${
              res.data.includes('mp4') || res.data.includes('MP4')
                ? '?x-oss-process=video/snapshot,t_200,f_jpg,w_0,h_0,m_fast'
                : ''
            }`
          }
          updateFileNameUrl(file.name, data)
          emit('uploadSuccess', res.data)
        } else {
          // 多文件
          updateMultiple(file.name, res.data)
          emit('uploadSuccess', res.data)
        }
      } else {
        baseupload.value.clearFiles()
        ElMessage.error(res?.desc || '上传失败')
      }
    }
    const handleExceed = (files: any, fileList: any) => {
      console.log('handleExceed', files, fileList)
      if (!isMultiple) {
        console.log(files, fileList)
      } else {
        ElMessage.warning(`当前限制选择 ${props.limit} 个文件`)
      }
    }
    const handleChange = (files: any, fileList: any) => {
      console.log('handleChange', files, fileList)
      if (files.status === 'fail') {
        ElMessage.error('上传失败')
      }
    }

    const clearImg = () => {
      updateFileNameUrl('', '')
    }

    const clear = (index: number) => {
      const arr = props.multipleArr
      arr.splice(index, 1)
      emit('update:multipleArr', arr)
    }

    const imgPreview = (url: string) => {
      ElMessageBox({
        title: '图片预览',
        message: h('img', { src: url, style: 'width:100%' }, ''),
        showConfirmButton: false
      })
    }

    const imgSrc = (item: any) => {
       return typeof item === 'string' ? item : item[props.fileUrl]
    }

    return {
      ...toRefs(data),
      ...toRefs(props),
      imgSrc,
      handleChange,
      imgPreview,
      clear,
      baseupload,
      imgDefault,
      imgClose,
      props,
      alowedSize,
      fileListArr,
      handlebeforeUpload,
      handleSuccess,
      handleExceed,
      clearImg,
      dragstart,
      drop
    }
  }
})
</script>

<style lang="scss" scoped>
$border-color: #e5e5e5;
$grey-tip: #888;
$text-color: #333;
$grey-tip: #888;
.flex-row {
  width: 100%;
  flex-wrap: wrap;
}
.img-list {
  position: relative;
  width: 148px;
  min-width: 148px;
  height: 148px;
  margin-right: 10px;
  border: 1px solid $border-color;

  img {
    width: 100%;
    height: 100%;
  }
  .img-close {
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
    z-index: 1;
  }
}

.image-upload-container {
  cursor: initial;
  .img-label {
    color: $text-color;
    font-size: 14px;
  }
  .img-upload {
    padding: 5px;
    border: 1px solid $border-color;
    display: inline-block;
    margin: 20px;
  }
  .imageUpload {
    min-width: 100px;
    min-height: 100px;
    position: relative;
    .close {
      width: 24px;
      height: 24px;
      position: absolute;
      z-index: 9;
      top: -10px;
      right: -10px;
      cursor: pointer;
    }
    .img {
      display: block;
      width: 100px;
      height: 100px;
      opacity: 1;
    }
  }
  .upload-tip {
    font-size: 14px;
    color: $grey-tip;
  }
  .btn {
    margin-top: 15px;
    cursor: pointer;
  }
}
</style>
