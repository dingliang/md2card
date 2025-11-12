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
  background: radial-gradient(1200px 600px at 20% 20%, rgba(174, 27, 37, 0.25), transparent 50%),
    linear-gradient(135deg, #0b0b0d 0%, #130a0f 100%);
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(135deg, rgba(174,27,37,0.15) 0 8px, transparent 8px 20px);
    mix-blend-mode: screen;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg, rgba(255, 0, 85, 0.08) 0 2px, transparent 2px 4px),
      repeating-linear-gradient(90deg, rgba(0, 255, 255, 0.06) 0 3px, transparent 3px 6px);
    mix-blend-mode: lighten;
    pointer-events: none;
  }

  .paper {
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: #0b0b0d;
    border-radius: 14px;
    border: 1px solid #2a0f13;
    box-shadow: 0 0 0 1px rgba(174, 27, 37, 0.35) inset, 0 20px 40px rgba(174, 27, 37, 0.18);
    position: relative;
  }
  .paper::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      repeating-linear-gradient(180deg, rgba(233,30,60,0.12) 0 6px, transparent 6px 14px),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 8px, transparent 8px 18px);
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .md-h1, .md-h2, .md-h3, .md-h4, .md-h5, .md-h6 {
    color: #e91e3c;
    margin: 0.5em 0 0.3em;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-shadow:
      0 0 12px rgba(233,30,60,0.35),
      2px 0 0 rgba(0,255,255,0.5),
      -2px 0 0 rgba(255,0,255,0.5);
    position: relative;
  }
  .md-h1 { font-size: 2.2em; }
  .md-h2 { font-size: 1.5em; }
  .md-h3 { font-size: 1.25em; }
  .md-h1::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    width: 65%;
    height: 0.9em;
    background: radial-gradient(circle at 50% 50%, rgba(233,30,60,0.35), transparent 65%);
    filter: blur(10px);
    z-index: -1;
  }
  .paper::after {
    content: "";
    position: absolute;
    top: 12%;
    right: 8%;
    width: 260px;
    height: 160px;
    background-image:
      linear-gradient(135deg, rgba(233,30,60,0.7) 0, rgba(233,30,60,0.7) 6px, transparent 6px),
      linear-gradient(135deg, rgba(233,30,60,0.6) 0, rgba(233,30,60,0.6) 6px, transparent 6px),
      linear-gradient(135deg, rgba(233,30,60,0.5) 0, rgba(233,30,60,0.5) 6px, transparent 6px);
    background-repeat: no-repeat;
    background-size: 240px 6px, 240px 6px, 240px 6px;
    background-position: 0 0, 16px 36px, 32px 72px;
    filter: drop-shadow(0 2px 0 rgba(0,0,0,0.7));
    pointer-events: none;
  }

  .md-text { color: #c9c9c9; line-height: 1.7; margin: 0.8em 0; }
  .md-blockquote { background: rgba(233,30,60,0.08); border-left: 6px solid #e91e3c; border-radius: 10px; padding: 12px; margin: 1em 0; color: #d7d7d7; }
  .md-pre { background: #0f0f11; border-radius: 10px; padding: 14px; }
  .md-code { color: #ff4d4d; }
  .md-codespan { background: rgba(233,30,60,0.12); color: #ff6b6b; border: 1px solid rgba(233,30,60,0.3); border-radius: 10px; padding: 0.15em 0.5em; font-weight: 600; }
  .md-link { color: #ff6b6b; text-decoration: none; }
  .md-image { max-width: 100%; border-radius: 10px; box-shadow: 0 10px 26px rgba(233,30,60,0.2); }
  .md-hr { border: none; border-top: 2px dashed rgba(233,30,60,0.4); margin: 1.6em 0; }
  ol > li { list-style: square; }
  ul > li { list-style: square; }
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
    <CardContainer className={`prose prose-yaodao`} style={{ width, height }}>
      <div className="paper" ref={containerRef} dangerouslySetInnerHTML={{ __html: page }} />
    </CardContainer>
  );
};

const ThemeConfig: CardConfig = {
  name: "妖刀专属",
  component: Card,
  renderer: render,
};

export default ThemeConfig;