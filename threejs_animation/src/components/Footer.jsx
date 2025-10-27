import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-white      text-black py-10 px-6 md:px-20 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Logo */}
                <div className="flex items-center space-x-3">
                    {/* Logo Icon (replace with your image if you have one) */}
                    <Image
                        src={'/images/Screenshot 2025-10-25 101941-Photoroom.png'}
                        width={200}
                        height={200}
                        alt="logo"
                    />
                </div>

                {/* Right: Footer Links */}
                <div className="text-gray-700 text-center md:text-right text-sm md:text-base">
                    Footer / Sitemap / quick links
                </div>
            </div>
        </footer>
    );
}
