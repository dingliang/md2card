import React from "react";
import useSettingsStore from "../stores/settingsStore";
import { configNames } from "../themeConfigs";

const SettingsPanel: React.FC = () => {
  const {
    cardWidth,
    cardHeight,
    viewMode,
    hideOverflow,
    selectedTheme,
    setCardWidth,
    setCardHeight,
    setViewMode,
    setHideOverflow,
    setSelectedTheme,
  } = useSettingsStore();
  console.log(viewMode);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 m-4 w-[300px]">
      <div className="flex flex-col gap-6">
        {/* 分页按钮组 */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          {["长卡片", "短卡片"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${viewMode === tab ? "bg-white text-indigo-600" : "text-gray-500"}`}
              onClick={() => setViewMode(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 提示信息 */}
        {/* <div className="flex items-center gap-2 text-gray-500">
          <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300">i</span>
          <span className="text-sm">单张卡片不折分</span>
        </div> */}

        {/* 尺寸设置 */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">尺寸</h4>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-2">宽度</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${cardWidth}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setCardWidth(value);
                    }
                  }}
                  className="w-12 text-sm text-gray-700 bg-gray-50 border rounded px-1 py-0.5"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-2">高度</label>
              <div className="flex items-center gap-2">
                <input
                  disabled={viewMode == "长卡片"}
                  type="text"
                  value={`${cardHeight}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setCardHeight(value);
                    }
                  }}
                  className="w-12 text-sm text-gray-700 bg-gray-50 border rounded px-1 py-0.5"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* 高度超出隐藏开关 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">高度超出隐藏</span>
          <button
            className={`w-12 h-6 rounded-full transition-colors ${hideOverflow ? "bg-indigo-600" : "bg-gray-200"}`}
            onClick={() => setHideOverflow(!hideOverflow)}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transform transition-transform ${hideOverflow ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        {/* 选择设计尺寸 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            选择设计尺寸
          </label>
          <select className="w-full text-sm border rounded-lg p-2 text-gray-700 bg-white">
            <option>16:9</option>
            <option>4:3</option>
            <option>1:1</option>
          </select>
        </div>

        {/* 主题选择 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">选择主题</label>
          <select
            className="w-full text-sm border rounded-lg p-2 text-gray-700 bg-white"
            value={selectedTheme}
            onChange={(e) =>
              // @ts-ignore
              setSelectedTheme(e.target.value as keyof typeof markedThemes)
            }
          >
            {configNames.map((themeName) => (
              <option key={themeName} value={themeName}>
                {themeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
