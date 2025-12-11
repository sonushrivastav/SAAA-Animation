import ServiceLayout from '../../../components/allServicesComponents/ServiceLayout';
import { servicesData } from '../../../lib/serviceData';

export default function ServicePage({ params }) {
    const { slug } = params;
    const data = servicesData[slug];

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl">
                Service not found 😕
            </div>
        );
    }

    return (
        <>
            <ServiceLayout data={data} />
        </>
    );
}
