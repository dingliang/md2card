import React, { JSX, useState } from 'react';
import { marked } from 'marked';
import { CardProps } from '../themeConfigs';
import {
  isTextNodeLike,
  isList,
  isTable,
  isImage,
  createNewPage,
  addPageElement,
  handleTextNode,
  handleListNode,
  handleTableNode,
  handleImageNode,
  handleGenericNode
} from './paginatorUtils';




interface PaginatedMarkdownViewerProps {
  html: string;
  pageHeight?: number;
  pageWidth?: number;
  CardComponent: React.FC<CardProps>;
}

const PaginatedMarkdownViewer: React.FC<PaginatedMarkdownViewerProps> = ({
  html,
  pageHeight = 500,
  pageWidth = 300,
  CardComponent,
}) => {
  const [pages, setPages] = useState<JSX.Element[]>([]);

  const paginate = (sourceEl: HTMLElement) => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.visibility = 'hidden';
    wrapper.style.width = `${pageWidth}px`;
    document.body.appendChild(wrapper);

    let currentPage = createNewPage(wrapper, pageHeight, pageWidth);
    const nodes = Array.from(sourceEl.childNodes);
    let i = 0;
    const pageElements: JSX.Element[] = [];

    while (i < nodes.length) {
      const node = nodes[i];
      const clone = node.cloneNode(true) as HTMLElement;
      currentPage.appendChild(clone);

      if (currentPage.scrollHeight > pageHeight) {
        currentPage.removeChild(clone);

        if (isTextNodeLike(node)) {
          const { newPage, nodeToAdd } = handleTextNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth);
          currentPage = newPage;
          currentPage.appendChild(nodeToAdd);
          i++;
          continue;
        }

        if (isList(node)) {
          const { newPage, nodeToAdd } = handleListNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth);
          currentPage = newPage;
          currentPage.appendChild(nodeToAdd);
          i++;
          continue;
        }

        if (isTable(node)) {
          const { newPage, nodeToAdd } = handleTableNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth);
          currentPage = newPage;
          currentPage.appendChild(nodeToAdd);
          i++;
          continue;
        }




        if (isImage(node)) {
          const { newPage, nodeToAdd } = handleImageNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth);
          currentPage = newPage;
          currentPage.appendChild(nodeToAdd);
          i++;
          continue;
        }

        const { newPage, nodeToAdd } = handleGenericNode(node, currentPage, wrapper, pageElements, CardComponent, pageHeight, pageWidth);
        currentPage = newPage;
        currentPage.appendChild(nodeToAdd);
      }
      i++;
    }

    if (currentPage.childNodes.length > 0) {
      addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
    }

    document.body.removeChild(wrapper);
    return pageElements;
  };

  const renderMarkdown =  () => {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // 强制重排以确保正确计算高度
    setTimeout(() => {
      const pages = paginate(temp);
      setPages(pages);
    }, 0);
  };

  React.useEffect(() => {
    if (html) {
      renderMarkdown();
    }
  }, [html,CardComponent,pageHeight,pageWidth]);

  return (
    <div className="pages-wrapper">
      {pages}
    </div>
  );
};

export default PaginatedMarkdownViewer;