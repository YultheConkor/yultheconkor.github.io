# 👥 访问者位置地图 - 快速开始

## 🎯 这是什么？

一个实时显示你网站访问者地理位置的Leaflet地图，集成在你的主页footer中。

```
┌─────────────────────────────────────┐
│ 👥 Visitors by Location             │
├─────────────────────────────────────┤
│  [地图显示全球访问者分布]           │
│  [红色标记=你当前的位置]            │
│  [蓝色-红色标记=其他访问者]         │
└─────────────────────────────────────┘
Total: 42 visitors from 15 countries
```

---

## 📊 系统架构

```
用户访问 → 获取IP → 显示在地图上 → 保存到Gist → 热力图更新
```

关键组件：
- **前端**: Leaflet地图 + IP地理定位
- **后端**: Vercel Serverless Function
- **存储**: GitHub Gist (自动同步)

---

## 📋 部署清单（5分钟）

### 1️⃣ 创建GitHub Gist
```
https://gist.github.com
内容: {"visitors": [], "updated_at": "..."}
保存Gist ID (从URL中提取)
```

### 2️⃣ 生成GitHub Token
```
https://github.com/settings/tokens/new
权限: gist
保存Token值
```

### 3️⃣ 配置Vercel环境变量
```
Dashboard → Settings → Environment Variables
GITHUB_TOKEN = 你的Token
GIST_ID = 你的Gist ID
GITHUB_USERNAME = YultheConkor
```

### 4️⃣ 更新前端URL
```
文件: /assets/js/visitor-tracker.js
行80: 将PLACEHOLDER_GIST_ID改为你的实际ID
```

### 5️⃣ 推送代码
```bash
git add .
git commit -m "Add visitor tracking map"
git push origin master
```

完成！Vercel会自动部署 ✅

---

## 📚 详细文档

- **快速指南**: 查看 `QUICK_SETUP.md` (5分钟)
- **详细配置**: 查看 `VISITOR_MAP_SETUP.md` (完整步骤)
- **系统架构**: 查看 `ARCHITECTURE.md` (技术细节)
- **部署清单**: 查看 `DEPLOYMENT_CHECKLIST.md` (逐项检查)

---

## ✨ 特性

✅ 实时访问者位置追踪
✅ 城市级别地理定位
✅ 自动数据同步到GitHub
✅ 隐私保护（IP哈希）
✅ 异步非阻塞加载
✅ 完全免费部署

---

## 🔧 文件结构

```
/api/track-visitor.js                 ← Vercel后端函数
/assets/js/visitor-tracker.js         ← 前端脚本
/_includes/footer/custom.html         ← 页面集成

QUICK_SETUP.md                        ← 快速指南
VISITOR_MAP_SETUP.md                  ← 详细配置
ARCHITECTURE.md                       ← 系统架构
DEPLOYMENT_CHECKLIST.md               ← 部署清单
```

---

## ❓ 常见问题

**Q: 地图不显示？**
A: 清除浏览器缓存，检查Leaflet库是否加载

**Q: 数据没保存？**
A: 检查GitHub Token和GIST_ID是否正确

**Q: IP定位失败？**
A: ip-api.com有速率限制，检查网络连接

---

## 🚀 下一步

1. 按照DEPLOYMENT_CHECKLIST.md部署
2. 分享网站积累访问数据
3. 观察地图中的访问分布

---

**创建时间**: 2025-10-22
**版本**: 1.0
**状态**: 📝 准备部署

开始吧！→ 查看 `QUICK_SETUP.md`
