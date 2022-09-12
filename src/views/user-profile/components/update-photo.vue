<template>
    <div class="update-photo">
        <img class="img" :src="img" ref="img" />
        <div class="toolbar">
            <span class="cancel" @click="$emit('close')">取消</span>
            <span class="confirm" @click="onConfirm">完成</span>
        </div>
    </div>
</template>

<script>
import { updateUserPhotoAPI } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
    // 组件名称
    name: 'UpdatePhoto',
    // 局部注册的组件
    components: {},
    // 组件参数 接收来自父组件的数据
    props: {
        img: {
            type: [String, Object],
            retuired: true
        }
    },
    // 组件状态值
    data() {
        return {
            cropper: {}

        }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() { },
    mounted() {
        const image = this.$refs.img
        this.cropper = new Cropper(image, { // crop剪裁，Cropper修剪机
            aspectRatio: 16 / 9,
            viewMode: 1, // 只能在裁剪的图片范围内移动
            dragMode: 'move', // 画布可以移动
            // eslint-disable-next-line no-dupe-keys
            aspectRatio: 1, // 裁剪区默认正方形
            autoCropArea: 1, // 自动调整裁剪图片
            cropBoxMovable: true, // 禁止裁剪区移动
            cropBoxResizable: true, // 禁止裁剪区缩放
            background: false // 关闭默认背景
        })
        // console.log(this.cropper)
    },
    // 组件方法
    methods: {
        onConfirm() {
            // console.log(this.cropper)
            this.cropper.getCroppedCanvas().toBlob(blob => {
                // console.log(blob)
                this.updateUserPhoto(blob)
            })
        },
        async updateUserPhoto(blob) {
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true, // 禁止背景点击
                duration: 0 // 持续展示
            })
            try {
                const formData = new FormData()
                formData.append('photo', blob)
                const { data } = await updateUserPhotoAPI(formData)
                // console.log(data)
                // 关闭弹出层
                this.$emit('close')
                // 更新视图
                this.$emit('update-photo', data.data.photo)
                // 提示成功
                this.$toast.success('更新成功')
            } catch (err) {
                this.$toast.fail('更新失败')
            }
        }
    }
}
</script>

<style scoped lang="less">
.update-photo {
    background-color: #000;
    height: 100%;

    .toolbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;

        .cancel,
        .confirm {
            width: 90px;
            height: 90px;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
}

.img {
    display: block;
    max-width: 100%;
}
</style>
