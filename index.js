// 小天才BOT整合服务（后端+前端一体化）
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 全局中间件配置（解决跨域+解析请求）
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 模拟数据库：存储已绑定用户信息
let bindedUsers = [];

// 核心绑定接口
app.post('/bindBot', (req, res) => {
  try {
    const { userId, imId, watchId } = req.body;

    // 基础参数校验
    if (!userId || !imId) {
      return res.status(400).json({
        code: 400,
        msg: '错误：用户账号和IM账号不能为空！',
        data: null
      });
    }

    // 检查重复绑定
    const isDuplicate = bindedUsers.some(user => {
      return user.userId === userId || user.imId === imId;
    });
    if (isDuplicate) {
      return res.status(400).json({
        code: 400,
        msg: `账号【${userId}】已绑定，请勿重复绑定！`,
        data: null
      });
    }

    // 存储绑定信息
    const bindRecord = {
      userId,
      imId,
      watchId: watchId || '未填写',
      bindTime: new Date().toLocaleString('zh-CN')
    };
    bindedUsers.push(bindRecord);

    // 返回成功响应
    res.status(200).json({
      code: 200,
      msg: `绑定成功！已将账号【${userId}】绑定至小天才BOT`,
      data: bindRecord
    });

  } catch (error) {
    // 全局异常捕获
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误：' + error.message,
      data: null
    });
  }
});

