import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#121215',
        primaryColor: '#18181b',
        primaryTextColor: '#f4f4f5',
        primaryBorderColor: '#3f3f46',
        lineColor: '#71717a',
        secondaryColor: '#27272a',
        tertiaryColor: '#18181b',
      },
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to render diagram');
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-sm">
        <p className="font-semibold mb-2">Diagram Rendering Note:</p>
        <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto p-4 rounded-xl bg-[#121215] border border-zinc-800 flex justify-center items-center min-h-[320px]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
