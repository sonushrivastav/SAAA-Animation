// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import ServiceLayout from "../../components/allServicesComponents/ServiceLayout";
// import { servicesData } from "../../lib/serviceData";

// export default function ServicePage() {
//   const { slug } = useParams();
//   const data = servicesData[slug];
//   const [caseStudies, setCaseStudies] = useState([]);

//   useEffect(() => {
//     const fetchCaseStudies = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?populate=*`
//         );
//         const data = await res.json();
//         console.log(data.data);

//         setCaseStudies(data.data);
//       } catch (error) {
//         console.log("Error fetching case studies:", error);
//       }
//     };

//     fetchCaseStudies();
//   }, [slug]);

//   if (!data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-3xl">
//         Service not found 😕
//       </div>
//     );
//   }

//   return (
//     <>
//       <ServiceLayout data={data} caseStudies={caseStudies} />
//     </>
//   );
// }



"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { servicesData } from "../../lib/serviceData";

// Dynamic import ServiceLayout - it's very heavy with Three.js
const ServiceLayout = dynamic(
  () => import("../../components/allServicesComponents/ServiceLayout"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero skeleton */}
        <div className="h-screen bg-linear-to-r from-gray-100 to-gray-200 animate-pulse" />
        {/* Stats skeleton */}
        <div className="bg-[#0f0f0f] px-8 py-20">
          <div className="h-12 bg-gray-800 rounded w-3/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-50 bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#844de9] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#555555]">Loading service...</p>
      </div>
    </div>
  );
}

// Error/Not found component
function NotFoundState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] gap-4">
      <h1 className="text-4xl font-bold text-[#0f0f0f]">Service not found 😕</h1>
      <p className="text-[#555555]">The service you're looking for doesn't exist.</p>
      <a
        href="/services"
        className="mt-4 px-6 py-2 bg-[#844de9] text-white rounded-full hover:bg-[#6b3bc7] transition-colors"
      >
        View All Services
      </a>
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get static service data
  const data = servicesData?.[slug];

  useEffect(() => {
    // If no valid service data, skip fetching case studies
    if (!data) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCaseStudies = async () => {
      // Skip if no API URL configured
      if (!process.env.NEXT_PUBLIC_API_URL) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?populate=*`,
          { 
            signal: controller.signal,
            // Add cache headers for better performance
            next: { revalidate: 3600 } // Cache for 1 hour
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json();
        setCaseStudies(Array.isArray(responseData.data) ? responseData.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching case studies:", err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudies();

    return () => controller.abort();
  }, [slug, data]);

  // Show not found if service doesn't exist
  if (!data && !isLoading) {
    return <NotFoundState />;
  }

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return <ServiceLayout data={data} caseStudies={caseStudies} />;
}