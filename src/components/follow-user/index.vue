<template>
    <van-button v-if="value" class="follow-btn" round size="small" :loading="loading" @click="onFollow">已关注
    </van-button>
    <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="loading"
        @click="onFollow">关注
    </van-button>
</template>

<script>
// 将article/index.vue中的此行剪切过来
import { addFollow, deleteFollow } from '@/api/user'

export default {
    name: 'FollowUser',
    components: {},
    props: {
        value: {
            type: Boolean,
            required: true
        },
        userId: {
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
        // 将article/index.vue中的这个方法剪切过来，然后修改为如下
        async onFollow() {
            this.loading = true // 展示关注按钮的 loading 状态
            try {
                if (this.value) {
                    // 已关注，取消关注
                    await deleteFollow(this.userId)
                    // this.article.is_followed = false
                } else {
                    // 没有关注，添加关注
                    await addFollow(this.userId)
                    // this.article.is_followed = true
                }

                // 更新视图状态
                // this.article.is_followed = !this.article.is_followed
                this.$emit('input', !this.value)
            } catch (err) {
                console.log(err)
                let message = '操作失败，请重试！'
                if (err.response && err.response.status === 400) {
                    message = '你不能关注你自己！'
                }
                this.$toast(message)
            }
            this.loading = false // 关闭关注按钮的 loading 状态
        }
    }
}
</script>

<style scoped lang="less">
</style>
