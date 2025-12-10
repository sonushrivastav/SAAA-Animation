'use client';
import { useEffect, useState } from 'react';

export default function useDeviceType() {
    const getType = () => {
        if (typeof window === 'undefined')
            return { isMobile: false, isTablet: false, isDesktop: true };

        const width = window.innerWidth;

        return {
            isMobile: width < 768,
            isTablet: width >= 768 && width < 1024,
            isDesktop: width >= 1024,
        };
    };

    const [device, setDevice] = useState(getType);

    useEffect(() => {
        const handleResize = () => {
            setDevice(getType());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return device;
}