// 托管前端页面（访问根路径即显示完整网页）
app.get('/', (req, res) => {
  const frontEndHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XTC_BOT - 小天才助手</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "微软雅黑", "Microsoft YaHei", sans-serif;
        }
        body {
            background-color: #f5f7fa;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
        }
        h1 {
            color: #2d3748;
            text-align: center;
            margin-bottom: 35px;
            font-size: 32px;
            font-weight: 600;
        }
        /* 绑定区域样式 */
        .bind-section {
            background: #e8f4fd;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 35px;
            border: 1px solid #d1e7fd;
        }
        .bind-section h2 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 24px;
            text-align: center;
            font-weight: 500;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2d3748;
            font-weight: 500;
            font-size: 16px;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
        .btn {
            width: 100%;
            padding: 14px;
            background-color: #4299e1;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #3182ce;
        }
        .btn:disabled {
            background-color: #9f7aea;
            cursor: not-allowed;
            opacity: 0.8;
        }
        .status {
            margin-top: 20px;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            font-size: 16px;
            display: none;
        }
        .success {
            background-color: #d4edda;
            color: #28a745;
            display: block;
        }
        .error {
            background-color: #f8d7da;
            color: #dc3545;
            display: block;
        }
        /* 功能菜单样式 */
        .menu-section {
            margin-bottom: 30px;
            padding: 25px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            background-color: #f8fafc;
        }
        .menu-section h2 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
            border-left: 4px solid #4299e1;
            padding-left: 12px;
        }
        .command-item {
            margin: 12px 0;
            padding: 12px;
            background-color: #ffffff;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .command {
            color: #e53e3e;
            font-weight: 600;
            margin-right: 10px;
            cursor: pointer;
            user-select: none;
        }
        .command:hover {
            color: #c53030;
        }
        .desc {
            color: #4a5568;
            font-size: 15px;
        }
        .privilege {
            color: #9f7aea;
            font-size: 14px;
            margin-top: 8px;
            padding-left: 20px;
        }
        .copy-tip {
            font-size: 13px;
            color: #718096;
            margin-top: 5px;
            display: none;
            padding-left: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 XTC_BOT 小天才助手</h1>

        <!-- 绑定功能区域 -->
        <div class="bind-section">
            <h2>小天才BOT账号绑定</h2>
            <div class="form-group">
                <label for="userId">用户账号/手机号</label>
                <input type="text" id="userId" placeholder="请输入你的小天才账号或手机号" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="imId">IM账号（必填）</label>
                <input type="text" id="imId" placeholder="请输入小天才IM标识" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="watchId">手表ID（选填）</label>
                <input type="text" id="watchId" placeholder="请输入手表唯一标识（选填）" autocomplete="off">
            </div>
            <button class="btn" id="bindBtn" onclick="bindBot()">立即绑定</button>
            <div class="status" id="bindStatus"></div>
        </div>

        <!-- 基础功能区 -->
        <div class="menu-section">
            <h2>🔧 基础功能</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/help [num]</span>
                <span class="desc">→ 查看对应页数的BOT菜单（默认显示第一页）</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/binduser</span>
                <span class="desc">→ 绑定自己的账号和IM账号至BOT</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/getkey</span>
                <span class="desc">→ 获取自己的激活码</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/ac [code]</span>
                <span class="desc">→ 使用激活码完成账号激活</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/bindwatch</span>
                <span class="desc">→ 保存手表信息至BOT（需私聊发送）</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>

        <!-- 账号管理区 -->
        <div class="menu-section">
            <h2>👤 账号管理</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/myinfo</span>
                <span class="desc">→ 查看已绑定到BOT的个人信息（需私聊）</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/unbinduser</span>
                <span class="desc">→ 解绑已绑定的用户账号</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/unbindim</span>
                <span class="desc">→ 解绑已绑定的IM账号</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>

        <!-- 手表信息区 -->
        <div class="menu-section">
            <h2>⌚ 手表信息</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/getidinfo</span>
                <span class="desc">→ 查看手表详细设备信息</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/getinfo</span>
                <span class="desc">→ 获取手表基础信息</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>

        <!-- 动态/社交区 -->
        <div class="menu-section">
            <h2>📢 动态/社交</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/moment1 [背景ID] [内容]</span>
                <span class="desc">→ 发送自定义灰字动态到朋友圈</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/momentpic [图片]</span>
                <span class="desc">→ 发送自定义图片动态到朋友圈</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/getlist</span>
                <span class="desc">→ 获取手表全部好友列表及WatchID</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>

        <!-- 运动数据区 -->
        <div class="menu-section">
            <h2>🏃 运动数据</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/sport [num]</span>
                <span class="desc">→ 刷满当天运动能量值</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/sit-up [num]</span>
                <span class="desc">→ 上传自定义仰卧起坐数据</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/run [参数]</span>
                <span class="desc">→ 上传自定义跑步数据（例：50=50米0秒）</span>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>

        <!-- 管理/代理区 -->
        <div class="menu-section">
            <h2>🛡️ 管理/代理功能（权限专用）</h2>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/add @xxx</span>
                <span class="desc">→ 管理员激活指定用户</span>
                <div class="privilege">🔑 权限要求：管理权限</div>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
            <div class="command-item">
                <span class="command" onclick="copyCommand(this)">/set M</span>
                <span class="desc">→ 设置普通代理权限</span>
                <div class="privilege">🔑 权限要求：BOT主</div>
                <div class="copy-tip">✅ 命令已复制到剪贴板</div>
            </div>
        </div>
    </div>

    <script>
        // 复制命令到剪贴板功能（兼容所有浏览器）
        function copyCommand(element) {
            const commandText = element.textContent.trim();
            // 兼容旧浏览器
            if (navigator.clipboard) {
                navigator.clipboard.writeText(commandText).catch(err => {
                    alert('复制失败：' + err.message);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = commandText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            // 显示复制提示
            const tip = element.nextElementSibling.nextElementSibling || element.parentElement.querySelector('.copy-tip');
            tip.style.display = 'block';
            setTimeout(() => {
                tip.style.display = 'none';
            }, 2000);
        }

        // 绑定BOT核心函数
        async function bindBot() {
            const userId = document.getElementById('userId').value.trim();
            const imId = document.getElementById('imId').value.trim();
            const watchId = document.getElementById('watchId').value.trim();
            const statusEl = document.getElementById('bindStatus');
            const btnEl = document.getElementById('bindBtn');

            // 清空之前的状态提示
            statusEl.className = 'status';
            statusEl.textContent = '';

            // 前端校验
            if (!userId) {
                statusEl.className = 'status error';
                statusEl.textContent = '❌ 请输入用户账号/手机号！';
                return;
            }
            if (!imId) {
                statusEl.className = 'status error';
                statusEl.textContent = '❌ 请输入IM账号（必填项）！';
                return;
            }

            // 禁用按钮防止重复提交
            btnEl.disabled = true;
            btnEl.textContent = '绑定中...';

            try {
                // 发送绑定请求
                const response = await fetch('/bindBot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, imId, watchId })
                });

                const result = await response.json();

                if (result.code === 200) {
                    // 绑定成功
                    statusEl.className = 'status success';
                    statusEl.textContent = result.msg;
                    // 清空表单
                    document.getElementById('userId').value = '';
                    document.getElementById('imId').value = '';
                    document.getElementById('watchId').value = '';
                } else {
                    // 业务错误
                    statusEl.className = 'status error';
                    statusEl.textContent = result.msg;
                }
            } catch (error) {
                // 网络/服务器错误
                statusEl.className = 'status error';
                statusEl.textContent = '❌ 绑定失败：服务器未启动或网络异常！';
                console.error('绑定请求异常：', error);
            } finally {
                // 恢复按钮状态
                btnEl.disabled = false;
                btnEl.textContent = '立即绑定';
            }
        }
    </script>
</body>
</html>
  `;

  res.send(frontEndHTML);
});

// 启动服务并打印提示
app.listen(port, () => {
  console.log('\n=========================================');
  console.log('🎉 小天才BOT完整服务启动成功！');
  console.log(`🌐 网页访问地址：http://localhost:${port}`);
  console.log(`🔗 绑定接口地址：http://localhost:${port}/bindBot`);
  console.log('=========================================\n');
});
