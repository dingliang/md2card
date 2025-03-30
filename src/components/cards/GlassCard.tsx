// @ts-nocheck
import styled from "styled-components";
import { Renderer, Tokens } from "marked";
import { CardProps } from "../../themeConfigs";

const render = new Renderer();
render.heading = function ({ text, depth }: Tokens.Heading) {
  return `<h${depth}>${text}</h${depth}>`;
};
render.blockquote = function ({ tokens }: Tokens.Blockquote) {
  return `<blockquote class="md-blockquote">${tokens}</blockquote>`;
};
render.list = function ({ items, ordered, start }: Tokens.List) {
  const listType = ordered ? "ol" : "ul";
  const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";
  return `<${listType} class="md-${listType}"${startAttr}>
  ${items
    .map((item) => {
      return `<li class="md-listitem">${item.text}</li>`;
    })
    .join("")}
  </${listType}>`;
};
render.listitem = function ({ text }: Tokens.ListItem) {
  return `<li class="md-listitem">${text}</li>`;
};
render.code = function ({ text, lang, escaped }: Tokens.Code) {
  return `<pre class="md-pre"><code class="md-code language-${lang}">${text}</code></pre>`;
};
render.codespan = function ({ text }: Tokens.Codespan) {
  return `<code class="md-codespan">${text}</code>`;
};
render.strong = function ({ raw, text }: Tokens.Strong) {
  return `<strong class="md-strong">${text}</strong>`;
};
render.em = function ({ text }: Tokens.Em) {
  return `<em class="md-em">${text}</em>`;
};
render.table = function ({ header, align, rows }: Tokens.Table) {
  return `
    <table class="md-table">
      <thead class="md-thead">
        ${header}
      </thead>
      <tbody class="md-tbody">
        ${rows}
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
render.image = function ({ href, title, text }: Tokens.Image) {
  return `<img class="md-image" src="${href}" alt="${text}"${title ? ` title="${title}"` : ""} />`;
};
render.space = function (token: Tokens.Space) {
  return ""; //'<br />';
};
render.html = function (token: Tokens.HTML) {
  return token.text;
};
render.hr = function (token: Tokens.Hr) {
  return '<hr class="md-hr" />';
};
render.checkbox = function (token: Tokens.Checkbox) {
  return `<input type="checkbox" ${token.checked ? "checked" : ""} disabled />`;
};
render.paragraph = function (token: Tokens.Paragraph) {
  return `<p class="md-text">${token.text}</p>`;
};
render.br = function (token: Tokens.Br) {
  return "<br />";
};
render.del = function (token: Tokens.Del) {
  return `<del class="md-del">${token.text}</del>`;
};
render.text = function (token: Tokens.Text) {
  return token.text;
};

render.code = function (token: Tokens.Code) {
  return `<code class="md-code">${token.text}</code>`;
};

const CardContianer = styled.div`
  position: relative;
  // border-radius: 10px;
  padding: 20px;
  overflow: hidden;
  background-color: #000;

  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  // background-image: radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px);
  // background-size: 20px 20px;

  // overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    background: red;
    // z-index: 0;
    //  filter: blur(10px);
  }

  &::after {
    content: "";
    position: absolute;
    top: calc(100% - 100px);
    left: calc(100% - 100px);
    width: 100px;
    height: 100px;
    border-radius: 100%;
    background: red;
    // z-index: -1;
    filter: blur(10px);
  }

  .card-content {
    border-radius: 10px;
    backdrop-filter: blur(10px);
    padding: 20px;
    // border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: -1px -1px 5px 1px rgba(255, 255, 255, 0.5);
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.1);
    height: 100%;
  }

  .md-blockquote {
    border-left: 4px solid #ff4081;
    padding-left: 1em;
    margin: 1em 0;
    color: #666;
  }

  .md-listitem {
    margin: 0.5em 0;
  }

  .md-pre {
    background: rgba(0, 0, 0, 0.05);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }

  .md-code {
    font-family: monospace;
    background: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  .md-codespan {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  .md-strong {
    color: #ff4081;
  }

  .md-em {
    color: #2196f3;
  }

  .md-table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  .md-thead {
    background: rgba(0, 0, 0, 0.05);
  }

  .md-td,
  .md-th {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.5em;
  }

  .md-link {
    color: #2196f3;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .md-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .md-hr {
    border: none;
    border-top: 2px dashed #ff4081;
    margin: 2em 0;
  }

  .md-text {
    line-height: 1.6;
    margin: 1em 0;
  }

  .md-del {
    text-decoration: line-through;
    color: #666;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #ff4081;
    margin: 1em 0 0.5em;
  }

  ol > li {
    list-style: decimal;
  }
  ul > li {
    list-style: disc;
  }
`;

const Card: React.FC = ({
  pages,
  width: settingWidth,
  height: settingHeight,
  tempContainerRef,
}: CardProps) => {
  const width = settingWidth - 80;
  const height = settingHeight == -1 ? "auto" :settingHeight - 80;

  return (
    <div className="flex flex-col gap-4  items-center" id="preview">
      {pages.map((pageHtml, index) => (
        <CardContianer
          key={index}
          className={`prose prose-indigo prose-default`}
          style={{ width, height }}
        >
          <div
            className="card-content"
            dangerouslySetInnerHTML={{ __html: pageHtml }}
          />
        </CardContianer>
      ))}

      <CardContianer
        style={{
          position: "absolute",
          top: "0",
          visibility: "hidden",
          width,
          height,
        }}
        className={`prose prose-indigo prose-default`}
        ref={tempContainerRef}
      >
        <div className="card-content" />
      </CardContianer>
    </div>
  );
};

const ThemeConfig = {
  name: "毛玻璃",
  component: Card,
  renderer: render,
};

export default ThemeConfig;
