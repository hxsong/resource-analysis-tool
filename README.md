# 资源数据分析工具

## 项目简介
基于React+TypeScript开发的飞书侧边栏插件，用于资源数据可视化分析与表格数据处理。

## 核心功能
- 📊 飞书表格数据同步与解析
- 🔍 多维度数据分析与可视化展示
- 🌐 国际化支持（中/英文）
- 📱 响应式设计，适配不同设备尺寸
- ⚡ 实时数据更新与缓存机制

## 快速开始

### 环境要求
- Node.js 14+ 
- npm 6+
- 飞书开发者账号

### 安装与开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

## 使用方法
1. 在飞书多维表格中安装本插件
2. 选择需要分析的表格数据
3. 在侧边栏中选择分析维度
4. 查看可视化分析结果
5. 导出分析报告（支持CSV/Excel格式）

## 项目结构
```
src/
├── components/      # UI组件
│   ├── analysis/    # 数据分析组件
│   └── common/      # 通用组件
├── hooks/           # 自定义钩子
│   └── useTableData.ts # 表格数据处理钩子
├── App.tsx          # 应用入口组件
└── index.tsx        # 渲染入口
```

## 部署说明
项目已配置GitHub Pages自动部署：
- 在线访问地址：https://hxsong.github.io/resource-analysis-tool/
- 部署分支：gh-pages

## 开发文档
- [飞书扩展开发指南](https://lark-technologies.larksuite.com/docx/HvCbdSzXNowzMmxWgXsuB2Ngs7d)
- [多维表格API文档](https://feishu.feishu.cn/docx/U3wodO5eqome3uxFAC3cl0qanIe)

## 发布流程
1. 执行构建命令生成dist目录
   ```bash
   npm run build
   ```
2. 提交代码到main分支
3. 推送dist目录到gh-pages分支
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```
4. 填写飞书插件发布表单
   [插件发布申请表](https://feishu.feishu.cn/share/base/form/shrcnGFgOOsFGew3SDZHPhzkM0e)