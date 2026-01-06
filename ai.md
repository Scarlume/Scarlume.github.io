# Scarlume 项目架构与技术选型

## 项目概述

Scarlume 是一个基于 Astro 框架构建的现代化个人博客网站，采用静态站点生成（SSG）架构，专注于性能优化和开发体验。

## 核心技术栈

### 前端框架

- **Astro 5.16.6** - 主框架，提供静态站点生成和组件岛屿架构
- **Preact 10.28.1** - 轻量级 React 替代方案，用于交互式组件
- **TypeScript** - 类型安全的 JavaScript 超集

### 构建工具与开发环境

- **Vite** - 快速的构建工具（Astro 内置）
- **ESLint 9.39.2** - 代码质量检查
- **Prettier 3.7.4** - 代码格式化
- **Husky 9.1.7** - Git hooks 管理
- **lint-staged 16.2.7** - 暂存文件检查

## 项目架构

### 目录结构

```
scarlume/
├── .astro/                 # Astro 生成的类型定义和配置
├── .github/               # GitHub Actions 工作流
├── .husky/                # Git hooks 配置
├── public/                # 静态资源
├── src/
│   ├── components/        # 可复用组件
│   │   ├── BlogPost.astro
│   │   ├── Footer.astro
│   │   ├── Greeting.jsx   # Preact 交互组件
│   │   ├── Header.astro
│   │   ├── Menu.astro
│   │   ├── Navigation.astro
│   │   ├── Social.astro
│   │   └── ThemeIcon.astro
│   ├── layouts/           # 页面布局模板
│   │   ├── BaseLayout.astro
│   │   └── MarkdownPostLayout.astro
│   ├── pages/             # 路由页面
│   │   ├── posts/         # 博客文章
│   │   ├── tags/          # 标签页面
│   │   ├── about.astro
│   │   ├── blog.astro
│   │   └── index.astro
│   ├── scripts/           # 客户端脚本
│   │   └── menu.js
│   └── styles/            # 样式文件
│       └── global.css
├── dist/                  # 构建输出目录
└── 配置文件
```

### 组件架构

#### 1. 静态组件（.astro）

- 服务端渲染，零 JavaScript 运行时
- 用于页面结构、布局和静态内容
- 支持组件组合和插槽（slot）

#### 2. 交互组件（.jsx）

- 使用 Preact 实现客户端交互
- 采用组件岛屿架构，按需加载
- 通过 `client:load` 指令控制水合时机

### 样式方案

- **Scoped CSS** - 组件级样式隔离
- **Global CSS** - 全局样式和 CSS 变量
- **Dark Mode** - 基于 CSS 媒体查询的主题切换

## 技术选型理由

### 为什么选择 Astro？

1. **性能优先** - 默认零 JavaScript，按需加载
2. **组件岛屿** - 精确控制交互性，避免不必要的 JavaScript
3. **框架无关** - 可以混合使用不同前端框架
4. **SEO 友好** - 静态生成，搜索引擎优化
5. **开发体验** - 热重载，TypeScript 支持

### 为什么选择 Preact？

1. **轻量级** - 仅 3KB，比 React 小 90%
2. **兼容性** - 与 React 生态系统兼容
3. **性能** - 更快的渲染和更小的包体积
4. **适合博客** - 简单交互场景的理想选择

## 开发工作流

### 代码质量保证

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  }
}
```

### Git Hooks

- **pre-commit** - 自动运行 ESLint 和 Prettier
- **lint-staged** - 只检查暂存的文件

### ESLint 配置特点

- 使用 ESM 配置格式
- 集成 Astro 官方规则
- TypeScript 支持
- 针对不同文件类型的差异化规则

## 部署策略

### 静态部署

- **目标平台** - GitHub Pages
- **构建命令** - `npm run build`
- **输出目录** - `dist/`
- **基础路径** - 配置为根路径 `/`

### 性能优化

1. **静态生成** - 构建时预渲染所有页面
2. **代码分割** - 按组件岛屿自动分割
3. **资源优化** - 自动压缩和优化静态资源
4. **缓存策略** - 利用 CDN 和浏览器缓存

## 扩展性考虑

### 内容管理

- 支持 Markdown 文件作为内容源
- 可扩展为 CMS 集成（如 Strapi、Contentful）
- 支持 MDX 格式的富交互内容

### 功能扩展

- 评论系统集成
- 搜索功能
- RSS 订阅
- 多语言支持
- 分析统计

### 性能监控

- Core Web Vitals 监控
- 构建时间优化
- 包大小分析

## 最佳实践

1. **组件设计** - 优先使用 .astro 组件，仅在需要交互时使用 .jsx
2. **样式管理** - 使用 scoped styles 避免样式冲突
3. **类型安全** - 充分利用 TypeScript 类型检查
4. **代码规范** - 统一的 ESLint 和 Prettier 配置
5. **版本控制** - 规范的 Git 提交和分支管理

这个架构设计确保了网站的高性能、良好的开发体验和未来的可扩展性。
