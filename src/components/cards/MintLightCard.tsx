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
  background: linear-gradient(135deg, #e6fff2 0%, #c2f7e5 50%, #b0f0e0 100%);
  box-sizing: border-box;
  overflow: hidden;

  .paper {
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #d9f7ee;
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1);
  }

  .md-h1, .md-h2, .md-h3, .md-h4, .md-h5, .md-h6 {
    color: #0f766e;
    margin: 0.6em 0 0.35em;
    font-weight: 800;
    text-align: center;
  }
  .md-h1 { font-size: 2.2em; }
  .md-h2 { font-size: 1.6em; }
  .md-h3 { font-size: 1.25em; }

  .md-text { color: #2e5f56; line-height: 1.75; margin: 0.8em 0; }
  .md-blockquote { background: rgba(16,185,129,0.08); border-left: 6px solid #14b8a6; border-radius: 12px; padding: 14px; margin: 1em 0; color: #356d62; }
  .md-pre { background: rgba(16,185,129,0.08); border-radius: 12px; padding: 14px; }
  .md-code { color: #0ea5a5; }
  .md-codespan { background: rgba(16,185,129,0.12); color: #0ea5a5; border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 0.15em 0.5em; font-weight: 600; }
  .md-link { color: #0f766e; text-decoration: none; }
  .md-image { max-width: 100%; border-radius: 12px; box-shadow: 0 10px 26px rgba(16,185,129,0.1); }
  .md-hr { border: none; border-top: 2px dashed rgba(16,185,129,0.25); margin: 1.6em 0; }
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
    <CardContainer className={`prose prose-mint`} style={{ width, height }}>
      <div className="paper" ref={containerRef} dangerouslySetInnerHTML={{ __html: page }} />
    </CardContainer>
  );
};

const ThemeConfig: CardConfig = {
  name: "薄荷轻盈",
  component: Card,
  renderer: render,
};

export default ThemeConfig;