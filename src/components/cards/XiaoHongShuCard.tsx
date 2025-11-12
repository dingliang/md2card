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
  background: linear-gradient(135deg, #ff2442 0%, #ff5a7a 40%, #fff1f5 100%);
  box-sizing: border-box;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 40%),
      radial-gradient(circle at 80% 30%, rgba(255,255,255,0.35), transparent 40%),
      repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0 6px, transparent 6px 20px);
    pointer-events: none;
  }

  .card-content {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .paper {
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: #ffffff;
    border-radius: 18px;
    border: 2px solid #ff2442;
    box-shadow: 0 20px 40px rgba(255, 36, 66, 0.15);
  }

  &::after {
    content: "";
    position: absolute;
    left: -10%;
    bottom: -22%;
    width: 120%;
    height: 60%;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background-image:
      linear-gradient(180deg, rgba(255, 36, 66, 0.25), rgba(255, 36, 66, 0.6)),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.9) 0 2px, transparent 2px 14px);
    box-shadow: 0 -10px 18px rgba(255, 36, 66, 0.15);
    z-index: 0;
  }

  .md-h1, .md-h2, .md-h3, .md-h4, .md-h5, .md-h6 {
    color: #ff2442;
    margin: 0.5em 0 0.3em;
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.02em;
  }

  .md-h1 {
    font-size: 2.4em;
    line-height: 1.15;
  }

  .md-h2 { font-size: 1.6em; }
  .md-h3 { font-size: 1.3em; }

  .md-text {
    color: #333333;
    line-height: 1.7;
    margin: 0.8em 0;
    font-size: 1.02em;
  }

  .md-blockquote {
    background: #fff5f7;
    border-left: 6px solid #ff2442;
    border-radius: 12px;
    padding: 14px;
    margin: 1em 0;
    color: #4b4b4b;
  }

  .md-pre {
    background: #fff5f7;
    border-radius: 12px;
    padding: 14px;
  }

  .md-code { color: #d61c4e; }
  .md-codespan {
    background: #ffe1e8;
    color: #d61c4e;
    border-radius: 10px;
    padding: 0.15em 0.5em;
    border: 1px solid #ffcad6;
    font-weight: 600;
    display: inline-block;
  }

  .md-link { color: #ff2442; text-decoration: none; }
  .md-image { max-width: 100%; border-radius: 12px; box-shadow: 0 10px 26px rgba(0,0,0,0.1); }
  .md-hr { border: none; border-top: 2px solid #ffd6de; margin: 1.6em 0; }

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
    border-radius: 10px;
    border: 2px solid #ff2442;
    color: #ff2442;
    background: #fff1f5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }
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
    <CardContainer className={`prose prose-xhs`} style={{ width, height }}>
      <div className="card-content" ref={containerRef}>
        <div className="paper" dangerouslySetInnerHTML={{ __html: page }} />
      </div>
    </CardContainer>
  );
};

const ThemeConfig: CardConfig = {
  name: "运动健康",
  component: Card,
  renderer: render,
};

export default ThemeConfig;