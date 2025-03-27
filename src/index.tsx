import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownRenderer from './components/MarkdownRenderer';
import './styles/styles.css';

const App = () => {
    const sampleMarkdown = `
# Hello World

This is a sample Markdown content.

- Item 1
- Item 2
- Item 3

**Bold Text** and *Italic Text*.
    `;

    return (
        <div>
            <h1>Markdown Renderer</h1>
            <MarkdownRenderer markdown={sampleMarkdown} />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));