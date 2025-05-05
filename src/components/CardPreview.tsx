import { marked } from "marked";
import useSettingsStore from "../stores/settingsStore";
import useEditorStore from "../stores/editorStore";

import "../styles/themes.css";
import { useEffect, useState } from "react";
import { cardComponents } from "../themeConfigs";
import PaginatedMarkdownViewer from "../utils/PaginatedMarkdownViewer";
import LongMarkdownViewer from "../utils/LongMarkdownViewer";




const CardPreview: React.FC = () => {
  const { content: markdown } = useEditorStore();
  const {
    selectedTheme,
    cardWidth: width,
    cardHeight: height,
    viewMode,
  } = useSettingsStore();
  
  const [html, setHtml] = useState('');
  const Card = cardComponents[selectedTheme].component;
  const renderer = cardComponents[selectedTheme].renderer;

  async function markdownToHtml(markdown: string) {
    return await  marked.parse(markdown, { renderer });
  }


  useEffect(() => {
    markdownToHtml(markdown).then(parsed => setHtml(parsed));
  }, [markdown, renderer]);

  return (
    <div
      className="bg-gray-100 rounded-lg shadow-sm p-8 overflow-auto  h-full"
    >

      {
        viewMode === "长卡片" ? (
          <LongMarkdownViewer 
            html={html}
            CardComponent={Card}
            pageWidth={width}
          />
        ) : (
          <PaginatedMarkdownViewer
            CardComponent={Card}
            pageWidth={width}
            pageHeight={height}
            html={html}  />
        )
      }
    </div>
  );
};

export default CardPreview;
