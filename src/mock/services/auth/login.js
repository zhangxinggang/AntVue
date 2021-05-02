import mock from '@/mock'
mock({
    name:'login',
    request(params){
        let body = JSON.parse(params.body)
        return {
            id: 1,
            name: body.name,
            username: body.name,
            password: '',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
            status: 1,
            telephone: '',
            lastLoginIp: '27.154.74.117',
            lastLoginTime: 1534837621348,
            creatorId: 'admin',
            createTime: 1497160610259,
            deleted: 0,
            roleId: 'admin',
            lang: 'zh-CN',
            token: '4291d7da9005377ec9aec4a71ea837f'
        }
    }
})