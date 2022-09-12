<template>
    <div class="article-list">
        <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
        <van-pull-refresh :success-text="refreshSuccessText" :success-duration="1500" v-model="isRefreshLoading"
            @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
                error-text="请求失败，点击重新加载">
                <articleitem v-for="(article, index) in list" :key="index" :article="article" />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import articleitem from './article-item/index.vue'
export default {
    name: 'ArticleList',
    components: {
        articleitem
    },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            list: [], // 存储列表数据的数组
            loading: false, // 控制加载中 loading 状态
            finished: false, // 控制数据加载结束的状态
            timestamp: null,
            error: false, // 是否加载失败
            // 控制下拉刷新的失败状态
            isRefreshLoading: false,
            refreshSuccessText: ''
        }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        // 初始化或滚动到底部的时候会触发调用 onLoad
        async onLoad() {
            try {
                // 1. 请求获取数据
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    timestamp: this.timestamp || Date.now(), // 时间戳，请求最新数据传当前的时间戳，请求某一刻的数据就传递具体的一个时间戳
                    with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
                })
                // console.log(data)
                // 2. 把数据添加到 list 数组中
                const { results } = data.data// （这个是请求回来的结果数据）
                // 数组的展开操作符...，它会把数组元素一个一个拿出来
                // console.log(results)
                this.list.push(...results)// （将结果数据拆包之后，加到list中）

                // 3. 本次数据加载结束之后要把加载状态设置为结束
                this.loading = false // （隐藏加载中）

                // 4. 判断数据是否全部加载完成：（如果长度为0说明没有数据）
                if (results.length) {
                    // 更新获取下一页数据的时间戳
                    this.timestamp = data.data.pre_timestamp
                } else {
                    // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
                    this.finished = true// (显示没有更多)
                }
            } catch (err) {
                console.log(err)
                this.loading = false // 关闭 loading 效果
                this.error = true // 开启错误提示
            }
        },
        // 当触发下拉刷新的时候调用该函数
        async onRefresh() {
            try {
                // 1. 请求获取数据
                const { data } = await getArticles({
                    channel_id: this.channel.id, // 频道 id
                    timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
                    with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
                })
                // 模拟随机失败的情况
                // if (Math.random() > 0.2) {
                //   JSON.parse('dsnajndjsa')
                // }
                // 2. 将数据追加到列表的顶部
                const { results } = data.data
                this.list.unshift(...results)

                // 3. 关闭下拉刷新的 loading 状态
                this.isRefreshLoading = false

                // 更新下拉刷新成功提示的文本
                this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
            } catch (err) {
                this.refreshSuccessText = '刷新失败'
                this.isreFreshLoading = false // 关闭下拉刷新的 loading 状态
            }
        }
    }
}
</script>

<style scoped lang="less">
.article-list {
    height: 79vh;
    overflow-y: auto;
}
</style>
