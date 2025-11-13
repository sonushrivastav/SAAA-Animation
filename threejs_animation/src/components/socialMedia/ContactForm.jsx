'use client';
import { useState } from 'react';

export default function ContactForm() {
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

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            setSubmitted(true);
            alert('Form submitted successfully ✅');
            console.log('Form Data:', formData);
        }
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-transparent border border-[#0f0f0f] rounded-xl shadow-sm w-full p-6 md:p-10 z-10"
        >
            {/* Name fields */}
            <div className="w-full flex flex-col md:flex-row gap-6 mb-2">
                <div className="w-full">
                    <input
                        name="firstName"
                        type="text"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full border ${
                            errors.firstName ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="w-full">
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full  border ${
                            errors.lastName ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 outline-none text-[#0f0f0f] placeholder-[#9c9c9c]`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
            </div>

            {/* Email + Phone */}
            <div className="flex flex-col md:flex-row gap-6 mb-2">
                <div className="w-full">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Id *"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full  border ${
                            errors.email ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 placeholder-[#9c9c9c]`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="w-full">
                    <input
                        name="number"
                        type="tel"
                        placeholder="Number *"
                        value={formData.number}
                        onChange={handleChange}
                        className={`w-full border ${
                            errors.number ? 'border-red-500' : 'border-[#9C9C9C]'
                        } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 placeholder-[#9c9c9c]`}
                    />
                    {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
                </div>
            </div>

            {/* Dropdown */}
            <div className="mt-3 w-full">
                <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className={`w-full border ${
                        errors.interest ? 'border-red-500' : 'border-[#9C9C9C]'
                    } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 placeholder-[#9c9c9c]`}
                >
                    <option value="">Interested in*</option>
                    <option value="services">Option 1</option>
                    <option value="partnership">Option 2</option>
                    <option value="support">Option 3</option>
                </select>
                {errors.interest && <p className="text-red-500 text-sm">{errors.interest}</p>}
            </div>

            <div className="mt-3 w-full">
                <textarea
                    name="message"
                    placeholder="Type your message here..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full border ${
                        errors.message ? 'border-red-500' : 'border-[#9C9C9C]'
                    } bg-[#fafafa] focus:ring-1 focus:ring-[#844de9] rounded-md p-3 placeholder-[#9c9c9c]`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>

            {/* Submit */}
            <div className="w-full flex items-center justify-end mt-3">
                <button
                    className="bg-[#844de9] px-4 py-2 rounded-lg text-[#fafafa] text-xl font-semibold"
                    type="submit"
                >
                    Submit
                </button>
            </div>

            {submitted && (
                <p className="text-green-600 mt-3 font-medium">✅ Submitted Successfully!</p>
            )}
        </form>
    );
}
