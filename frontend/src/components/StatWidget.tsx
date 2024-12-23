import React from 'react';
import { Info, GripVertical, X } from 'lucide-react';
import { Widget, WidgetData } from '../types/widget';

interface StatWidgetProps {
  widget: Widget;
  data: WidgetData;
  onRemove: (id: string) => void;
  onDragStart?: (e: React.DragEvent, widget: Widget) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, widget: Widget) => void;
}

const StatWidget: React.FC<StatWidgetProps> = ({
  widget,
  data,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const formatValue = (val: string | number, type: 'currency' | 'percent' | 'number') => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(typeof val === 'string' ? parseFloat(val) : val);
    }
    if (type === 'percent') {
      return `${val}%`;
    }
    return val;
  };

  const getValueColor = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) : val;
    if (numValue > 0) return 'text-green-500';
    if (numValue < 0) return 'text-red-500';
    return 'text-gray-200';
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, widget)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, widget)}
      className="bg-[#1A1625] p-4 rounded-lg shadow-sm relative group border border-purple-900/20"
    >
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onRemove(widget.id)}
          className="p-1 hover:bg-purple-900/20 rounded-full"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>
      <div className="absolute top-2 left-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={16} className="text-gray-400" />
      </div>
      <div>
        <div className="flex items-center gap-1 mb-2">
          <h3 className="text-xl text-gray-100">{widget.title}</h3>
          {data.info && (
            <div className="relative group/info">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute left-3/4 -translate-x-1/2 -top-8 invisible group-hover/info:visible w-48">
                <div className="bg-[#0B0118] text-gray-200 text-lg rounded p-1.5 m-1 shadow-lg">
                  {data.info}
                </div>
              </div>
            </div>
          )}
        </div>
        <p className={`text-xl font-semibold ${getValueColor(data.value)}`}>
          {formatValue(data.value, data.type)}
        </p>
      </div>
    </div>
  );
};

export default StatWidget; 