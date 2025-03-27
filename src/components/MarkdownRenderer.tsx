import React from 'react';
import { parseMarkdown } from '../utils/markdownParser';

interface MarkdownRendererProps {
    markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
    const renderedHTML = parseMarkdown(markdown);

    return (
        <div className="markdown-renderer" dangerouslySetInnerHTML={{ __html: renderedHTML }} />
    );
};

export default MarkdownRenderer;