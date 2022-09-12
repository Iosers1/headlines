/**
 * 评论接口模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export function getComments(params) {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        params
    })
}

/**
 * 评论点赞
 */
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data: {
            target
        }
    })
}

/**
 * 取消评论点赞
 */
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`
    })
}

/**
 * 添加评论或评论回复
 */
export function addComment(data) {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}
