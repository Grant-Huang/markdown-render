import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import './index.css'; // 添加样式支持
import { debounce } from 'lodash'; // Import lodash for debouncing

// 初始化 mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// 生成安全的 ID
const generateId = () => {
  return 'mermaid-' + Math.random().toString(36).substr(2, 9);
};

// Mermaid 组件
const Mermaid = ({ chart }: { chart: string }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (elementRef.current) {
        elementRef.current.innerHTML = '';
        try {
          const { svg } = await mermaid.render(
            'mermaid-diagram',
            chart
          );
          elementRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering failed:', error);
          elementRef.current.innerHTML = '图表渲染失败';
        }
      }
    };

    renderChart();
  }, [chart]);

  return <div className="mermaid-diagram" ref={elementRef} />;
};

// 自定义组件映射
const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    if (language === 'mermaid') {
      return <Mermaid chart={code} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const App = () => {
  const [markdown, setMarkdown] = useState(`# Hello, Markdown!

\`\`\`mermaid
graph TD
    A[开始] --> B{判断}
    B -->|Yes| C[执行]
    B -->|No| D[结束]
    C --> D
\`\`\`

## 时序图示例

\`\`\`mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    A->>B: 发送请求
    B->>A: 返回响应
\`\`\`
`);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleEdit = () => {
    setIsPreviewMode(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px' }}>
        <button 
          onClick={handlePreview}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          预览
        </button>
        <button 
          onClick={handleEdit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          编辑
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <Split
          sizes={[50, 50]}
          minSize={200}
          style={{ display: 'flex', height: '100%', width: '100%' }}
        >
          <textarea
            style={{ 
              width: '100%', 
              height: '100%', 
              padding: '10px', 
              fontSize: '16px',
              border: 'none',
              resize: 'none',
              outline: 'none'
            }}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            disabled={isPreviewMode}
          />
          <div
            style={{ 
              width: '100%', 
              height: '100%', 
              padding: '10px', 
              overflow: 'auto',
              backgroundColor: '#f5f5f5'
            }}
          >
            <ReactMarkdown components={components}>
              {markdown}
            </ReactMarkdown>
          </div>
        </Split>
      </div>
    </div>
  );
};

// 更新渲染方式
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}