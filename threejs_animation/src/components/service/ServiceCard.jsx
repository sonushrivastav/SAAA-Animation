// ServiceCard.jsx
import ThreeGlass from './ThreeGlass';

export default function ServiceCard() {
    return (
        <div className="relative w-[80%]  mx-auto my-25 p-10 border border-gray-500/40 rounded-2xl bg-[#55555533] backdrop-blur-xl flex justify-between">
            {/* LEFT TEXT SECTION */}
            <div className="w-[65%]">
                <button className="bg-purple-500 text-white px-4 py-2 rounded-md font-bold ">
                    BUILD
                </button>
                <p className="text-gray-300 mt-4 max-w-md">
                    Our developers are part artists, part architects. They code, craft, and
                    fine-tune every pixel until your site feels alive.
                </p>

                <ul className="mt-6 text-white font-semibold">
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555] ">
                        BASIC WEBSITE
                    </li>
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555]">
                        E-COMMERCE WEBSITE
                    </li>
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555]">
                        CUSTOM CMS
                    </li>
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555]">
                        LANDING PAGES
                    </li>
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555]">
                        WEB / MOBILE APPLICATIONS
                    </li>
                    <li className="hover:text-purple-400 cursor-pointer border-t border-dotted py-4 border-[#555555]">
                        AMC
                    </li>
                </ul>
            </div>

            {/* RIGHT 3D GLASS MODEL */}
            <div className="w-[300px] h-[300px] self-center ">
                <ThreeGlass />
            </div>
        </div>
    );
}
