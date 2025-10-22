# 🚀 快速配置清单 - 访问者位置地图

## 📋 你需要准备的信息

在开始之前，请收集以下信息：

- [ ] **GitHub用户名**: `YultheConkor`
- [ ] **Gist ID**: `_______________________` (从URL获取)
- [ ] **Gist Raw URL**: `_______________________`
- [ ] **GitHub Token**: `_______________________`

---

## 🔄 配置流程（5分钟）

### **步骤1️⃣：创建GitHub Gist**

```
1. 打开 https://gist.github.com
2. 复制以下内容到新Gist：

{
  "visitors": [],
  "updated_at": "2025-10-22T00:00:00Z"
}

3. 选择 Public
4. 点击 "Create public gist"
5. 记下URL中的ID
   例如：https://gist.github.com/YultheConkor/abc123def456
   ID就是：abc123def456
```

✅ **完成后**: 保存Gist ID和Raw URL

---

### **步骤2️⃣：生成GitHub Token**

```
1. 打开 https://github.com/settings/tokens/new
2. Token name: yultheconkor-visitor-tracker
3. Expiration: 90 days
4. Scopes: 勾选 "gist"
5. 点击 "Generate token"
6. 立即复制Token（只显示一次！）
```

✅ **完成后**: 保存Token

---

### **步骤3️⃣：配置Vercel环境变量**

```
1. 打开 https://vercel.com/dashboard
2. 选择项目 "yultheconkor.github.io"
3. 点击 Settings → Environment Variables
4. 添加三个变量：

   ┌─────────────────────┬──────────────────┐
   │ GITHUB_TOKEN        │ 你的Token        │
   ├─────────────────────┼──────────────────┤
   │ GIST_ID             │ abc123def456     │
   ├─────────────────────┼──────────────────┤
   │ GITHUB_USERNAME     │ YultheConkor     │
   └─────────────────────┴──────────────────┘

5. 保存后，Vercel自动重新部署
```

✅ **完成后**: 所有环境变量已设置

---

### **步骤4️⃣：更新前端配置**

**编辑**: `/assets/js/visitor-tracker.js`

找到这一行（约第80行）：
```javascript
const gistUrl = `https://gist.githubusercontent.com/YultheConkor/PLACEHOLDER_GIST_ID/raw/`;
```

替换为你的实际URL：
```javascript
const gistUrl = `https://gist.githubusercontent.com/YultheConkor/abc123def456/raw/`;
```

✅ **完成后**: 配置已更新

---

### **步骤5️⃣：部署**

```bash
# 推送到GitHub
git add .
git commit -m "Add visitor tracking map"
git push origin master

# 等待Vercel自动部署（1-2分钟）
```

✅ **完成后**: 访问 https://yultheconkor.github.io 查看效果

---

## ✅ 验证清单

部署完成后，检查以下项目：

- [ ] 地图显示在footer中（265x130px）
- [ ] 地图能看到全球地图
- [ ] 你的位置显示为红色虚线圆圈
- [ ] 点击标记显示城市信息
- [ ] F12打开控制台，无红色错误
- [ ] 刷新页面2次后，Gist数据有新记录

---

## 🐛 常见问题

| 问题 | 解决方案 |
|------|--------|
| **地图不显示** | 清除浏览器缓存（Ctrl+Shift+Del） |
| **Gist未更新** | 检查Token是否正确，Vercel日志中是否有错误 |
| **IP地理定位失败** | 检查网络连接，ip-api.com可能有速率限制 |
| **Function 404** | 确认文件位置 `/api/track-visitor.js` 是否存在 |

---

## 📊 成功标志

✅ 如果看到以下界面，说明配置成功：

```
底部显示：
📍 Visitors by Location
[地图显示全球 + 圆形标记]
👥 Total Visitors | 👁️ Total Views
Total: 1 visitors from 1 countries
```

---

## 🎉 完成！

现在你的网站具备：
- 🗺️ 实时访问者位置地图
- 📊 城市级别访问统计
- 🔄 自动数据同步到GitHub
- 🔒 隐私保护（不存储完整IP）

---

## 💡 下一步

想要增强功能？尝试：
- 添加访问统计排行榜
- 实现热力图显示
- 导出月度报告
- 集成Google Analytics
