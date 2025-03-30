// @ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
  content: string;
  setContent: (content: string) => void;
}

const useEditorStore = create<EditorState>(
  persist(
    (set) => ({
      content: `# 标题
## 子标题
这是一段示例文本，你可以在这里编写 Markdown 内容。
### 列表示例
- 项目 1
- 项目 2
- 项目 3

### 代码示例
\`\`\`javascript
console.log('Hello World');
\`\`\`

> 这是一段引用文本

**粗体文本** *斜体文本*`,
      setContent: (content: string) => set({ content }),
    }),
    {
      name: "editor-storage",
    },
  ),
);

export default useEditorStore;
