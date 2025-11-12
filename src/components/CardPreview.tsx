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
  const currentConfig =
    cardComponents[selectedTheme] ??
    cardComponents['默认'] ??
    Object.values(cardComponents)[0];
  const Card = currentConfig.component;
  const renderer = currentConfig.renderer;

  async function markdownToHtml(markdown: string) {
    return await marked.parse(markdown, { renderer });
  }



  useEffect(() => {
    markdownToHtml(markdown).then(parsed => setHtml(parsed));
  }, [markdown, renderer, selectedTheme]);

  const { setSelectedTheme } = useSettingsStore();
  useEffect(() => {
    if (!cardComponents[selectedTheme] && currentConfig) {
      setSelectedTheme(currentConfig.name);
    }
  }, [selectedTheme, currentConfig, setSelectedTheme]);

  return (
    <div id="preview" className="no-radius bg-gray-100 shadow-sm p-8 overflow-auto h-full" >
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
            html={html} />
        )
      }
    </div>
  );
};

export default CardPreview;
