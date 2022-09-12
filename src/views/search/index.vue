<template>
    <div class="search-container">
        <form class="search-form" action="/">
            <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel"
                @focus="isResultShow = false" />
        </form>
        <!-- 搜索结果 -->
        <search-result v-if="isResultShow" :search-text="searchText" />
        <!-- /搜索结果 -->

        <!-- 联想建议 searchText之前已经在data中添加过了 -->
        <search-suggestion :search-text="searchText" v-else-if="searchText" @search="onSearch">
        </search-suggestion>
        <!-- <search-suggestion v-else-if="searchText" /> -->
        <!-- /联想建议 -->

        <!-- 搜索历史记录 -->
        <search-history v-else :search-histories="searchHistories" @clear-search-history="searchHistories = []"
            @search="onSearch" />
        <!-- /搜索历史记录 -->
    </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
    name: 'SearchIndex',
    components: {
        SearchHistory,
        SearchSuggestion,
        SearchResult
    },
    data() {
        return {
            searchText: '',
            isResultShow: false,
            searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') ? getItem('TOUTIAO_SEARCH_HISTORIES') : []// 搜索
        }
    },

    created() {

    },
    watch: {
        searchHistories(value) {
            // 同步到本地存储
            setItem('TOUTIAO_SEARCH_HISTORIES', value)
        }
    },

    methods: {
        onSearch(val) {
            // 更新文本框内容
            this.searchText = val

            // 存储搜索历史记录
            // 要求：不要有重复历史记录、最新的排在最前面
            const index = this.searchHistories.indexOf(val)
            if (index !== -1) { // 如果重复，则先删除，然后再头部再添加
                this.searchHistories.splice(index, 1)
            }
            this.searchHistories.unshift(val) // 在头部添加

            // 渲染搜索结果
            this.isResultShow = true
        },
        onCancel() {
            this.$router.back()
        }
    },
    onSearch(val) {
        this.searchText = val // 将搜索框中的内容改为传递过来的内容
        this.isResultShow = true
    }
}
</script>

<style scoped lang='less'>
.search-container {
    padding-top: 108px;

    .van-search__action {
        color: #fff;
    }

    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>
