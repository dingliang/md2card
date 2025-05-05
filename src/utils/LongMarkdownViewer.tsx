import React, { JSX } from 'react';
import { CardProps } from '../themeConfigs';

interface LongMarkdownViewerProps {
  html: string;
  CardComponent: React.FC<CardProps>;
  pageWidth?: number;
}

const LongMarkdownViewer: React.FC<LongMarkdownViewerProps> = ({
  html,
  CardComponent,
  pageWidth,
}) => {
  return (
    <CardComponent 
      page={html} 
      width={pageWidth ?? -1} 
      height={-1}
    />
  );
};

export default LongMarkdownViewer;