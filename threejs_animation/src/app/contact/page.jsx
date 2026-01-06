"use client";

import ContactForm from "../../components/allServicesComponents/ContactForm";
import ContactStatCard from "../../components/contact/ContactStatCard";
// Import the extracted component

const Contact = () => {
  return (
    <div>
      <section className="bg-[#0f0f0f] px-8 pt-28 pb-10 md:px-14 lg:px-28 md:pt-32 md:pb-16 lg:pt-44 lg:pb-20">
        <h2 className="text-3xl md:text-4xl xl:text-6xl text-[#fafafa] font-semibold xl:leading-[75px]">
          Let's imagine,{" "}
          <span className="bg-[#844de9] inline text-[#fafafa] px-2 rounded-md">
            work together,
          </span>{" "}
          and create side by side. We're excited to chat with you.
        </h2>

        <div className="relative mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 bg-[#0f0f0f] rounded-2xl">
          <ContactStatCard
            hasContent={true}
            title="Mumbai"
            address="Kanakia Wall Street, Mumbai, India"
            email="info@saaaconsultants.com"
            variant="location"
            roundedClass="rounded-2xl sm:rounded-tr-none sm:rounded-b-none"
            headQuarter={true}
          />

          <ContactStatCard
            hasContent={true}
            title="Sambhajinagar"
            address="Sambhajinagar, Maharashtra, India"
            email="info@saaaconsultants.com"
            variant="location"
            roundedClass="rounded-2xl sm:rounded-tr-2xl sm:rounded-b-none sm:rounded-tl-none"
          />

          {/* Card 3 */}
          <ContactStatCard
            title="Discuss your digital challenges."
            variant="contact"
            hasContent={true}
            contactPerson={{
              name: "Saurav Singh",
              role: "Co-Head, Digital Marketing / Business",
              image: "/images/about/saurav.webp",
            }}
            roundedClass="rounded-2xl sm:rounded-br-none sm:rounded-t-none"
          />

          {/* Empty Filler Card for Grid Layout */}
          <div className="hidden sm:block">
            <ContactStatCard
              hasContent={false}
              roundedClass="rounded-br-2xl h-full"
            />
          </div>
        </div>
      </section>

      <section className="w-full  bg-[#fafafa] flex flex-col lg:flex-row gap-5 lg:gap-0 items-stretch justify-center px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <div className="w-full lg:w-[50%] overflow-hidden">
          <h2 className="text-3xl md:text-4xl xl:text-5xl text-[#0f0f0f] font-semibold lg:leading-[60px]">
            Have a project to{" "}
            <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
              discuss?
            </span>{" "}
          </h2>
          <p className="text-base md:text-lg xl:text-xl text-[#9c9c9c] mt-4">
            If you’d like to know more then please get in touch with us.
          </p>
        </div>
        <div className="flex w-full lg:w-[50%]">
          <ContactForm btnPosition="right" />
        </div>
      </section>
    </div>
  );
};

export default Contact;
