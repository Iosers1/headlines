import request from '@/utils/request'

/**
 * 获取搜索联想建议
 */
export const getSearchSuggestions = q => {
    return request({
        method: 'GET',
        url: '/v1_0/suggestion',
        params: {
            q
        }
    })
}

/**
 * 获取搜索结果
 */
export function getSearchResult(params) {
    return request({
        method: 'GET',
        url: '/v1_0/search',
        params
    })
}
