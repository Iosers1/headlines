<template>
    <van-button :icon="value ? 'star' : 'star-o'" :class="{
        collected: value
    }" :loading="loading" @click="onCollect" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
    name: 'CollectArticle',
    props: {
        value: {
            type: Boolean,
            required: true
        },
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async onCollect() {
            // 开始请求
            this.loading = true
            try {
                // 是否收藏
                if (this.value) {
                    // 父组件 传递articleId
                    await deleteCollect(this.articleId)
                } else {
                    await addCollect(this.articleId)
                }
                // 更新视图
                this.$emit('input', !this.value)
                // 自定义事件修改数据并不是立即的，所以这里也是!this.value
                this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
            } catch (err) {
                this.$toast.fail('操作失败，请重试')
            }
            // 请求结束
            this.loading = false
        }
    }
}
</script>

<style scoped lang='less'>
.collected {
    .van-icon {
        color: #ffa500;
    }
}
</style>
