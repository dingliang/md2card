import MarkdownEditor from "./components/MarkdownEditor";
import CardPreview from "./components/CardPreview";
import SettingsPanel from "./components/SettingsPanel";
import Layout from "./components/Layout";
import Split from "react-split";
import "./App.css";

function App() {
  const handleExport = async () => {
    const preview = document.getElementById("preview");
    if (!preview) {
      alert("未找到预览区域");
      return;
    }
    const card = preview.querySelector('.prose') as HTMLElement | null;
    const cardContent = preview.querySelector('.card-content') as HTMLElement | null;
    const target = card ?? cardContent;
    if (!target) {
      alert("未找到卡片");
      return;
    }
    try {
      const htmlToImage = await import("html-to-image");
      const canvas = await htmlToImage.toCanvas(target, { pixelRatio: 2 });
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas context");
      const cw = canvas.width;
      const ch = canvas.height;
      const data = ctx.getImageData(0, 0, cw, ch).data;
      const rowEmpty = (y: number) => {
        for (let x = 0; x < cw; x++) {
          if (data[(y * cw + x) * 4 + 3] !== 0) return false;
        }
        return true;
      };
      const colEmpty = (x: number) => {
        for (let y = 0; y < ch; y++) {
          if (data[(y * cw + x) * 4 + 3] !== 0) return false;
        }
        return true;
      };
      let top = 0;
      while (top < ch && rowEmpty(top)) top++;
      let bottom = ch - 1;
      while (bottom >= 0 && rowEmpty(bottom)) bottom--;
      let left = 0;
      while (left < cw && colEmpty(left)) left++;
      let right = cw - 1;
      while (right >= 0 && colEmpty(right)) right--;
      const outW = Math.max(0, right - left + 1);
      const outH = Math.max(0, bottom - top + 1);
      const out = document.createElement("canvas");
      out.width = outW;
      out.height = outH;
      const octx = out.getContext("2d");
      if (!octx) throw new Error("canvas context");
      octx.drawImage(canvas, -left, -top);
      const dataUrl = out.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "md2card.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert("导出失败，请检查是否包含跨域图片或稍后重试");
      console.error(e);
    }
  };

  return (
    <Layout onExport={handleExport}>
      <Split
        className="split flex-1"
        style={{ width: "calc(100% - 300px)" }}
        gutterAlign="start"
        gutterSize={10}
      >
        <div>
          <MarkdownEditor />
        </div>
        <div>
          <CardPreview />
        </div>
      </Split>
      <SettingsPanel />
    </Layout>
  );
}

export default App;
