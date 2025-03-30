import { FiSun, FiMoon, FiClock } from "react-icons/fi";

interface ButtonGroupProps {
  isDarkMode: boolean;
  showClock: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  onShowClockChange: (show: boolean) => void;
  onExport: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  isDarkMode,
  showClock,
  onDarkModeChange,
  onShowClockChange,
  onExport,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onDarkModeChange(!isDarkMode)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {isDarkMode ? (
          <FiSun className="w-5 h-5" />
        ) : (
          <FiMoon className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={() => onShowClockChange(!showClock)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <FiClock className="w-5 h-5" />
      </button>
      <button
        onClick={onExport}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
      >
        导出为PNG
      </button>
    </div>
  );
};

export default ButtonGroup;
