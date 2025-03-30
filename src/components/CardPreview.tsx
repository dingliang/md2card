import { marked, Renderer } from "marked";
import * as htmlToImage from "html-to-image";
import useSettingsStore from "../stores/settingsStore";
import useEditorStore from "../stores/editorStore";

import "../styles/themes.css";
import { useEffect, useRef, useState } from "react";
import { cardComponents } from "../themeConfigs";

const CardPreview: React.FC = () => {
  const { content: markdown } = useEditorStore();
  const {
    selectedTheme,
    cardWidth: width,
    cardHeight: height,
    viewMode,
  } = useSettingsStore();
  const [pages, setPages] = useState<string[]>([]);
  // const contentRef = useRef<HTMLDivElement>(null)
  const tempContainerRef = useRef<HTMLDivElement>(null);

  const Card = cardComponents[selectedTheme].component;
  const renderer = cardComponents[selectedTheme].renderer;

  const html = marked(markdown, { renderer });

  useEffect(() => {
    if (!tempContainerRef.current) return;

    // 创建临时容器来测量内容
    const tempContainer = tempContainerRef.current;
    tempContainer.style.overflow = "auto";
    const cardContainer =
      tempContainer.getElementsByClassName("card-content")[0];

    if (!cardContainer) {
      setPages([html]);
      return;
    }

    cardContainer.innerHTML = html;

    if (viewMode == "长卡片") {
      setPages([html]);
      return;
    }

 

    if (tempContainer.scrollHeight == tempContainer.clientHeight) {
      setPages([html]);
      return;
    }


    // 分页逻辑
    const splitContent = () => {
      const elements = Array.from(cardContainer.children);

      const pages: string[] = [];

      cardContainer.innerHTML = "";
      

      elements.forEach((element) => {
        const clone = element.cloneNode(true);
        cardContainer.appendChild(clone);

        if (tempContainer.scrollHeight > tempContainer.clientHeight) {
          // 移除最后添加的元素
          cardContainer.removeChild(cardContainer.lastChild as Node);
          // 保存当前页面
          pages.push(cardContainer.innerHTML);
          // 创建新页面，并添加溢出的元素
          cardContainer.innerHTML = "";
          cardContainer.appendChild(clone);
        }
      });

      // 添加最后一页
      if (cardContainer.innerHTML) {
        pages.push(cardContainer.innerHTML);
      }

      return pages;
    };

    const splitPages = splitContent();

    setPages(splitPages);
  }, [html, height, width, viewMode]); // 添加width作为依赖

  return (
    <div
      // id="preview"
      className="bg-gray-100 rounded-lg shadow-sm p-8 overflow-auto  h-full"
    >
      <Card
        pages={pages}
        width={width}
        height={viewMode == "短卡片" ? height : -1}
        tempContainerRef={tempContainerRef}
      />
    </div>
  );
};

export default CardPreview;
