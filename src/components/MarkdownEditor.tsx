// @ts-nocheck
import Editor from "@monaco-editor/react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink2,
  FiImage,
  FiCode,
  FiList,
  FiAlignLeft,
} from "react-icons/fi";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import useEditorStore from "../stores/editorStore";

const MarkdownEditor: React.FC = () => {
  const { content, setContent } = useEditorStore();

  const handleFormat = (format: string) => {
    const editor = window.monaco?.editor?.getModels()[0];
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection) return;

    const selectedText = editor.getModel()?.getValueInRange(selection) || "";
    let newText = "";

    switch (format) {
      case "h1":
        newText = `# ${selectedText}`;
        break;
      case "h2":
        newText = `## ${selectedText}`;
        break;
      case "h3":
        newText = `### ${selectedText}`;
        break;
      case "bold":
        newText = `**${selectedText}**`;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        break;
      case "underline":
        newText = `<u>${selectedText}</u>`;
        break;
      case "link":
        newText = `[${selectedText}](url)`;
        break;
      case "image":
        newText = `![${selectedText}](url)`;
        break;
      case "code":
        newText = selectedText.includes("\n")
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : `\`${selectedText}\``;
        break;
      case "list":
        newText = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n");
        break;
      default:
        newText = selectedText;
    }

    editor.executeEdits("", [
      {
        range: selection,
        text: newText,
      },
    ]);
  };

  return (
    <div className="bg-white h-full  shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-1 p-2 border-b border-gray-200">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => handleFormat("h1")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <TbH1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("h2")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <TbH2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("h3")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <TbH3 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            onClick={() => handleFormat("bold")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("italic")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("underline")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiUnderline className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            onClick={() => handleFormat("link")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiLink2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("image")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiImage className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("code")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiCode className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => handleFormat("list")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("align")}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <FiAlignLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Editor
        value={content}
        onChange={(value) => setContent(value || "")}
        language="markdown"
        theme="light"
        className="flex-1"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "off",
          wordWrap: "on",
          contextmenu: false,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
          },
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
