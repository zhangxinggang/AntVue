
import Mock from 'mockjs'
import mock from '@/mock'
const Random = Mock.Random
const dataList = []
for (let i = 0; i < 100; i++) {
    const template = {
        'Boolean': Random.boolean(), // 可以生成基本数据类型
        'Natural': Random.natural(1, 4), // 生成1到100之间自然数
        'Integer': Random.integer(1, 100), // 生成1到100之间的整数
        'Float': Random.float(0, 100, 0, 5), // 生成0到100之间的浮点数,小数点后尾数为0到5位
        'Character': Random.character(), // 生成随机字符串,可加参数定义规则
        'String': Random.string(2, 10), // 生成2到10个字符之间的字符串
        'Range': Random.range(0, 10, 2), // 生成一个随机数组
        'Date': Random.date(), // 生成一个随机日期,可加参数定义日期格式
        'Image': Random.image(Random.size, '#02adea', 'Hello'), // Random.size表示将从size数据中任选一个数据
        'Color': Random.color(), // 生成一个颜色随机值
        'Paragraph': Random.paragraph(2, 5), // 生成2至5个句子的文本
        'Name': Random.name(), // 生成姓名
        'Url': Random.url(), // 生成web地址
        'Address': Random.province() // 生成地址
    }
    dataList.push(template)
}
mock({
    name:'tableList',
    request(params){
        let info = JSON.parse(params.body)
        let [index, size, total] = [info.page, info.rows, dataList.length]
        let newDataList = dataList.slice(index * size, (index + 1) * size)
        return {
            pageIndex:index,
            pageRowCount:size,
            rows:newDataList,
            total:total
        }
    }
})