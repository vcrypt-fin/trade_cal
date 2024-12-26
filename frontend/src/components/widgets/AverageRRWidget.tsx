import React from 'react';
import { useTrades } from '../../context/TradeContext';
import StatWidget from './StatWidget';
import { calculateAverageActualRR } from '../Reports/sections/RiskSection';
import { Widget } from '../../types/widget';

interface AverageRRWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onDragStart?: (e: React.DragEvent, widget: Widget) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, widget: Widget) => void;
}

const AverageRRWidget: React.FC<AverageRRWidgetProps> = ({
  widget,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const { trades } = useTrades();
  
  const avgRR = calculateAverageActualRR(trades);
  
  return (
    <StatWidget
      widget={widget}
      data={{
        value: `1:${avgRR.toFixed(2)}`,
        type: 'number',
        info: 'Average actual risk-to-reward ratio across all trades with RR data'
      }}
      onRemove={onRemove}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
};

export default AverageRRWidget; 