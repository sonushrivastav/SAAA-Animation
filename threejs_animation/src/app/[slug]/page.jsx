"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ServiceLayout from "../../components/allServicesComponents/ServiceLayout";
import { servicesData } from "../../lib/serviceData";

export default function ServicePage() {
  const { slug } = useParams();
  const data = servicesData[slug];
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?populate=*`
        );
        const data = await res.json();
        console.log(data.data);

        setCaseStudies(data.data);
      } catch (error) {
        console.log("Error fetching case studies:", error);
      }
    };

    fetchCaseStudies();
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        Service not found 😕
      </div>
    );
  }

  return (
    <>
      <ServiceLayout data={data} caseStudies={caseStudies} />
    </>
  );
}
