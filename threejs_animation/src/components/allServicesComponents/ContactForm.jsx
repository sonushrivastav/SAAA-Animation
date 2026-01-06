'use client';
import { useState } from 'react';

export default function ContactForm({ btnPosition = 'right' }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        interest: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state

    const validate = () => {
        let temp = {};

        if (!formData.firstName.trim()) temp.firstName = 'First Name is required';
        if (!formData.lastName.trim()) temp.lastName = 'Last Name is required';

        if (!formData.email.trim()) temp.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) temp.email = 'Enter a valid email';

        if (!formData.number.trim()) temp.number = 'Mobile number is required';
        else if (!/^\d{10}$/.test(formData.number)) temp.number = 'Enter 10-digit mobile number';

        if (!formData.interest) temp.interest = 'Please select an interest';

        if (!formData.message.trim()) temp.message = 'Message is required';

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async e => {

        e.preventDefault();

        if (validate()) {
            setLoading(true);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/contact-forms`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Strapi expects the payload to be wrapped in a "data" object
                        body: JSON.stringify({ data: formData }),
                    }
                );

                const data = await response.json();
                console.log('form data', data);

                if (!response.ok) {
                    throw new Error(data.error?.message || 'Something went wrong');
                }

                // Success logic
                setSubmitted(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    number: '',
                    interest: '',
                    message: '',
                });
                console.log('Saved to Strapi:', data);
            } catch (error) {
                console.error('Submission error:', error);
                alert(`Error: ${error.message}`);
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-transparent  text-[#0f0f0f]  w-full  z-10">
            {/* Name fields */}
            <div className="w-full flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full">
                    <label className="" htmlFor="firstName">
                        Full Name *
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full mt-2 italic border ${
                            errors.firstName ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa]  focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="w-full">
                    <label className="" htmlFor="lastName">
                        Last Name *
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full mt-2 italic border ${
                            errors.lastName ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
            </div>

            {/* Email + Phone */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full">
                    <label className="" htmlFor="email">
                        Email Id *
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full mt-2 italic border ${
                            errors.email ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="w-full">
                    <label className="" htmlFor="number">
                        Number *
                    </label>
                    <input
                        id="number"
                        name="number"
                        type="tel"
                        placeholder="+91"
                        value={formData.number}
                        onChange={handleChange}
                        className={`w-full mt-2 italic border ${
                            errors.number ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
                </div>
            </div>

            {/* Dropdown */}
            <div className="mb-6 w-full">
                <label className="" htmlFor="interest">
                    Interested in *
                </label>
                <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className={`w-full mt-2 italic border ${
                        errors.interest ? 'border-red-500' : 'border-[#9C9C9C]'
                    } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                >
                    <option value="">Select an option</option>
                    <option value="Branding-Designing">Branding/ Designing</option>
                    <option value="UI-UX Design">UI/UX Design</option>
                    <option value="Web-Development">Web Development</option>
                    <option value="Digital-Marketing">Digital Marketing</option>
                    <option value="Investor-Relations">Investor Relations</option>
                    <option value="Financial-Advisory">Financial Advisory</option>
                    <option value="Legal-advice">Legal advice</option>
                </select>
                {errors.interest && <p className="text-red-500 text-sm">{errors.interest}</p>}
            </div>

            <div className="mb-6 w-full">
                <label className="" htmlFor="message">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full mt-2 italic border ${
                        errors.message ? 'border-red-500' : 'border-[#9C9C9C]'
                    } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>

            {/* Submit */}
            <div
                className={`w-full flex items-center  mt-3 ${
                    btnPosition === 'left' ? 'justify-start' : 'justify-end'
                }`}
            >
                <button
                    className="bg-[#0f0f0f] px-4 py-2 rounded-full text-[#fafafa] text-xl font-semibold"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Submit'}
                </button>
            </div>

            {submitted && (
                <p className="text-green-600 mt-3 font-medium">✅ Submitted Successfully!</p>
            )}
        </form>
    );
}
