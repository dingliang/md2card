import MarkdownEditor from "./components/MarkdownEditor";
import CardPreview from "./components/CardPreview";
import SettingsPanel from "./components/SettingsPanel";
import Layout from "./components/Layout";
import Split from "react-split";
import "./App.css";

function App() {
  const handleExport = async () => {
    const preview = document.getElementById("preview");
    if (preview) {
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(preview);
      const link = document.createElement("a");
      link.download = "md2card.png";
      link.href = dataUrl;
      link.click();
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
