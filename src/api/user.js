import request from '../utils/request'
import store from '../store'
// 登录接口
export const login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
// 验证码接口
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`
    })
}

export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user',
        // 发送请求头数据
        headers: {
            Authorization: `Bearer ${store.state.user.token}`
        }
    })
}

/**
 * 获取用户自己的信息
 */
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

/**
 * 关注用户
 */
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: { // post请求方式，要传递的数据，放入data对象中
            target //  target关注目标（被关注的用户id）
        }
    })
}

/**
 * 取消关注用户
 */
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`// target目标用户（被取消关注的用户id）
    })
}

/**
 * 获取用户个人资料
 */
// 获取指定用户信息
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}

/**
 * 更新用户资料
 */
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}
