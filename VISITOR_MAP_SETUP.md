# 访问者位置地图系统 - 完整配置指南

## 📋 概览

这是一个实时访问者位置追踪系统，包含以下组件：
- 🗺️ **Leaflet地图** - 显示全球访问者分布
- 📍 **IP地理定位** - 获取访问者位置信息
- 🔄 **GitHub Gist** - 存储历史访问数据
- 🚀 **Vercel Function** - 后端API处理数据更新

---

## 🔧 配置步骤

### **第1步：创建GitHub Gist**

1. 打开 https://gist.github.com
2. 创建一个新的Gist，内容如下：

```json
{
  "visitors": [],
  "updated_at": "2025-10-22T00:00:00Z"
}
```

3. 选择 **Public**（公开）
4. **Create public gist**
5. **记下Gist ID**（URL中的随机字符串）
   - 例如：`https://gist.github.com/YultheConkor/abc123def456fg`
   - Gist ID = `abc123def456fg`
6. **记下Raw URL**（点击 Raw 按钮复制）
   - 格式：`https://gist.githubusercontent.com/YultheConkor/abc123def456fg/raw/...`

---

### **第2步：获取GitHub Personal Access Token**

1. 打开 https://github.com/settings/tokens/new
2. 设置以下参数：
   - **Token name**: `yultheconkor-visitor-tracker`
   - **Expiration**: `90 days` （或更长）
   - **Scopes**: 选择 `gist` ✅

3. 点击 **Generate token**
4. **立即复制Token**（只显示一次！）

---

### **第3步：Vercel中配置环境变量**

1. 打开 https://vercel.com/dashboard
2. 选择你的项目 `yultheconkor.github.io`
3. 进入 **Settings**
4. 点击 **Environment Variables**
5. 添加以下变量：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `GITHUB_TOKEN` | *你的Token* | GitHub Personal Access Token |
| `GIST_ID` | *你的Gist ID* | 例如：`abc123def456fg` |
| `GITHUB_USERNAME` | `YultheConkor` | 你的GitHub用户名 |

6. 点击 **Save** 后重新部署

---

### **第4步：更新前端配置**

编辑 `/assets/js/visitor-tracker.js`，找到以下行：

```javascript
const gistUrl = `https://gist.githubusercontent.com/YultheConkor/PLACEHOLDER_GIST_ID/raw/`;
```

替换为你的实际Gist Raw URL：

```javascript
const gistUrl = `https://gist.githubusercontent.com/YultheConkor/YOUR_GIST_ID/raw/`;
```

---

### **第5步：部署到Vercel**

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Add visitor tracking map"
   git push origin master
   ```

2. **Vercel自动部署**
   - Vercel会自动检测你的推送
   - 等待部署完成（通常 1-2 分钟）

3. **验证部署**
   - 打开你的网站：https://yultheconkor.github.io
   - 检查footer是否显示地图

---

## ✅ 测试清单

- [ ] 地图显示在footer上方（265x130px）
- [ ] 地图加载成功（显示地球）
- [ ] 当前位置标记为红色虚线圆圈
- [ ] 点击标记显示城市信息
- [ ] 浏览器控制台无错误（F12）
- [ ] Vercel Function `/api/track-visitor` 成功部署
- [ ] 刷新页面后，访问记录被保存到Gist
- [ ] 访问者信息正确显示

---

## 🐛 故障排查

### **问题1：地图显示为空白**
- 检查浏览器控制台是否有错误
- 确认Leaflet库是否正确加载
- 解决方案：
  ```bash
  # 清除浏览器缓存
  # 按Ctrl+Shift+Delete（Windows）或Cmd+Shift+Delete（Mac）
  ```

### **问题2：无法获取IP地理信息**
- ip-api.com 有速率限制（45请求/分钟）
- 解决方案：检查网络连接，稍后重试

### **问题3：Gist数据没有更新**
- 检查 `GITHUB_TOKEN` 是否正确
- 检查 `GIST_ID` 是否正确
- 检查Vercel Function日志：https://vercel.com/dashboard → Logs
- 命令检查Token：
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
  ```

### **问题4：错误 "Method not allowed"**
- 确认POST请求正确发送
- 检查Vercel Function文件位置：`/api/track-visitor.js`

---

## 📊 数据格式

### **Gist中的数据结构**

```json
{
  "visitors": [
    {
      "timestamp": "2025-10-22T10:30:00Z",
      "country": "China",
      "city": "Hangzhou",
      "latitude": 30.2741,
      "longitude": 120.1551,
      "ip_hash": "a1b2c3d4"
    },
    {
      "timestamp": "2025-10-22T11:15:00Z",
      "country": "United States",
      "city": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "ip_hash": "e5f6g7h8"
    }
  ],
  "updated_at": "2025-10-22T11:15:00Z"
}
```

---

## 🔒 隐私和安全

- ✅ **完整IP不被存储** - 仅存储IP的哈希值
- ✅ **Token安全** - 存储在Vercel环境变量，前端无法访问
- ✅ **HTTPS加密** - 所有数据传输都被加密
- ✅ **匿名统计** - 无法识别个人信息

---

## 🚀 可选增强功能

### **1. 添加实时热力图**

安装热力图库：
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js"></script>
```

### **2. 导出数据报告**

添加CSV导出功能

### **3. 自动清理旧数据**

在 `track-visitor.js` 中添加逻辑，删除超过N天的数据

### **4. 统计仪表板**

创建 `/stats/` 页面显示详细统计

---

## 💡 性能优化

- 使用sessionStorage避免重复追踪（每天仅追踪一次）
- 异步发送追踪请求，不阻塞页面加载
- 使用CDN加速地图瓦片加载

---

## 📞 支持

如有问题，请检查：
1. 浏览器控制台（F12 → Console）
2. Vercel日志（https://vercel.com/dashboard）
3. GitHub Gist内容是否正确更新

---

## 📝 更新日志

- **2025-10-22** - 初始版本发布
  - ✅ Leaflet地图集成
  - ✅ IP地理定位
  - ✅ Gist数据存储
  - ✅ Vercel Function后端
