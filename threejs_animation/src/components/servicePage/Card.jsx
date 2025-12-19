import React from 'react';
import ThreeGlass from '../servicePage/FloatingGlass'

const Card = React.forwardRef(({ title, items, description, modelUrl }, ref) => {
    return (
        <div
            ref={ref}
            className="absolute left-1/2 top-1/2 w-full lg:h-[490px]
        -translate-x-1/2 -translate-y-1/2
        rounded-2xl bg-[#555555]/10 backdrop-blur-xl
        border border-[#9C9C9C]
        p-8 flex lg:flex-row flex-col gap-8"
            style={{ willChange: 'transform' }}
        >
            {/* Left content */}
            <div className="w-full md:w-3/5 flex flex-col">
                <span
                    className="inline-block w-fit text-xl font-semibold text-[#FAFAFA]
            uppercase bg-[#844DE9] p-3.5 rounded-md mb-4"
                >
                    {title}
                </span>

                <p className="text-sm text-[#9C9C9C]">{description}</p>

                <ul className="flex flex-col pt-5 flex-1">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="text-[#fafafa] border-t border-dashed border-[#555555]
                py-2 md:py-3.5 uppercase text-lg"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right side – 3D */}
            <div className="flex md:w-2/5 items-center justify-center">
                <ThreeGlass
                    motionVariant={0}
                    speed={1.2}
                    amplitude={0.06}
                    mouseInfluence
                    modelUrl={modelUrl}
                />
            </div>
        </div>
    );
});

export default Card;
