import styled from "styled-components";
import { Renderer, Tokens, parseInline } from "marked";
import { CardConfig, CardProps } from "../../themeConfigs";

const render = new Renderer();
render.heading = function ({ text, depth }: Tokens.Heading) {
  return `<h${depth} class="md-h${depth}">${parseInline(text, { renderer: render })}</h${depth}>`;
};
render.blockquote = function ({ text }: Tokens.Blockquote) {
  return `<blockquote class="md-blockquote">${parseInline(text, { renderer: render })}</blockquote>`;
};
render.list = function ({ items, ordered, start }: Tokens.List) {
  const listType = ordered ? "ol" : "ul";
  const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";
  return `<${listType} class="md-${listType}"${startAttr}>
  ${items
      .map((item) => {
        return `<li class="md-listitem">${parseInline(item.text, { renderer: render })}</li>`;
      })
      .join("")}
  </${listType}>`;
};
render.listitem = function ({ text }: Tokens.ListItem) {
  return `<li class="md-listitem">${parseInline(text, { renderer: render })}</li>`;
};
render.code = function ({ text, lang }: Tokens.Code) {
  return `<pre class="md-pre"><code class="md-code language-${lang}">${text}</code></pre>`;
};
render.codespan = function ({ text }: Tokens.Codespan) {
  const inner = text.replace(/`+/g, "");
  return `<code class="md-codespan">${inner}</code>`;
};
render.strong = function ({ text }: Tokens.Strong) {
  return `<strong class="md-strong">${text}</strong>`;
};
render.em = function ({ text }: Tokens.Em) {
  return `<em class="md-em">${text}</em>`;
};
render.table = function ({ header, rows }: Tokens.Table) {
  return `
    <table class="md-table">
      <thead class="md-thead">
        ${header.map((hd) => `<th class="md-th"> ${parseInline(hd.text, { renderer: render })} </th>`).join("")}
      </thead>
      <tbody class="md-tbody">
        ${rows.map((row) => `<tr class="md-tr">${row.map((cell) => `<td class="md-td">${parseInline(cell.text, { renderer: render })}</td>`).join("")} </tr>`).join("")}
      </tbody>
    </table>
  `;
};
render.tablerow = function ({ text }: Tokens.TableRow) {
  return `<tr class="md-tr">${text}</tr>`;
};
render.tablecell = function ({ text }: Tokens.TableCell) {
  return `<td class="md-td">${text}</td>`;
};
render.link = function ({ href, title, tokens }: Tokens.Link) {
  return `<a class="md-link" href="${href}"${title ? ` title="${title}"` : ""}>${tokens}</a>`;
};
render.image = function ({ href }: Tokens.Image) {
  return `<img class="md-image" src="${href}" />`;
};
render.space = function () {
  return "";
};
render.html = function (token: Tokens.HTML) {
  return token.text;
};
render.hr = function () {
  return '<hr class="md-hr" />';
};
render.checkbox = function (token: Tokens.Checkbox) {
  return `<input type="checkbox" ${token.checked ? "checked" : ""} disabled />`;
};
render.br = function () {
  return `<br class="md-br" />`;
};
render.del = function ({ text }: Tokens.Del) {
  return `<del class="md-del">${text}</del>`;
};
render.text = function ({ text }: Tokens.Text) {
  return `<span class="md-text">${text}</span>`;
};

const CardContainer = styled.div`
  position: relative;
  padding: 18px;
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ffd1a3 100%);
  box-sizing: border-box;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 70% 80%, rgba(255,255,255,0.4), transparent 40%),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 8px, transparent 8px 22px);
    pointer-events: none;
  }

  .paper {
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: #fffaf5;
    border-radius: 16px;
    border: 1px solid #ffd7b5;
    box-shadow: 0 20px 40px rgba(255, 166, 125, 0.18);
  }

  .md-h1, .md-h2, .md-h3, .md-h4, .md-h5, .md-h6 {
    background: linear-gradient(45deg, #ff7e5f, #feb47b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    margin: 0.6em 0 0.35em;
    text-align: center;
  }
  .md-h1 { font-size: 2.2em; }
  .md-h2 { font-size: 1.6em; }
  .md-h3 { font-size: 1.25em; }

  .md-text { color: #5a463b; line-height: 1.75; margin: 0.8em 0; }
  .md-blockquote { background: rgba(255, 174, 127, 0.12); border-left: 6px solid #ff9966; border-radius: 12px; padding: 14px; margin: 1em 0; color: #6a5548; }
  .md-pre { background: rgba(255, 174, 127, 0.08); border-radius: 12px; padding: 14px; }
  .md-code { color: #ff7e5f; }
  .md-codespan { background: rgba(255, 174, 127, 0.12); color: #ff7e5f; border: 1px solid rgba(255, 174, 127, 0.3); border-radius: 10px; padding: 0.15em 0.5em; font-weight: 600; }
  .md-link { color: #ff7e5f; text-decoration: none; }
  .md-image { max-width: 100%; border-radius: 12px; box-shadow: 0 10px 26px rgba(255, 174, 127, 0.2); }
  .md-hr { border: none; border-top: 2px dashed rgba(255, 174, 127, 0.4); margin: 1.6em 0; }
  ol > li { list-style: decimal; }
  ul > li { list-style: disc; }
`;

const Card: React.FC<CardProps> = ({
  page,
  width: settingWidth,
  height: settingHeight,
  containerRef,
}: CardProps) => {
  const width = settingWidth;
  const height = settingHeight === -1 ? "auto" : settingHeight;

  return (
    <CardContainer className={`prose prose-chenxi`} style={{ width, height }}>
      <div className="paper" ref={containerRef} dangerouslySetInnerHTML={{ __html: page }} />
    </CardContainer>
  );
};

const ThemeConfig: CardConfig = {
  name: "晨曦能量",
  component: Card,
  renderer: render,
};

export default ThemeConfig;