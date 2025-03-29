import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './index.css'; // 添加样式支持
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

// Mermaid 配置
const mermaidConfig = {
  startOnLoad: false,  // 改为 false，我们手动控制渲染
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'sans-serif',
  flowchart: {
    htmlLabels: true,
    curve: 'linear'
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35
  },
  class: {  // 使用 class 而不是 classDiagram
    curve: 'linear',
    useMaxWidth: true
  }
} as any;

// 初始化 mermaid
mermaid.initialize(mermaidConfig);

// 图标组件
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
    <path d="M10 6H6v1h4V6zm0 2H6v1h4V8zm0 2H6v1h4v-1z"/>
  </svg>
);

const RunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2v12l8-6L4 2z"/>
  </svg>
);

// 复制按钮组件
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        fontSize: '12px',
        backgroundColor: copied ? '#4CAF50' : '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      }}
    >
      <CopyIcon />
      {copied ? '已复制' : '复制'}
    </button>
  );
};

// 运行按钮组件
const RunButton = ({ code }: { code: string }) => {
  const handleRun = async () => {
    try {
      // 使用 Windows Terminal 或 PowerShell 打开命令
      const encodedCommand = encodeURIComponent(code);
      window.open(`wt://run?command=${encodedCommand}`, '_blank');
    } catch (err) {
      console.error('Failed to run command:', err);
    }
  };

  return (
    <button
      onClick={handleRun}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        fontSize: '12px',
        backgroundColor: '#FF9800',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      <RunIcon />
      运行
    </button>
  );
};

// 创建 Context
const RenderContext = React.createContext(false);

