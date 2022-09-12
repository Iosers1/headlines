<template>
    <van-button :icon="value === 1 ? 'good-job' : 'good-job-o'" :class="{ liked: value === 1 }" @click="onCollect"
        :loading="loading" />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
    name: 'LikeArticle',
    components: {},
    props: {
        value: {
            type: Number, // 点赞的数据是-1,0,1（点赞）这样的数据
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
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        async onCollect() {
            this.loading = true
            try {
                let status = -1
                if (this.value === 1) {
                    // 已点赞，取消点赞
                    await deleteLike(this.articleId)
                } else {
                    // 没有点赞，添加点赞
                    await addLike(this.articleId)
                    status = 1
                }
                // 更新视图
                this.$emit('input', status)
                this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
            } catch (err) {
                this.$toast.fail('操作失败，请重试')
            }
            // 请求结束
            this.loading = false
        }
    }
}
</script>

<style scoped lang="less">
.liked {
    .van-icon {
        color: #e5645f !important;
    }
}
</style>
