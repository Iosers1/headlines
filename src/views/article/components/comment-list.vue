<template>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <comment-item v-for="(item, index) in list" :key="index" :comment="item"
            @reply-click="$emit('reply-click', $event)" />
        <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.content" /> -->
    </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
    name: 'CommentList',
    components: { CommentItem },
    props: {
        source: {
            type: [Number, String, Object],
            required: true
        },
        list: {
            type: Array,
            default: () => []
        },
        // 增加type参数，默认值为a，取值范围只能是a或者c
        type: {
            type: String,
            // 自定义 Prop 数据验证
            validator(value) {
                return ['a', 'c'].includes(value)
            },
            default: 'a'
        }
    },
    data() {
        return {
            // list: [],
            loading: false,
            finished: false,
            offset: null, // 获取下一页数据的标记 (分页，从哪开始取这页数据)
            limit: 10, // (分页，每页多少条)
            error: false
        }
    },
    computed: {},
    watch: {},
    created() {
        this.loading = true
        this.onLoad()
    },
    mounted() { },
    methods: {
        async onLoad() {
            try {
                // 1. 请求获取数据
                const { data } = await getComments({
                    type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                    source: this.source.toString(), // 源id，文章id或评论id(特别注意：需要手动加上toString()，否则会在source的值两边加上双引号，导致id不是一个有效的整形)
                    offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                    limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
                })
                // 2. 将数据添加到列表中
                const { results } = data.data
                // eslint-disable-next-line vue/no-mutating-props
                this.list.push(...results)
                console.log(this.list)
                // 3. 将 loading 设置为 false
                this.loading = false
                // 将获取到的评论返回给父组件：
                this.$emit('onload-success', data.data)
                // 4. 判断是否还有数据
                if (results.length) {
                    // 有就更新获取下一页的数据页码
                    this.offset = data.data.last_id
                } else {
                    // 没有就将 finished 设置结束
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = false
            }
        }
    }
}
</script>

<style scoped lang="less">
</style>
