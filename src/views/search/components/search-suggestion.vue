<template>
    <div class="search-suggestion">
        <van-cell v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)" icon="search">
            <template #title>
                <span v-html="highlight(text)"></span>
            </template>
        </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
    name: 'SearchSuggestion',
    components: {},
    props: {
        searchText: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            suggestions: [] // 联想建议数据列表
        }
    },
    computed: {},
    watch: {
        // 只要searchText发生变化，我们都需要发起请求，显示最新的联想建议（联想建议会随着输入的内容变化而变化），所以我们需要监听searchText的变化，那么就需要使用watch
        searchText: {
            // 当 searchText 发生改变的时候就会调用 handler 函数
            // 注意：handler 函数名称是固定的
            // debounce 函数
            // 参数1：一个函数
            // 参数2：延迟时间，单位是毫秒
            // 返回值：防抖之后的函数
            handler: debounce(function (value) {
                this.loadSearchSuggestions(value)
            }, 200),
            // handler (value) {
            //   this.loadSearchSuggestions(value)
            // },
            immediate: true // 该回调将会在侦听开始之后被立即调用
        }
    },
    created() { },
    mounted() { },
    methods: {
        async loadSearchSuggestions(q) {
            try {
                const { data } = await getSearchSuggestions(q)
                // 补充过滤返回空值的处理，视频中没有。
                // 后台返回的列表中有的项为空，导致展示一个空的项，所以此处过滤掉这种数据
                this.suggestions = data.data.options.filter(it => it)
            } catch {
                this.$toast('获取失败')
            }
        },
        highlight(text) {
            const highlightStr = `<span class="active">${this.searchText}</span>`
            // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
            // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
            // RegExp 正则表达式构造函数
            //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
            //    参数2：匹配模式，要写到字符串中
            const reg = new RegExp(this.searchText, 'gi')
            // text.replace(/匹配的内容/gi, highlightStr)
            return text.replace(reg, highlightStr)
        }
    }
}
</script>

<style scoped lang="less">
</style>
