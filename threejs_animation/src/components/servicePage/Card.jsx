// "use client";
// import Link from "next/link";
// import React from "react";
// import ThreeGlass from "../servicePage/FloatingGlass";

// const Card = React.forwardRef(
//   ({ title, items, description, modelUrl, isVisible }, ref) => {
//     return (
//       <div
//         ref={ref}
//         className="absolute left-1/2 top-1/2 w-full lg:h-[420px] xl:h-[420px] 2xl:h-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#555555]/10 backdrop-blur-xl border border-[#9C9C9C] px-8 py-8 md:py-2 xl:py-6 2xl:py-8 flex md:flex-row flex-col gap-8"
//         style={{ willChange: "transform" }}
//       >
//         {/* Left content */}
//         <div className="w-full md:w-3/5 flex flex-col">
//           <span
//             className="inline-block w-fit text-xl font-semibold text-[#FAFAFA]
//             uppercase bg-[#844DE9] px-2 py-1 xl:px-2 xl:py-1 2xl:px-4 2xl:py-2 rounded-md mb-2 xl:mb-3"
//           >
//             {title}
//           </span>

//           <p className="text-sm xl:text-base text-[#9C9C9C]">{description}</p>

//           <ul className="flex flex-col pt-2 xl:pt-5 flex-1">
//             {items.map((item, i) => (
//               <li
//                 key={i}
//                 className="text-[#fafafa] border-t border-dashed border-[#555555]
//                 py-2 md:py-3 xl:py-2 2xl:py-4 uppercase text-base xl:text-base 2xl:text-xl "
//               >
//                 <Link href={item.href} className="hover-underline-animation">
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right side – 3D */}

//         <div className="flex h-[200px] md:h-auto md:w-2/5 items-center justify-center overflow-hidden">
//           <ThreeGlass
//             motionVariant={0}
//             speed={1.2}
//             amplitude={0.06}
//             mouseInfluence
//             modelUrl={modelUrl}
//             rotateY={true}
//           />
//         </div>
//       </div>
//     );
//   }
// );

// export default Card;




// src/components/servicePage/Card.jsx
"use client";

import Link from "next/link";
import React, { memo, useEffect, useRef, useState } from "react";
import ThreeGlass from "./FloatingGlass";

// ✅ Direct import - no dynamic (same as Home page)

const Card = memo(
  React.forwardRef(({ title, items, description, modelUrl }, ref) => {
    const cardRef = useRef(null);
    const [is3DVisible, setIs3DVisible] = useState(false);

    const setRefs = (el) => {
      cardRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    // ✅ Load 3D when card enters viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIs3DVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "100px", threshold: 0.1 }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={setRefs}
        className="absolute left-1/2 top-1/2 w-full lg:h-105 xl:h-105 2xl:h-140 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#555555]/10 backdrop-blur-xl border border-[#9C9C9C] px-8 py-8 md:py-2 xl:py-6 2xl:py-8 flex md:flex-row flex-col gap-8"
        style={{ willChange: "transform" }}
      >
        {/* Left content */}
        <div className="w-full md:w-3/5 flex flex-col">
          <span className="inline-block w-fit text-xl font-semibold text-[#FAFAFA] uppercase bg-[#844DE9] px-2 py-1 xl:px-2 xl:py-1 2xl:px-4 2xl:py-2 rounded-md mb-2 xl:mb-3">
            {title}
          </span>

          <p className="text-sm xl:text-base text-[#9C9C9C]">{description}</p>

          <ul className="flex flex-col pt-2 xl:pt-5 flex-1">
            {items.map((item, i) => (
              <li
                key={i}
                className="text-[#fafafa] border-t border-dashed border-[#555555] py-2 md:py-3 xl:py-2 2xl:py-4 uppercase text-base xl:text-base 2xl:text-xl"
              >
                <Link href={item.href} className="hover-underline-animation">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side – 3D (instant render when visible) */}
        <div className="flex h-50 md:h-auto md:w-2/5 items-center justify-center overflow-hidden">
          {is3DVisible && (
            <ThreeGlass
              motionVariant={0}
              speed={1.2}
              amplitude={0.06}
              mouseInfluence
              modelUrl={modelUrl}
              rotateX={false}
            />
          )}
        </div>
      </div>
    );
  })
);

Card.displayName = "Card";

export default Card;