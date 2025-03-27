import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Split from 'react-split';
import { marked } from 'marked';
import './index.css'; // 添加样式支持

const App = () => {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!');

  return (
    <Split
      sizes={[50, 50]}
      minSize={200}
      style={{ display: 'flex', height: '100vh' }}
    >
      <textarea
        style={{ width: '100%', height: '100%', padding: '10px', fontSize: '16px' }}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <div
        style={{ width: '100%', height: '100%', padding: '10px', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: marked(markdown) }}
      />
    </Split>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));