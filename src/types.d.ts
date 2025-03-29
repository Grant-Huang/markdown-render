declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement | null): Html2PdfInstance;
    save(): Promise<void>;
    output(type: 'blob' | 'datauristring' | 'dataurlstring'): Promise<Blob>;
  }

  export default function html2pdf(): Html2PdfInstance;
}

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
  }

  function html2canvas(
    element: HTMLElement | null,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;

  export default html2canvas;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
} 