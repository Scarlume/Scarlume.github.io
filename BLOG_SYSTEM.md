# Scarlume 博客系统使用指南

## 概述

这是一个基于 Astro 构建的现代化博客系统，支持多级分类、标签管理、时间归档等功能。

## 功能特性

### 📝 文章管理

- **Markdown 支持**：使用 Markdown 格式编写文章
- **Frontmatter 元数据**：丰富的文章元信息
- **动态路由**：自动生成文章页面

### 🗂️ 组织方式

- **时间归档**：按年份展示所有文章
- **多级分类**：支持递归分类结构
- **标签系统**：灵活的标签管理
- **URL 结构**：`/year/month/day/slug` 格式

### 🎨 用户界面

- **响应式设计**：适配各种设备
- **暗色模式**：支持明暗主题切换
- **导航面包屑**：清晰的页面层级
- **搜索友好**：优秀的 SEO 支持

## 目录结构

```
src/
├── components/          # 可复用组件
│   ├── BlogPost.astro   # 文章卡片组件
│   ├── Header.astro     # 页面头部
│   ├── Navigation.astro # 导航菜单
│   └── ...
├── layouts/             # 页面布局
│   ├── BaseLayout.astro # 基础布局
│   └── MarkdownPostLayout.astro # 文章布局
├── pages/               # 路由页面
│   ├── [year]/[month]/[day]/[slug].astro # 文章动态路由
│   ├── archive.astro    # 归档页面
│   ├── categories/      # 分类相关页面
│   ├── tags/           # 标签相关页面
│   ├── blog.astro      # 博客列表
│   └── ...
├── utils/              # 工具函数
│   └── posts.ts        # 文章处理工具
└── styles/             # 样式文件
    └── global.css      # 全局样式
```

## 文章编写

### 1. 创建文章

在 `src/pages/YYYY/MM/DD/` 目录下创建 Markdown 文件：

```
src/pages/2024/01/15/my-post.md
```

### 2. Frontmatter 格式

每篇文章需要包含以下元数据：

```yaml
---
layout: ../../../../layouts/MarkdownPostLayout.astro
title: '文章标题'
pubDate: 2024-01-15
description: '文章描述，用于 SEO 和摘要显示'
author: '作者名称'
categories:
  - '技术'
  - '前端'
  - 'React'
tags: ['react', 'javascript', 'tutorial']
slug: 'my-post'
draft: false # 可选，默认为 false
image: # 可选
  url: 'https://example.com/image.jpg'
  alt: '图片描述'
---
```

### 3. 分类系统

支持多级分类，使用数组表示层级关系：

```yaml
categories:
  - '技术' # 第一级：技术
  - '前端' # 第二级：前端
  - 'React' # 第三级：React
```

这表示文章属于 `技术/前端/React` 类别，系统会自动生成：

- `技术` (主分类)
- `技术/前端` (二级分类)
- `技术/前端/React` (三级分类)

其他示例：

```yaml
# 生活类文章
categories:
  - '生活'
  - '思考'

# 技术类文章
categories:
  - '技术'
  - '后端'
  - 'Node.js'
```

### 4. URL 生成规则

文章 URL 格式：`/年份/月份/日期/slug`

例如：

- 文件：`src/pages/2024/01/15/my-first-post.md`
- URL：`/2024/01/15/my-first-post`

## 页面说明

### 首页 (/)

- 网站介绍和特色展示
- 交互式欢迎组件

### 博客 (/blog)

- 按时间倒序显示所有文章
- 文章卡片包含标题、描述、日期、标签

### 归档 (/archive)

- 按年份分组显示文章
- 时间线样式展示
- 包含文章标题、日期、描述、标签

### 分类 (/categories)

- **索引页**：显示所有分类和子分类
- **分类页**：显示特定分类下的文章
- 支持面包屑导航

### 标签 (/tags)

- **索引页**：显示所有标签
- **标签页**：显示特定标签下的文章

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 文章迁移

如果你有现有的文章需要迁移到新的目录结构，可以使用迁移脚本：

```bash
node scripts/migrate-posts.js
```

该脚本会：

1. 读取 `src/pages/posts/` 目录下的文章
2. 根据 `pubDate` 和 `slug` 创建新的目录结构
3. 更新 layout 路径
4. 删除原文件

## 最佳实践

### 1. 文章组织

- 使用有意义的 slug，避免中文和特殊字符
- 合理设置分类层级，不要过深
- 标签使用英文，便于 URL 友好

### 2. SEO 优化

- 填写完整的 description
- 使用合适的标题层级
- 添加 alt 属性给图片

### 3. 性能优化

- 图片使用适当的格式和大小
- 避免过长的文章内容
- 合理使用标签数量

### 4. 内容质量

- 保持文章结构清晰
- 使用代码块展示代码
- 添加适当的链接和引用

## 扩展功能

### 计划中的功能

- [ ] 全文搜索
- [ ] 相关文章推荐
- [ ] RSS 订阅
- [ ] 评论系统集成
- [ ] 阅读时间估算
- [ ] 文章目录生成

### 自定义开发

- 修改 `src/utils/posts.ts` 添加新的工具函数
- 在 `src/components/` 创建新的组件
- 扩展 Frontmatter 字段支持更多元数据

## 部署

推荐部署平台：

- **GitHub Pages**：免费，与 GitHub 集成
- **Vercel**：快速部署，优秀的性能
- **Netlify**：功能丰富，支持表单处理

构建命令：`npm run build`
输出目录：`dist/`

## 故障排除

### 常见问题

1. **文章不显示**
   - 检查 Frontmatter 格式是否正确
   - 确认 `draft` 字段不为 `true`
   - 验证日期格式：`YYYY-MM-DD`

2. **分类页面 404**
   - 确认分类名称拼写正确
   - 检查 URL 编码问题

3. **样式问题**
   - 清除浏览器缓存
   - 检查 CSS 文件是否正确加载

### 调试技巧

- 使用 `npm run dev` 查看详细错误信息
- 检查浏览器开发者工具的控制台
- 验证 Markdown 语法是否正确

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个博客系统！

## 许可证

MIT License
