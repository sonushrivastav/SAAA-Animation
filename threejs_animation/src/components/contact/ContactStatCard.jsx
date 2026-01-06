"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DotGrid from "../../components/allServicesComponents/DotGrid";
import useDeviceType from "../../components/hooks/useDeviceType";

const ContactStatCard = ({
  title,
  address,
  email,
  contactPerson,
  headQuarter,
  hasContent,
  variant = "location",
  roundedClass = "",
}) => {
  const { isMobile, isTablet } = useDeviceType();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for JS-dependent rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isContact = variant === "contact";
  const showEffects = isMounted && (isHovered || isMobile || isTablet);

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const textHighlightClass = showEffects ? "text-[#fafafa]" : "text-[#9C9C9C]";

  return (
    <div
      className={`
        relative p-4 md:p-6 lg:p-10 ${roundedClass}
        bg-[#55555520] md:bg-transparent transition-colors duration-300
        w-full h-[250px] md:h-[300px] lg:h-[300px]
        ${
          hasContent
            ? isHovered
              ? "border-2 md:border border-[#fafafa]"
              : "border-2 md:border border-[#555555]"
            : "border border-[#555555]"
        }
    `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dot Grid - Conditionally rendered for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {(!hasContent || (hasContent && showEffects)) && (
          <DotGrid
            dotSize={2}
            gap={8}
            baseColor={"#271e37"}
            activeColor={
              !hasContent ? "#fafafa" : showEffects ? "#844de9" : "#271e37"
            }
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        )}
      </div>

      {/* Location Content */}
      {!isContact && hasContent && (
        <div className="relative z-10 flex flex-col sm:justify-between gap-5 sm:gap-0 h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <h3
                className={`text-2xl md:text-4xl xl:text-4xl font-semibold transition-colors duration-300 ${textHighlightClass}`}
              >
                {title}
              </h3>
              {headQuarter && (
                <span
                  className={`text-lg md:text-xl xl:text-2xl font-bold transition-colors duration-300 ${textHighlightClass}`}
                >
                  HQ
                </span>
              )}
            </div>
            <p
              className={`text-base md:text-lg xl:text-xl mt-4 transition-colors duration-300 ${textHighlightClass}`}
            >
              {address}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-base text-[#9c9c9c]">Email</p>
            <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
              <a
                href={`mailto:${email}`}
                className={`text-base md:text-lg xl:text-xl font-[500] transition-colors duration-300 hover:underline ${textHighlightClass}`}
              >
                {email}
              </a>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`text-xs px-2 py-1 rounded-md bg-transparent text-[#fafafa] border border-[#666] transition-opacity duration-300 ${
                  showEffects ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Copy email address"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Person Content */}
      {isContact && (
        <div className="relative z-10 flex flex-col gap-5 md:gap-0 md:justify-between h-full">
          <h3
            className={`text-2xl md:text-4xl xl:text-4xl font-bold transition-colors duration-300 ${textHighlightClass}`}
          >
            {title}
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-6 items-center">
              <div className="w-20 h-20 lg:w-25 lg:h-25 rounded-full border-t-2 border-[#fafafa] border-b-2 overflow-hidden">
                {contactPerson?.image && (
                  <Image
                    src={contactPerson.image}
                    width={200}
                    height={200}
                    alt={contactPerson.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isHovered ? "grayscale-0" : "grayscale"
                    }`}
                  />
                )}
              </div>

              <div className="flex flex-row justify-between items-center flex-1">
                <div className="flex flex-col justify-center">
                  <h4
                    className={`text-sm md:text-lg xl:text-2xl font-bold transition-colors duration-300 ${textHighlightClass}`}
                  >
                    {contactPerson?.name}
                  </h4>
                  <p className="text-[#9C9C9C] text-sm md:text-base xl:text-base">
                    {contactPerson?.role}
                  </p>
                </div>

                {/* Call button (icon) tablet and higher */}
                <div
                  className={`hidden md:block transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <a
                    href="tel:+919307374941"
                    className="w-14 h-14 rounded-full border border-[#fafafa] flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      viewBox="0 0 56 56"
                      fill="none"
                      className="w-20 sm:w-auto rounded-[100%] border-t-2 border-[#fafafa] border-b-2"
                    >
                      <rect
                        width="56"
                        height="56"
                        rx="28"
                        fill="#FBFBFB"
                        fillOpacity="0.2"
                      />

                      <g clipPath="url(#clip0_7486_673)">
                        <path
                          d="M42.2105 34.7831L38.1635 30.736C36.7181 29.2907 34.261 29.8689 33.6828 31.7478C33.2492 33.0487 31.8039 33.7714 30.503 33.4822C27.6123 32.7596 23.7098 29.0016 22.9871 25.9663C22.5535 24.6654 23.4207 23.2201 24.7215 22.7865C26.6005 22.2084 27.1787 19.7512 25.7333 18.3059L21.6863 14.2588C20.53 13.2471 18.7955 13.2471 17.7838 14.2588L15.0376 17.005C12.2914 19.8958 15.3266 27.5562 22.1199 34.3495C28.9131 41.1427 36.5736 44.3226 39.4643 41.4318L42.2105 38.6856C43.2223 37.5293 43.2223 35.7948 42.2105 34.7831Z"
                          fill="#9C9C9C"
                        />
                      </g>

                      <defs>
                        <clipPath id="clip0_7486_673">
                          <rect
                            width="29"
                            height="29"
                            fill="white"
                            transform="translate(14 13.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </div>

                {/* Call Button (Mobile) */}
                <a
                  href="tel:+919307374941"
                  className={`md:hidden absolute bottom-0 right-[2%] text-xs px-3 py-1.5 rounded-md bg-transparent text-[#fafafa] border border-[#666] ${
                    showEffects ? "block" : "hidden"
                  }`}
                >
                  Call us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactStatCard;
