import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for virtual scrolling
 * @param {Array} items - Array of items to virtualize
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} containerHeight - Height of the container in pixels
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} - Virtual scroll state and methods
 */
export const useVirtualScroll = (items, itemHeight, containerHeight, overscan = 5) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    index: startIndex + index,
    top: (startIndex + index) * itemHeight,
  }));

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const scrollToItem = (index) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = totalHeight;
    }
  };

  return {
    containerRef,
    totalHeight,
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
    scrollToItem,
    scrollToTop,
    scrollToBottom,
  };
};
