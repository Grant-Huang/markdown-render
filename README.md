# Markdown 编辑器 | Markdown Editor

一个支持 Mermaid 图表的 Markdown 编辑器，使用 React 和 TypeScript 构建。

A Markdown editor with Mermaid diagram support, built with React and TypeScript.

## 功能特点 | Features

- 实时预览 Markdown 内容 | Real-time Markdown preview
- 支持 Mermaid 图表渲染 | Mermaid diagram rendering support
- 分屏编辑模式 | Split-screen editing mode
- 响应式设计 | Responsive design

## 支持的图表类型 | Supported Diagram Types

- 流程图 | Flowchart (graph TD)
- 时序图 | Sequence Diagram (sequenceDiagram)
- 甘特图 | Gantt Chart (gantt)
- 饼图 | Pie Chart (pie)
- 类图 | Class Diagram (classDiagram)
- 状态图 | State Diagram (stateDiagram-v2)
- 实体关系图 | Entity Relationship Diagram (erDiagram)

## 开始使用 | Getting Started

1. 克隆仓库 | Clone the repository：
```bash
git clone https://github.com/Grant-Huang/markdown-render.git
```

2. 安装依赖 | Install dependencies：
```bash
npm install
```

3. 启动开发服务器 | Start the development server：
```bash
npm start
```

4. 在浏览器中打开 | Open in browser：http://localhost:3000

## 使用示例 | Usage Examples

```markdown
# 流程图示例 | Flowchart Example

\`\`\`mermaid
graph TD
    A[开始 | Start] --> B{判断 | Decision}
    B -->|Yes| C[执行 | Execute]
    B -->|No| D[结束 | End]
    C --> D
\`\`\`

## 时序图示例 | Sequence Diagram Example

\`\`\`mermaid
sequenceDiagram
    participant A as 用户 | User
    participant B as 系统 | System
    A->>B: 发送请求 | Send Request
    B->>A: 返回响应 | Send Response
\`\`\`
```

## 技术栈 | Tech Stack

- React
- TypeScript
- Mermaid.js
- React-Markdown
- React-Split

## 开发环境要求 | Development Requirements

- Node.js >= 14.0.0
- npm >= 6.14.0

## 浏览器支持 | Browser Support

- Chrome (推荐 | Recommended)
- Firefox
- Safari
- Edge

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

## 许可证 | License

MIT