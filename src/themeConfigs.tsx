import { Renderer } from "marked";

export interface CardProps {
  pages: string[];
  width: number;
  height: number;
  tempContainerRef: React.RefObject<HTMLDivElement | null>;
}
export interface CardConfig {
  name: string;
  component: React.FunctionComponent<CardProps>;
  renderer: Renderer;
  className: string;
}

// 找出./cards/*Card.tsx文件
export const cardFiles = import.meta.glob("./components/cards/*Card.tsx", {
  eager: true,
});
console.log(cardFiles);

// 动态导入所有的卡片组件
export const cardComponents = Object.values(cardFiles).reduce(
  (configs: Record<string, CardConfig>, module) => {
    const config = (module as any).default as CardConfig;
    configs[config.name] = config;
    return configs;
  },
  {} as Record<string, CardConfig>,
);

export const configNames = Object.values(cardComponents).map(
  (config) => config.name,
);
