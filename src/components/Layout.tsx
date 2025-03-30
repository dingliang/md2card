import { ReactNode } from "react";
import Header from "./Header";
import useThemeStore from "../stores/themeStore";

interface LayoutProps {
  children: ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  const { isDarkMode, showClock, setDarkMode, setShowClock } = useThemeStore();

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header
        isDarkMode={isDarkMode}
        showClock={showClock}
        onDarkModeChange={setDarkMode}
        onShowClockChange={setShowClock}
        onExport={onExport}
      />
      <div
        className="flex-1 flex gap-4  bg-gray-100 "
        style={{
          height: "calc(100% - 50px)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
