"use client";
import { useCallback, useEffect, useState } from "react";

// ✅ Debounce utility to prevent excessive resize calls
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export default function useDeviceType() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });
  const getType = useCallback(() => {
    if (typeof window === "undefined")
      return { isMobile: false, isTablet: false, isDesktop: true };

        const width = window.innerWidth;

    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  }, []);

  useEffect(() => {
    setDevice(getType());

    const handleResize = debounce(() => {
      setDevice(getType());
    }, 150);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getType]);

    useEffect(() => {
        const handleResize = () => {
            setDevice(getType());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return device;
}
