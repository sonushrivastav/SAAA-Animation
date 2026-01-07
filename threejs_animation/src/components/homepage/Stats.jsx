"use client";
import StatCard from "../allServicesComponents/StatCard";

const stats = [
  { stat: "100+", label: "accounts managed" },
  { stat: "1 Cr+", label: "total reach generated" },
  { stat: "150%", label: "follower growth achieved" },
  { stat: "4.5%", label: "average increase in engagement" },
];
export default function StatsSection({ isMobile, isTablet }) {
  return (
    <section className="w-full  bg-[#0f0f0f] text-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 ">
      <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
        Here are some{" "}
        <span className="bg-[#844de9]  px-2  rounded-md">key figures</span> that
        illustrate our growth and commitment to our clients.
      </h2>

      {/* Stats Grid Section */}
      <div className=" relative mt-12 md:mt-14  grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 bg-[#0f0f0f] rounded-2xl ">
        <StatCard
          stat={stats[0].stat}
          label={stats[0].label}
          hasContent={true}
          roundedClass="rounded-2xl sm:rounded-tr-none sm:rounded-b-none"
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Card 2 */}
        <StatCard
          stat={stats[1].stat}
          label={stats[1].label}
          hasContent={true}
          isMobile={isMobile}
          isTablet={isTablet}
          roundedClass="rounded-2xl sm:rounded-none"
        />

        {/* Card 3 */}
        <StatCard
          hasContent={false}
          roundedClass="sm:rounded-tr-2xl hidden sm:flex"
        />

        {/* Card 4 */}
        <StatCard
          hasContent={false}
          roundedClass="sm:rounded-bl-2xl hidden sm:flex"
        />

        {/* Card 5 */}
        <StatCard
          stat={stats[2].stat}
          label={stats[2].label}
          hasContent={true}
          roundedClass="rounded-2xl sm:rounded-none"
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Card 6 */}
        <StatCard
          stat={stats[3].stat}
          label={stats[3].label}
          hasContent={true}
          roundedClass="rounded-2xl sm:rounded-bl-none sm:rounded-t-none"
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </div>
    </section>
  );
}