// Mermaid 组件
const Mermaid = ({ chart }: { chart: string }) => {
  const shouldRender = React.useContext(RenderContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const renderChart = async () => {
      if (!elementRef.current || !shouldRender) return;

      try {
        // 重新初始化 mermaid
        mermaid.initialize({
          ...mermaidConfig,
          startOnLoad: false
        });

        // 清空之前的内容
        elementRef.current.innerHTML = '';
        
        // 生成唯一的 ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 渲染图表
        const { svg } = await mermaid.render(id, chart);
        
        // 如果组件还在，更新内容
        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
        }
        
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError('图表渲染失败，请检查语法');
      }
    };

    // 使用 setTimeout 确保 DOM 完全准备好
    setTimeout(renderChart, 0);
  }, [chart, shouldRender, key]);

  if (!shouldRender) {
    return (
      <div 
        style={{ 
          width: '100%',
          margin: '20px 0',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px dashed #ccc',
          color: '#666',
          textAlign: 'center'
        }}
      >
        点击预览按钮查看流程图
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{ 
          width: '100%',
          margin: '20px 0',
          padding: '20px',
          backgroundColor: '#fff3f3',
          borderRadius: '4px',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          textAlign: 'center'
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      style={{ 
        width: '100%',
        margin: '20px 0',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    />
  );
};

// 代码块组件
const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const isShellScript = language === 'cmd' || language === 'powershell' || language === 'bash' || language === 'sh';

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '8px 12px',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          color: '#333',
          fontSize: '14px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{language}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isShellScript && <RunButton code={code} />}
          <CopyButton code={code} />
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          fontSize: '14px',  // 设置代码字体大小
          lineHeight: '1.4'  // 调整行高以提高可读性
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// 自定义组件映射
const components = {
  code({ node, inline, className, children, ...props }: any) {
    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    // 优先处理 mermaid 图表
    if (language === 'mermaid') {
      return <Mermaid chart={code} />;
    }

    // 其他语言使用代码高亮
    if (language) {
      return <CodeBlock language={language} code={code} />;
    }

    // 普通代码块
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  // 表格组件
  table: ({ node, children, ...props }: any) => (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #ddd'
        }}
      >
        {children}
      </table>
    </div>
  ),
  
  thead: ({ node, children, ...props }: any) => (
    <thead
      style={{
        backgroundColor: '#f5f5f5'
      }}
    >
      {children}
    </thead>
  ),
  
  tbody: ({ node, children, ...props }: any) => (
    <tbody>
      {children}
    </tbody>
  ),
  
  tr: ({ node, children, ...props }: any) => (
    <tr
      style={{
        borderBottom: '1px solid #ddd'
      }}
    >
      {children}
    </tr>
  ),
  
  th: ({ node, children, ...props }: any) => (
    <th
      style={{
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        borderRight: '1px solid #ddd',
        borderBottom: '2px solid #ddd'
      }}
    >
      {children}
    </th>
  ),
  
  td: ({ node, children, ...props }: any) => (
    <td
      style={{
        padding: '12px',
        borderRight: '1px solid #ddd',
        borderBottom: '1px solid #ddd'
      }}
    >
      {children}
    </td>
  )
};

const App = () => {
  const [markdown, setMarkdown] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/example.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
        // 初始状态：非编辑，非预览
        setIsEditMode(false);
        setIsPreviewMode(false);
      })
      .catch(error => {
        console.error('加载示例文件失败:', error);
      });
  }, []);

  const handlePreview = () => {
    // 点击预览：非编辑，预览
    setIsEditMode(false);
    
    // 重新初始化 mermaid
    mermaid.initialize({
      ...mermaidConfig,
      startOnLoad: false
    });
    
    // 延迟设置预览模式，确保初始化完成
    setTimeout(() => {
      setIsPreviewMode(true);
    }, 0);
  };

  const handleEdit = () => {
    // 点击编辑：编辑，非预览
    setIsEditMode(true);
    setIsPreviewMode(false);
  };

  const handleOpenClick = () => {
    // 点击打开：非编辑，非预览（与初始状态相同）
    setIsEditMode(false);
    setIsPreviewMode(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setMarkdown(content);
          // 打开文件后：非编辑，非预览
          setIsEditMode(false);
          setIsPreviewMode(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const createAndDownloadFile = (blob: Blob, defaultName: string, accept: string) => {
    // 创建一个隐藏的 file input 元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.setAttribute('nwsaveas', defaultName); // 设置默认文件名
    fileInput.setAttribute('accept', accept); // 设置文件类型限制
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 监听 change 事件
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
        };
        reader.readAsArrayBuffer(file);
      }
      document.body.removeChild(fileInput);
    });

    // 触发文件选择对话框
    fileInput.click();
  };

  const handleSave = () => {
    // 点击保存：非编辑，预览
    setIsEditMode(false);
    setIsPreviewMode(true);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    createAndDownloadFile(blob, 'document.md', '.md');
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsPreviewMode(true);
    
    setTimeout(async () => {
      try {
        const opt = {
          margin: 1,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        const pdf = await html2pdf().set(opt).from(previewRef.current!).output('blob');
        createAndDownloadFile(pdf, 'document.pdf', '.pdf');
      } catch (error) {
        console.error('PDF导出失败:', error);
        alert('PDF导出失败，请重试');
      }
    }, 500);
  };

  const handleExportHTML = async () => {
    if (!previewRef.current) return;
    
    setIsPreviewMode(true);
    
    setTimeout(async () => {
      try {
        const previewElement = previewRef.current;
        if (!previewElement) {
          throw new Error('预览元素不存在');
        }
        const content = previewElement.innerHTML;
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>导出文档</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #f5f5f5; }
                pre { background-color: #f8f9fa; padding: 1em; border-radius: 4px; }
                img { max-width: 100%; }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        createAndDownloadFile(blob, 'document.html', '.html');
      } catch (error) {
        console.error('HTML导出失败:', error);
        alert('HTML导出失败，请重试');
      }
    }, 500);
  };

  const handleExportWord = async () => {
    if (!previewRef.current) return;
    
    setIsPreviewMode(true);
    
    setTimeout(async () => {
      try {
        const previewElement = previewRef.current;
        if (!previewElement) {
          throw new Error('预览元素不存在');
        }

        // 创建段落数组
        const docElements: (Paragraph | Table)[] = [];

        // 获取所有子元素
        const children = Array.from(previewElement.children);
        
        // 遍历并转换每个元素
        for (const child of children) {
          if (child instanceof HTMLElement) {
            // 处理标题
            if (child.tagName.match(/^H[1-6]$/)) {
              docElements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: child.textContent || '',
                      size: 32 - (parseInt(child.tagName[1]) * 2), // H1=32, H2=30, ...
                      bold: true
                    })
                  ]
                })
              );
            }
            // 处理段落
            else if (child.tagName === 'P') {
              docElements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: child.textContent || ''
                    })
                  ]
                })
              );
            }
            // 处理代码块
            else if (child.tagName === 'PRE') {
              docElements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: child.textContent || '',
                      font: 'Consolas'
                    })
                  ],
                  spacing: { before: 240, after: 240 },
                  indent: { left: 720 }
                })
              );
            }
            // 处理列表
            else if (child.tagName === 'UL' || child.tagName === 'OL') {
              const listItems = Array.from(child.getElementsByTagName('li'));
              for (const item of listItems) {
                docElements.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${item.textContent || ''}`
                      })
                    ],
                    indent: { left: 720 }
                  })
                );
              }
            }
            // 处理表格
            else if (child.tagName === 'TABLE') {
              const rows = Array.from(child.getElementsByTagName('tr'));
              const tableRows = rows.map(row => {
                const cells = Array.from(row.children);
                return new TableRow({
                  children: cells.map(cell => 
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: cell.textContent || '',
                              bold: cell.tagName === 'TH'
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 100 / cells.length,
                        type: WidthType.PERCENTAGE
                      },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 }
                      }
                    })
                  )
                });
              });

              docElements.push(
                new Table({
                  rows: tableRows,
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE
                  }
                })
              );
            }
            // 处理引用块
            else if (child.tagName === 'BLOCKQUOTE') {
              docElements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: child.textContent || '',
                      italics: true
                    })
                  ],
                  indent: { left: 720 },
                  spacing: { before: 240, after: 240 }
                })
              );
            }
            // 其他元素作为普通段落处理
            else {
              docElements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: child.textContent || ''
                    })
                  ]
                })
              );
            }
          }
        }

        // 创建新的 Word 文档
        const doc = new Document({
          sections: [{
            properties: {},
            children: docElements
          }]
        });

        // 生成 Word 文档
        const buffer = await Packer.toBlob(doc);
        
        // 使用文件选择对话框保存
        createAndDownloadFile(buffer, 'document.docx', '.docx');
        
      } catch (error) {
        console.error('Word导出失败:', error);
        alert('Word导出失败，请重试');
      }
    }, 500);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleEdit}
            style={{
              padding: '8px 16px',
              backgroundColor: isEditMode ? '#4CAF50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            编辑
          </button>
          <button 
            onClick={handlePreview}
            style={{
              padding: '8px 16px',
              backgroundColor: isPreviewMode ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            预览
          </button>
          <button 
            onClick={handleOpenClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            打开
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".md,.markdown"
            style={{ display: 'none' }}
          />
          <button 
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            保存
          </button>
          <button 
            onClick={handleExportPDF}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF4081',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            导出PDF
          </button>
          <button 
            onClick={handleExportHTML}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3F51B5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            导出HTML
          </button>
          <button 
            onClick={handleExportWord}
            style={{
              padding: '8px 16px',
              backgroundColor: '#673AB7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            导出Word
          </button>
        </div>
        <div style={{ 
          padding: '8px 16px',
          color: '#666',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {isEditMode ? '编辑模式' : '非编辑模式'} | {isPreviewMode ? '预览模式' : '非预览模式'}
        </div>
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
            disabled={!isEditMode}
          />
          <div style={{ width: '100%', height: '100%' }}>
            <RenderContext.Provider value={isPreviewMode}>
              <div
                ref={previewRef}
                style={{ 
                  height: '100%',
                  padding: '20px',
                  overflow: 'auto',
                  backgroundColor: '#ffffff'
                }}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </RenderContext.Provider>
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