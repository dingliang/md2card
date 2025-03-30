// 从相对路径导入ButtonGroup组件
import ButtonGroup from "./ButtonGroup";

interface HeaderProps {
  isDarkMode: boolean;
  showClock: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  onShowClockChange: (show: boolean) => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  showClock,
  onDarkModeChange,
  onShowClockChange,
  onExport,
}) => {
  return (
    <header className="h-[50px] flex flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <span className="text-2xl font-bold text-gray-800 tracking-tight">
        MD2Card
      </span>
      <ButtonGroup
        isDarkMode={isDarkMode}
        showClock={showClock}
        onDarkModeChange={onDarkModeChange}
        onShowClockChange={onShowClockChange}
        onExport={onExport}
      />
    </header>
  );
};

export default Header;
