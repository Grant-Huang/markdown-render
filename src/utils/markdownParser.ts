import { marked } from 'marked';

export const parseMarkdown = (markdown: string): string => {
    return marked(markdown);
};