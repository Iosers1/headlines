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
