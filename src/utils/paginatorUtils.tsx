import { JSX } from 'react';
import { CardProps } from '../themeConfigs';

export const copyAttributes = (src: Element, dest: Element) => {
  Array.from(src.attributes).forEach(attr => dest.setAttribute(attr.name, attr.value));
};

export const createPage = (pageHeight: number, pageWidth: number) => {
  const page = document.createElement('div');
  page.className = 'page';
  page.style.height = `${pageHeight}px`;
  page.style.width = `${pageWidth}px`;
  return page;
};

export const addPageElement = (currentPage: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  pageElements.push(
    <CardComponent
      key={`page-${pageElements.length}`}
      height={pageHeight}
      width={pageWidth}
      page={currentPage.innerHTML}
    />
  );
};

export const isTextNodeLike = (node: Node) => {
  return node.nodeType === Node.TEXT_NODE ||
    (node.nodeType === Node.ELEMENT_NODE && ['P', 'SPAN', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes((node as Element).tagName));
};

export const isList = (node: Node) => {
  return node.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].includes((node as Element).tagName);
};

export const isTable = (node: Node) => {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'TABLE';
};

export const isImage = (node: Node) => {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'IMG';
};

export const findTextSplit = (el: HTMLElement, container: HTMLElement, pageHeight: number) => {
  const full = el.textContent || '';
  let lo = 0, hi = full.length;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    el.textContent = full.slice(0, mid);
    container.appendChild(el);
    const tooTall = container.scrollHeight > pageHeight;
    container.removeChild(el);
    if (tooTall) hi = mid - 1;
    else lo = mid + 1;
  }
  return hi;
};

export const createNewPage = (wrapper: HTMLElement, pageHeight: number, pageWidth: number) => {
  const page = createPage(pageHeight, pageWidth);
  wrapper.appendChild(page);
  return page;
};



export const handleTextNode = (node: Node, currentPage: HTMLElement, wrapper: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  const clone = node.cloneNode(true) as HTMLElement;
  const holder = document.createElement(node.nodeType === Node.TEXT_NODE ? 'span' : (node as Element).tagName);
  holder.textContent = clone.textContent;
  const splitAt = findTextSplit(holder, currentPage, pageHeight);
  const fullText = clone.textContent || '';

  const firstPart = holder.cloneNode(true) as HTMLElement;
  firstPart.textContent = fullText.slice(0, splitAt);
  currentPage.appendChild(firstPart);

  const rest = holder.cloneNode(true) as HTMLElement;
  rest.textContent = fullText.slice(splitAt);

  addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
  return {
    newPage: createNewPage(wrapper, pageHeight, pageWidth),
    nodeToAdd: rest
  };
};

export const handleListNode = (node: Node, currentPage: HTMLElement, wrapper: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  const clone = node.cloneNode(true) as HTMLElement;
  const items = Array.from(clone.children);
  const list1 = document.createElement(clone.tagName);
  const list2 = document.createElement(clone.tagName);
  copyAttributes(clone, list1);
  copyAttributes(clone, list2);

  let idx = 0;
  for (; idx < items.length; idx++) {
    list1.appendChild(items[idx].cloneNode(true));
    currentPage.appendChild(list1);
    if (currentPage.scrollHeight > pageHeight) {
      list1.removeChild(list1.lastChild as ChildNode);
      break;
    }
  }

  currentPage.removeChild(list1);
  currentPage.appendChild(list1);

  for (let j = idx; j < items.length; j++) {
    list2.appendChild(items[j].cloneNode(true));
  }

  addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
  return {
    newPage: createNewPage(wrapper, pageHeight, pageWidth),
    nodeToAdd: list2
  };
};

export const handleTableNode = (node: Node, currentPage: HTMLElement, wrapper: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  const clone = node.cloneNode(true) as HTMLElement;
  const rows = Array.from(clone.querySelectorAll('tbody tr'));
  const thead = clone.querySelector('thead')?.cloneNode(true) as HTMLElement;
  const table1 = document.createElement('table');
  const table2 = document.createElement('table');

  if (thead) {
    table1.appendChild(thead.cloneNode(true));
    table2.appendChild(thead.cloneNode(true));
  }

  const body1 = document.createElement('tbody');
  const body2 = document.createElement('tbody');
  table1.appendChild(body1);
  table2.appendChild(body2);

  copyAttributes(clone, table1);
  copyAttributes(clone, table2);

  let idx = 0;
  for (; idx < rows.length; idx++) {
    const row = rows[idx].cloneNode(true);
    body1.appendChild(row);
    currentPage.appendChild(table1);
    if (currentPage.scrollHeight > pageHeight) {
      body1.removeChild(body1.lastChild as ChildNode);
      break;
    }
  }

  currentPage.removeChild(table1);
  currentPage.appendChild(table1);

  for (let j = idx; j < rows.length; j++) {
    body2.appendChild(rows[j].cloneNode(true));
  }

  addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
  return {
    newPage: createNewPage(wrapper, pageHeight, pageWidth),
    nodeToAdd: table2
  };
};

export const handleImageNode = (node: Node, currentPage: HTMLElement, wrapper: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  const clone = node.cloneNode(true) as HTMLElement;
  addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
  return {
    newPage: createNewPage(wrapper, pageHeight, pageWidth),
    nodeToAdd: clone
  };
};

export const handleGenericNode = (node: Node, currentPage: HTMLElement, wrapper: HTMLElement, pageElements: JSX.Element[], CardComponent: React.FC<CardProps>, pageHeight: number, pageWidth: number) => {
  const clone = node.cloneNode(true) as HTMLElement;
  addPageElement(currentPage, pageElements, CardComponent, pageHeight, pageWidth);
  return {
    newPage: createNewPage(wrapper, pageHeight, pageWidth),
    nodeToAdd: clone
  };
};


