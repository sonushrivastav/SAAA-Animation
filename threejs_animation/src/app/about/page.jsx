"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import DotGrid from "../../components/allServicesComponents/DotGrid";
import useDeviceType from "../../components/hooks/useDeviceType";

gsap.registerPlugin(ScrollTrigger);

const ourVision = [
  {
    title:
      "Sometimes they say I’m mad but a grain of madness is the best of Art.",
    img: "/images/about/ourVision_1.webp",
  },
  {
    title: "What would life be, if we had no courage to attempt anything?",
    img: "/images/about/ourVision_2.webp",
  },
  {
    title: "I am seeking, I am striving, I am in it with all my heart.",
    img: "/images/about/ourVision_3.webp",
  },
];

const teamMembers = [
  {
    image: "/images/about/saurav.webp",
    name: "Saurav Singh",
    role: "Co-Head, Digital Marketing",
  },
  {
    image: "/images/about/rohan.webp",
    name: "Rohan Matle",
    role: "Co-Head, Website Development",
  },
  {
    image: "/images/about/saurabh.webp",
    name: "Saurabh Rajguru",
    role: "Head, UI/UX Design",
  },
  {
    image: "/images/about/harsh.webp",
    name: "Harsh Pathak",
    role: "Head, Design",
  },
  {
    image: "/images/about/tejas.webp",
    name: "Tejas Naik Satham",
    role: "Co-Head, Digital Marketing",
  },
  {
    image: "/images/about/puja.webp",
    name: "Puja Naik",
    role: "Co-Head, Website Development",
  },
  {
    image: "/images/about/saurav.webp",
    name: "Saurav Singh",
    role: "Co-Head, Digital Marketing",
  },
  {
    image: "/images/about/rohan.webp",
    name: "Rohan Matle",
    role: "Co-Head, Website Development",
  },
  {
    image: "/images/about/saurabh.webp",
    name: "Saurabh Rajguru",
    role: "Head, UI/UX Design",
  },
  {
    image: "/images/about/harsh.webp",
    name: "Harsh Pathak",
    role: "Head, Design",
  },
  {
    image: "/images/about/tejas.webp",
    name: "Tejas Naik Satham",
    role: "Co-Head, Digital Marketing",
  },
  {
    image: "/images/about/puja.webp",
    name: "Puja Naik",
    role: "Co-Head, Website Development",
  },
];

