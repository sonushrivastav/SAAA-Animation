'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Compact-to-expanded Osmo-like Navbar
 * - Initially minimal width: hamburger + centered logo + contact button
 * - On hamburger open: navbar expands horizontally + shows mega menu
 * - Black background, sticky, subtle blur
 *
 * NOTE: Adjust container widths (w-*) as needed.
 */

export default function Navbar({
    logoSrc = '/images/socialMedia/Logo_Icon.svg',
    logoSrc2 = '/images/socialMedia/Main_Logo.svg',
    logoAlt = 'Logo',
    orgName = 'Brand',
    cta = { label: 'Let’s Connect', href: '/contact' },
    menu = [
        {
            title: 'Products',
            items: [
                { label: 'Home', href: '/' },
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
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className=" w-full fixed top-2 z-99 bg-transparent">
            <header className="  z-50 flex justify-center bg-transparent ">
                {/* wrapper that expands when open */}
                <motion.div
                    animate={{ width: open ? '90%' : '40%' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="overflow-hidden bg-black/80  rounded-lg"
                >
                    <div className="flex h-16 items-center justify-between px-4">
                        {/* Hamburger */}
                        <button
                            onClick={() => setOpen(s => !s)}
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

                        {/* Logo + reveal org name */}
                        {/* Logo swap */}
                        <Link
                            href="/"
                            className="relative flex items-center justify-center gap-2 w-32"
                            aria-label="Home"
                        >
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: open ? 0 : 1 }}
                                transition={{ duration: 0.25 }}
                                className="absolute"
                            >
                                <Image
                                    src={logoSrc}
                                    alt={logoAlt}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: open ? 1 : 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Image
                                    src={logoSrc2}
                                    alt={logoAlt}
                                    width={300}
                                    height={300}
                                    className="object-contain"
                                />
                            </motion.div>
                        </Link>

                        {/* CTA */}
                        <Link
                            href={cta.href}
                            className="text-sm font-medium text-[#fafafa] bg-[#844de9]  px-4 py-2 rounded-full  hover:bg-[#844de9]/80"
                        >
                            {cta.label}
                        </Link>
                    </div>

                    {/* Mega Menu dropdown */}
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.35, delay: 0.15 }}
                                className="border-t border-white/10 bg-black/95 md:px-8 px-4"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 py-6 text-white">
                                    {menu.map(section => (
                                        <div key={section.title}>
                                            <h4 className="text-sm font-semibold mb-3 text-white/70">
                                                {section.title}
                                            </h4>
                                            <ul className="space-y-2">
                                                {section.items.map(item => (
                                                    <li key={item.href}>
                                                        <Link
                                                            href={item.href}
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
