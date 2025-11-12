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
  return `<li class="md-listitem">${text}</li>`;
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
  padding: 20px;
  background-color: #7b5fd4;
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    height: 0;
    border-top: 6px dashed rgba(255,255,255,0.9);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ffd8ef;
    border: 4px solid #ffffff;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
  }

  .card-content {
    position: relative;
    height: 100%;
  }

  .paper {
    position: relative;
    background: #ffffff;
    border: 3px solid #2a0933;
    box-shadow: 12px 12px 0 0 #2a0933, 22px 22px 0 0 #c28ae9;
    padding: 14px;
    min-height: 100%;
  }

  .md-h1, .md-h2, .md-h3, .md-h4, .md-h5, .md-h6 {
    color: #7b5fd4;
    margin: 0.6em 0 0.35em;
    font-weight: 700;
    text-shadow: 0.5px 0.5px 0 #2a0933, -0.5px -0.5px 0 #e9d3ff;
    text-align: center;
  }

  .md-h1 { font-size: 1.8em; }
  .md-h2 { font-size: 1.5em; }
  .md-h3 { font-size: 1.2em; }

  .md-h2::after {
    content: "";
    display: block;
    width: 64px;
    height: 3px;
    background: #a182f5;
    border-radius: 2px;
    margin: 0.35em auto 0;
  }

  .md-text { color: #333; line-height: 1.6; margin: 0.6em 0; }
  .md-blockquote { background: #f4eefc; border-left: 6px solid #7b5fd4; border-radius: 8px; padding: 12px; margin: 0.8em 0; color: #555; }
  .md-listitem { margin: 0.5em 0; }
  .md-pre { background: #f7f7fb; padding: 1em; border-radius: 8px; }
  .md-code { font-family: 'JetBrains Mono', monospace; color: #7b5fd4; }
  .md-codespan { background: #f2eaff; padding: 0.15em 0.45em; border-radius: 12px; border: 1px solid #b8a6f3; color: #6f54cc; display: inline-block; font-weight: 600; }
  .md-strong { color: #6f54cc; font-weight: 800; }
  .md-em { color: #7b5fd4; }
  .md-table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  .md-thead { background: #f2eaff; }
  .md-td, .md-th { border: 1px solid rgba(42, 9, 51, 0.2); padding: 0.6em; }
  .md-link { color: #7b5fd4; text-decoration: none; }
  .md-image { max-width: 100%; height: auto; border-radius: 8px; margin: 0.3em 0; box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
  .md-hr { border: none; border-top: 2px dashed #c28ae9; margin: 2em 0; }

  .md-ol { list-style: none; padding-left: 0; counter-reset: item; }
  .md-ol > .md-listitem { position: relative; padding-left: 2.2em; margin: 0.6em 0; }
  .md-ol > .md-listitem::before {
    content: counter(item);
    counter-increment: item;
    position: absolute;
    left: 0;
    top: 0.05em;
    width: 1.7em;
    height: 1.7em;
    border-radius: 50%;
    border: 2px solid #7b5fd4;
    color: #7b5fd4;
    background: #f2eaff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
`;

const Card: React.FC = ({
  page,
  width: settingWidth,
  height: settingHeight,
  containerRef,
}: CardProps) => {
  const width = settingWidth;
  const height = settingHeight === -1 ? "auto" : settingHeight;

  return (
    <CardContainer
      className={`prose prose-notebook`}
      style={{ width, height }}
    >
      <div className="card-content" ref={containerRef}>
        <div className="paper" dangerouslySetInnerHTML={{ __html: page }} />
      </div>
    </CardContainer>
  );
};

const ThemeConfig: CardConfig = {
  name: "手账纸",
  component: Card,
  renderer: render,
};

export default ThemeConfig;