const TeamCard = ({
  name = "Nati",
  role = "Managing Director",
  image = "/images/about/ourVision_1.webp",
  bgImage = "/images/about/ourVision_3.webp",
}) => {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="team-card relative     will-change-transform overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Base Image */}
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="front-image object-cover"
      />

      {/* Hover Reveal Image */}
      <Image
        src={bgImage}
        alt={name}
        fill
        className="hover-img object-cover absolute inset-0"
      />
      {/* Info */}
      <div className="info absolute bottom-4 left-3 text-[#fafafa]">
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm ">{role}</p>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  description,
  hasContent,
  roundedClass,
  isMobile = false,
  isTablet = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showEffects = isHovered || isMobile || isTablet;
  const textHighlightClass = showEffects ? "text-[#fafafa]" : "text-[#9C9C9C]";
  return (
    <div
      className={`relative p-4 md:p-6 lg:p-10 ${roundedClass} bg-[#55555520] md:bg-transparent transition-colors duration-300 w-full  xl:h-[350px]   ${
        hasContent
          ? `border-2 md:border ${
              isHovered ? "border-[#fafafa]" : "border-[#555555]"
            }`
          : isHovered
          ? "border border-[#555555]"
          : "border border-[#555555]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dot Grid - only show when conditions are met */}
      <div className="absolute inset-0 overflow-hidden">
        {(!hasContent || (hasContent && showEffects)) && (
          <DotGrid
            dotSize={2}
            gap={8}
            baseColor={!hasContent ? "#271e37" : "#271e37"}
            activeColor={!hasContent && showEffects ? "#fafafa" : "#844de9"}
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        )}
      </div>

      {/* Content */}
      {hasContent && (
        <div className="relative z-10 flex flex-col lg:gap-10  md:gap-6  gap-15 justify-between h-full">
          <h2
            className={`text-3xl md:text-2xl xl:text-4xl font-bold transition-colors duration-300 ${textHighlightClass}`}
          >
            {title}
          </h2>
          <p
            className={`text-base md:text-lg xl:text-xl mt-2 transition-colors  duration-300 ${textHighlightClass}`}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
const About = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  useLayoutEffect(() => {
    let ctx;
    const setup = async () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });

      ctx = gsap.context(() => {
        const parent = document.querySelector(".team-parent");

        const cards = gsap.utils.toArray(".team-card");

        const columns = isDesktop ? 6 : 3;

        // split cards into virtual rows
        const rows = cards.reduce((acc, card, index) => {
          const rowIndex = Math.floor(index / columns);
          acc[rowIndex] ??= [];
          acc[rowIndex].push(card);
          return acc;
        }, []);

        rows.forEach((rowCards, rowIndex) => {
          gsap.from(rowCards, {
            opacity: 0,
            scale: 0.1,
            y: 250,
            z: -4000,
            rotateX: 160,
            rotateY: 110,
            rotate: 65,
            duration: 8.65,
            ease: "power3.out",
            stagger: 1.15,

            scrollTrigger: {
              trigger: rowCards[0], // first card in row
              start: isMobile ? "top 100%" : "top 110%",
              end: isMobile ? "bottom center" : "bottom 60%",
              scrub: 1,
            },
          });
        });
      }, document);
    };

    setup();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [isDesktop]);

  return (
    <div>
      <section className=" w-full ">
        <Suspense fallback={<p>Loading video...</p>}>
          <video
            src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </Suspense>
      </section>

      {/* bit about us */}
      <section className="w-full  bg-[#0f0f0f] text-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
          A Bit{" "}
          <span className="bg-[#844de9] inline px-2  rounded-md">About Us</span>{" "}
          that
        </h2>

        <div className="mt-12 md:mt-14 bg-[#0f0f0f] text-[#9c9c9c] text-lg md:text-xl xl:text-2xl font-semibold">
          <p className="pb-6 ">
            SAAA Consultants is a multidisciplinary creative team built on one
            belief: different perspectives create better outcomes. We approach
            every brief with curiosity, craft and a commitment to doing work
            that genuinely helps people, businesses and communities grow.
          </p>

          <p className="pb-6">
            We’re not here to chase talent, we build it. Our culture is shaped
            by integrity, collaboration and a drive for excellence, creating an
            environment where ideas sharpen, skills grow and impact compounds.
          </p>

          <p className="pb-6">
            At our core, we’re problem-solvers who turn strategy into smart,
            beautiful execution — from branding and design to digital
            experiences and content. We move fast, stay honest and deliver work
            that’s crafted with intention and built to make a difference.
          </p>

          <Image
            className="w-full h-[300px] md:h-[450px] py-6"
            src={"/Image.png"}
            width={200}
            height={200}
            alt="aboutImage"
          />
          <p className="pt-6">
            At our core, we’re problem-solvers who turn strategy into smart,
            beautiful execution — from branding and design to digital
            experiences and content. We move fast, stay honest and deliver work
            that’s crafted with intention and built to make a difference.
          </p>
        </div>
      </section>

      {/* our vision */}
      <section className=" bg-[#fafafa] w-full  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
          Quotes That Gave Us{" "}
          <span className="bg-[#844de9] text-[#fafafa] inline px-2  rounded-md">
            Our Vision
          </span>
        </h2>

        <div className="mt-12 md:mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3  items-stretch">
          {ourVision.map((item, index) => (
            <div key={index} className="relative ">
              {/* Dotted border on right and bottom */}
              <div
                className="absolute w-full h-full rounded-xl transform translate-x-3 translate-y-3 pointer-events-none" // Use translate-x/y for the offset
                style={{
                  border: "2px dashed #844DE9", // Apply dashed border to all sides
                }}
              ></div>

              {/* Main card */}
              <div className="relative bg-white rounded-xl border-1 border-[#0f0f0f]  flex flex-col items-start  justify-between h-full">
                <div className="flex flex-col w-full gap-8  p-2">
                  {/* image */}
                  <div className="w-full  flex items-center justify-center    ">
                    <Image
                      src={item.img}
                      alt={"dummy image"}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover rounded-xl "
                    ></Image>
                  </div>
                  {/* text */}
                  <div className="relative w-full px-6 flex justify-between items-center pb-4">
                    <h3 className="text-lg md:text-xl xl:text-2xl uppercase font-semibold italic  text-[#0f0f0f] ">
                      {item.title}
                    </h3>
                    <svg
                      width="43"
                      height="31"
                      viewBox="0 0 43 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute -top-4 left-3"
                    >
                      <path
                        opacity="0.2"
                        d="M17.3406 4.56227C17.4187 4.56227 17.1063 5.03019 16.4033 5.96604C15.7784 6.90189 14.9973 8.0717 14.0599 9.47547C13.2007 10.8792 12.4587 12.244 11.8338 13.5698C13.2398 13.9598 14.4505 14.6226 15.4659 15.5585C16.5595 16.4164 17.3797 17.4302 17.9264 18.6C18.5513 19.6918 18.8638 20.7836 18.8638 21.8755C18.8638 24.605 17.9655 26.8277 16.1689 28.5434C14.4505 30.1811 12.2243 31 9.49046 31C6.99092 31 4.76476 30.0642 2.81199 28.1925C0.93733 26.2428 0 23.9421 0 21.2906C0 18.873 0.546776 16.5333 1.64033 14.2717C2.73388 11.9321 4.06176 9.78742 5.62398 7.83774C7.18619 5.88805 8.6703 4.25032 10.0763 2.92453C11.4823 1.52076 12.4587 0.545914 13.0054 0L17.3406 4.56227ZM41.4768 4.56227C41.555 4.56227 41.2425 5.03019 40.5395 5.96604C39.8365 6.90189 39.0163 8.0717 38.079 9.47547C37.2198 10.8792 36.4777 12.244 35.8529 13.5698C37.2589 13.9598 38.4696 14.6226 39.485 15.5585C40.5786 16.4164 41.4378 17.4302 42.0627 18.6C42.6876 19.6918 43 20.7836 43 21.8755C43 24.605 42.1017 26.8277 40.3052 28.5434C38.5867 30.1811 36.3215 31 33.5095 31C31.0881 31 28.901 30.0642 26.9482 28.1925C24.9955 26.2428 24.0191 23.9421 24.0191 21.2906C24.0191 18.873 24.5658 16.5333 25.6594 14.2717C26.753 11.9321 28.0808 9.78742 29.6431 7.83774C31.2053 5.88805 32.6894 4.25032 34.0954 2.92453C35.5014 1.52076 36.5168 0.545914 37.1417 0L41.4768 4.56227Z"
                        fill="#9C9C9C"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* collective */}
      <section className="bg-[#0f0f0f]  text-[#fafafa] w-full  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
          We are a{" "}
          <span className="bg-[#844de9] inline px-2  rounded-md">
            collective
          </span>{" "}
          of dedicated individuals committed to transforming ideas into
          captivating digital experiences.
        </h2>

        <div className=" relative mt-12 md:mt-14  grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-0 bg-[#0f0f0f] rounded-2xl overflow-hidden">
          <StatCard
            title="Innovative Customization"
            description="Our strategy centers on a research-focused approach, delving deep to gather insights. By understanding your business and market trends, we craft a customized strategy for relentless growth and long-term brand success."
            hasContent={true}
            roundedClass="rounded-2xl sm:rounded-r-none sm:rounded-b-none"
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {/* Card 2 */}
          <StatCard
            hasContent={false}
            roundedClass="rounded-tr-2xl sm:rounded-tr-none hidden sm:flex"
          />

          {/* Card 3 */}
          <StatCard
            title="Pinnacle Performance"
            description="Committed to excellence, our team has satisfied over 100 clients with relentless dedication. We strive for perfection, consistently exceeding expectations."
            hasContent={true}
            roundedClass="rounded-2xl sm:rounded-tr-2xl sm:rounded-b-none"
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {/* Card 4 */}
          <StatCard
            hasContent={false}
            roundedClass="sm:rounded-bl-2xl hidden sm:flex"
          />

          {/* Card 5 */}
          <StatCard
            title="Insightful Strategy"
            description="Thriving on creativity, our innovative process sets us apart. We craft customized strategies for a personalized experience tailored to your unique requirements."
            hasContent={true}
            roundedClass="rounded-2xl sm:rounded-b-none sm:rounded-t-none"
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {/* Card 6 */}
          <StatCard
            hasContent={false}
            roundedClass="rounded-br-2xl hidden sm:flex"
          />
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#fafafa]  text-[#0f0f0f] w-full min-h-screen   py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px] px-8">
          Meet The Team That Turns Work Into{" "}
          <span className="bg-[#844de9] text-[#fafafa] inline px-2  rounded-md">
            Wow
          </span>
        </h2>
        <div
          className="team-parent px-4 relative w-full mt-12 md:mt-14"
          style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
        >
          <div className="team-grid grid grid-cols-3 lg:grid-cols-6 gap-2  justify-center ">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={index}
                image={member.image}
                name={member.name}
                role={member.role}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
