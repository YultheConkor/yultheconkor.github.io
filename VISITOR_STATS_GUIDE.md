# 访问统计功能配置指南

## 📋 概述

本指南介绍如何在个人主页上配置和使用多种访问统计功能。目前已集成的解决方案包括：

1. **Busuanzi (不蒜子)** ✅ 已启用 - 显示网站总访问量和访客数
2. **Ipapi 地理定位** ⚙️ 可选 - 显示当前访问者的国家
3. **Google Analytics** ⚙️ 可选 - 完整的访问分析工具
4. **StatCounter** ⚙️ 可选 - 第三方访问统计服务

---

## 🚀 快速开始

### 方案 1：使用 Busuanzi（推荐）

**状态**：✅ 已自动启用

配置文件：`_includes/footer/custom.html`

**特点**：
- ✨ 无需任何配置
- 🌍 支持全球访客统计
- 📊 显示总访问量和唯一访客数
- ⚡ 异步加载，不影响网站速度

**显示位置**：网站页脚底部

**自定义样式示例**：
```html
<!-- 修改颜色 -->
<div style="color: #0066cc;">  <!-- 改为蓝色 -->

<!-- 修改字体大小 -->
<div style="font-size: 1em;">  <!-- 改为更大 -->

<!-- 隐藏边框 -->
<div style="border-top: none;">  <!-- 移除顶部边框 -->
```

---

### 方案 2：启用地理位置追踪

**状态**：⚙️ 需要手动启用

1. 打开文件：`_includes/footer/custom.html`

2. 找到以下注释代码（第 42 行）：
```html
<!-- <p id="geo-location-info" style="margin-top: 10px; font-size: 0.85em; color: #999;"></p> -->
```

3. 移除注释符号，改为：
```html
<p id="geo-location-info" style="margin-top: 10px; font-size: 0.85em; color: #999;"></p>
```

4. 找到以下注释代码块（第 62-75 行）：
```javascript
<!-- Optional: Geo-location tracking using ipapi (uncomment to enable)
<script>
  // Fetch visitor's country information
  fetch('https://ipapi.co/json/')
    ...
</script>
-->
```

5. 取消注释整个 `<script>` 块，保留 HTML 注释符号：
```javascript
<!-- Optional: Geo-location tracking using ipapi (uncomment to enable) -->
<script>
  // Fetch visitor's country information
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      const geoInfo = document.getElementById('geo-location-info');
      if (geoInfo) {
        geoInfo.innerHTML = `🌍 来自 <strong>${data.country_name}</strong> (${data.country_code})`;
      }
    })
    .catch(error => console.log('Geo-location fetch failed', error));
</script>
```

**特点**：
- 📍 显示当前访问者的国家和国家代码
- ⚡ 实时获取地理位置信息
- 🔒 使用 ipapi 免费 API（不需要密钥）
- 👤 仅显示当前访问者信息，不存储数据

**显示示例**：
```
🌍 来自 China (CN)
```

---

### 方案 3：使用 Google Analytics（高级）

如需更详细的访问统计分析（包括访问来源国家、访问时长、页面流量等）：

1. 在 [Google Analytics](https://analytics.google.com/) 注册账户

2. 编辑 `_config.yml`：
```yaml
analytics:
  provider: "google-analytics-4"  # 改为 "google-analytics-4"
  google:
    tracking_id: "G-XXXXXXXXXX"  # 替换为您的追踪 ID
```

3. 保存并重建网站

**特点**：
- 📊 完整的访问数据分析
- 🌍 按国家显示访问统计
- 📱 设备和浏览器分析
- 🔗 访问流量来源追踪
- 📈 自定义报表和仪表板

---

### 方案 4：使用 StatCounter（可选）

如需第三方独立的访问统计：

1. 访问 [StatCounter](https://statcounter.com/)

2. 注册账户并创建项目

3. 复制提供的追踪代码

4. 将代码添加到 `_includes/footer/custom.html`：
```html
<!-- StatCounter Code -->
<script>
// 粘贴 StatCounter 代码
</script>
```

**特点**：
- 📊 独立的统计仪表板
- 🌍 地理位置分析（包括国家、城市、IP）
- 📱 访问设备信息
- 🔍 搜索关键词追踪
- 💰 免费版本可用

---

## 🎨 自定义选项

### 修改文本和样式

编辑 `_includes/footer/custom.html` 中的以下部分：

#### 更改显示文本
```html
<!-- 原文本 -->
📊 本站总访问量：

<!-- 改为 -->
📈 Page Views:
```

#### 更改样式
```html
<!-- 原样式 -->
<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 0.9em; color: #666;">

<!-- 自定义示例 -->
<div style="
  margin-top: 30px; 
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center; 
  font-size: 1em; 
  color: #333;
  font-weight: bold;
">
```

### 隐藏统计信息

如果只想显示某一项统计，注释掉不需要的部分：

```html
<!-- 只显示访客数，隐藏访问量 -->
<span id="busuanzi_container_site_pv" style="display:none;">
  <!-- 访问量已隐藏 -->
</span>

<span id="busuanzi_container_site_uv">
  👤 本站访客数：<span id="busuanzi_value_site_uv">加载中...</span>
</span>
```

---

## ⚙️ 常见问题

### Q1: 为什么访问量显示"加载中..."？
- A: 这是正常的。Busuanzi 数据需要异步加载，通常需要 1-3 秒钟显示数据。

### Q2: 本地测试（localhost）的访问会被计入吗？
- A: 不会。Busuanzi 自动排除 localhost 访问。

### Q3: 国家统计何时更新？
- A: Busuanzi 数据实时更新，但 Google Analytics 数据可能有 24-48 小时延迟。

### Q4: 多个统计工具会影响网站速度吗？
- A: 不会明显影响。所有脚本都是异步加载的。

### Q5: 如何查看历史统计数据？
- A: 
  - **Busuanzi**：需要使用 ipapi 之类的实时工具
  - **Google Analytics**：在 GA 仪表板查看
  - **StatCounter**：在 StatCounter 仪表板查看

---

## 📚 参考链接

- **Busuanzi 官网**: https://busuanzi.ibruce.info/
- **Ipapi 官网**: https://ipapi.co/
- **Google Analytics**: https://analytics.google.com/
- **StatCounter**: https://statcounter.com/

---

## 🔒 隐私注意事项

- ✅ Busuanzi：不存储个人信息，仅统计访问数
- ✅ Ipapi：仅获取国家信息，不存储 IP 地址
- ✅ Google Analytics：遵循 Google 隐私政策
- ✅ 建议在隐私政策中声明使用的分析工具

---

## 📝 更新日志

- **2025-10-22**：添加 Busuanzi 访问统计功能
- **2025-10-22**：添加可选的地理位置追踪功能
- **2025-10-22**：创建本配置指南
