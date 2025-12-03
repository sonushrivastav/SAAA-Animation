'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Hook: track window width & auto update
function useWindowSize() {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    });

    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth });

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

export default function Navbar(props) {
    const {
        logoSrc = '/images/socialMedia/Logo_Icon.svg',
        logoSrc2 = '/images/socialMedia/Main_Logo.svg',
        logoAlt = 'Logo',
        cta = { label: 'Let’s Connect', href: '/contact' },
        menu = [
            {
                title: 'Products',
                items: [
                    { label: 'Home', href: '/animation' },
                    { label: 'Service', href: '/service' },
                    { label: 'Social Media', href: '/socialmedia' },
                ],
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Docs', href: '/docs' },
                    { label: 'Blog', href: '/blog' },
                ],
            },
        ],
    } = props;

    const [open, setOpen] = useState(false);
    const [showMega, setShowMega] = useState(false);

    const wrapperRef = useRef(null);
    const { width } = useWindowSize();

    // responsive checks based on updated width
    const isMobile = width < 768;
    const isTablet = width < 1024 && width >= 768;

    // WIDTH ANIMATION LOGIC (responsive)
    const computedWidth = isMobile
        ? open
            ? '100%'
            : '90%'
        : isTablet
        ? open
            ? '90%'
            : '70%'
        : open
        ? '90%'
        : '40%';

    // OPEN/CLOSE SEQUENCING
    const handleToggle = () => {
        if (!open) {
            setOpen(true);
            setTimeout(() => setShowMega(true), 250);
        } else {
            setShowMega(false);
            setTimeout(() => setOpen(false), 300);
        }
    };

    // click-outside close
    useEffect(() => {
        const handleClickOutside = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowMega(false);
                setTimeout(() => setOpen(false), 200);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full fixed top-2 z-99 bg-transparent">
            <header className="z-50 flex justify-center bg-transparent">
                <motion.div
                    ref={wrapperRef}
                    animate={{ width: computedWidth }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="overflow-hidden bg-black/80 rounded-lg w-full"
                >
                    <div className="flex h-16 items-center justify-between px-4">
                        {/* Hamburger */}
                        <button
                            onClick={handleToggle}
                            aria-label="Toggle menu"
                            className="flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-md"
                        >
                            <svg
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <motion.path
                                    initial={false}
                                    animate={open ? 'open' : 'closed'}
                                    variants={{
                                        closed: { d: 'M3 6h18M3 12h18M3 18h18' },
                                        open: { d: 'M6 6l12 12M6 18L18 6' },
                                    }}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* LOGO */}
                        <Link
                            href="/animation"
                            onClick={() => {
                                setShowMega(false);
                                setTimeout(() => setOpen(false), 200);
                            }}
                            className="relative flex items-center justify-center gap-2 w-32"
                        >
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: open ? 0 : 1 }}
                                transition={{ duration: 0.35 }}
                                className="absolute"
                            >
                                <Image src={logoSrc} alt={logoAlt} width={28} height={28} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: open ? 1 : 0 }}
                                transition={{ duration: 0.35 }}
                            >
                                <Image src={logoSrc2} alt={logoAlt} width={300} height={300} />
                            </motion.div>
                        </Link>

                        {/* CTA */}
                        <Link
                            href={cta.href}
                            className="text-sm font-medium text-[#fafafa] bg-[#844de9] px-4 py-2 rounded-full hover:bg-[#844de9]/80"
                        >
                            {cta.label}
                        </Link>
                    </div>

                    {/* MEGA MENU */}
                    <AnimatePresence>
                        {showMega && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.35 }}
                                className="border-t border-white/10 bg-black/95 md:px-8 px-4"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 text-[#fafafa]">
                                    {menu.map(section => (
                                        <div key={section.title}>
                                            <h4 className="text-lg font-semibold mb-3">
                                                {section.title}
                                            </h4>
                                            <ul className="space-y-2">
                                                {section.items.map(item => (
                                                    <li key={item.href}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => {
                                                                setShowMega(false);
                                                                setTimeout(
                                                                    () => setOpen(false),
                                                                    200
                                                                );
                                                            }}
                                                            className="text-white/80 hover:text-white text-sm"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </header>
        </div>
    );
}
