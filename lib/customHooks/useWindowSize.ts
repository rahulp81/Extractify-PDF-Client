"use client"
import { useEffect, useState } from 'react';

const useWindowResizeListener = () => {
  const [windowDimensions, setWindowDimensions] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => {
        setWindowDimensions(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowDimensions;
};

export default useWindowResizeListener;
