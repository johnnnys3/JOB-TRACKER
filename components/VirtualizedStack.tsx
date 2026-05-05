'use client';

import { ReactNode, useMemo, useState } from 'react';

interface VirtualizedStackProps<T> {
  items: T[];
  estimateSize: number;
  height: number;
  gap?: number;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
}

export function VirtualizedStack<T>({
  items,
  estimateSize,
  height,
  gap = 16,
  renderItem,
  getKey,
}: VirtualizedStackProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const rowSize = estimateSize + gap;
  const totalHeight = Math.max(items.length * rowSize - gap, 0);
  const startIndex = Math.max(Math.floor(scrollTop / rowSize) - 2, 0);
  const visibleCount = Math.ceil(height / rowSize) + 4;
  const visibleItems = useMemo(
    () => items.slice(startIndex, startIndex + visibleCount),
    [items, startIndex, visibleCount],
  );

  if (items.length <= visibleCount) {
    return <div className="space-y-4">{items.map(renderItem)}</div>;
  }

  return (
    <div
      className="overflow-auto pr-2"
      style={{ height }}
      onScroll={event => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className="relative" style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;
          return (
            <div
              key={getKey(item, itemIndex)}
              className="absolute left-0 right-0"
              style={{
                top: itemIndex * rowSize,
                minHeight: estimateSize,
              }}
            >
              {renderItem(item, itemIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
