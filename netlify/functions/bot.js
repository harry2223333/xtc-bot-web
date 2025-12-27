// 必需依赖引入（固定写法，不能删）
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// 初始化Express实例
const app = express();

// 核心中间件配置（确保跨域和请求解析正常）
app.use(cors()); // 解决跨域问题，对外分享必需
app.use(express.json()); // 解析JSON格式请求
app.use(express.urlencoded({ extended: true })); // 解析表单格式请求

// 👇 这里可以替换成你的业务逻辑（接口/页面返回）
// 示例接口1：首页访问
app.get('/', (req, res) => {
  res.status(200).send('小天才BOT服务部署成功！可对外分享～');
});

// 示例接口2：测试API（你可以删除或替换成自己的接口）
app.get('/api/bot', (req, res) => {
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: '这是你的BOT接口返回数据'
  });
});

// 👇 Netlify云函数必需导出（固定写法，不能改）
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // 解决Netlify的异步处理问题
  context.callbackWaitsForEmptyEventLoop = false;
  const result = await handler(event, context);
  return result;
};
